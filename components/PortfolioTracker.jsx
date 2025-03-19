"use client";
import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";

const PortfolioTracker = ({ portfolioId }) => {
  const eventQueue = useRef([]);
  const device =
    typeof window !== "undefined" && window.innerWidth < 768
      ? "mobile"
      : "desktop";
  const screenWidth = typeof window !== "undefined" && window.innerWidth;
  const referrer = typeof document !== "undefined" && document.referrer;
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

  useEffect(() => {
    if (!portfolioId) return;

    // Fire page view event once
    queueEvent("page_view", "landing");

    // Debounced Scroll Tracking
    const handleScroll = debounce(() => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.body.scrollHeight) *
          100
      );
      if (scrollPercent >= 25) queueEvent("scroll_depth", "25%");
      if (scrollPercent >= 50) queueEvent("scroll_depth", "50%");
      if (scrollPercent >= 75) queueEvent("scroll_depth", "75%");
      if (scrollPercent >= 100) queueEvent("scroll_depth", "100%");
    }, 500);

    // Click Tracking
    const handleClick = (e) => {
      const target = e.target.closest("a, button");
      if (target) {
        const text = target.innerText || target.href || "unknown";
        queueEvent("click", text);
      }
    };

    // Visibility change - tab goes to background
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        eventQueue.current.length > 0
      ) {
        flushQueue({ useBeacon: true });
      }
    };

    // Pagehide - tab unloads (close, reload, nav away)
    const handlePageHide = () => {
      if (eventQueue.current.length > 0) {
        flushQueue({ useBeacon: true });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    // Periodic flush every 5 seconds (in case user stays long)
    const flushInterval = setInterval(() => {
      if (eventQueue.current.length > 0) {
        flushQueue();
      }
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      clearInterval(flushInterval);
      if (eventQueue.current.length > 0) {
        flushQueue();
      }
    };
  }, [portfolioId]);

  const queueEvent = (type, value) => {
    eventQueue.current.push({
      type,
      value,
      device,
      screenWidth,
      referrer,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  };

  const flushQueue = async ({ useBeacon = false } = {}) => {
    const eventsToSend = [...eventQueue.current];
    eventQueue.current = [];

    try {
      const body = JSON.stringify({
        portfolioId,
        events: eventsToSend,
      });

      if (useBeacon && navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/portfolio/analytics", blob);
      } else {
        await fetch("/api/portfolio/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
      }
    } catch (err) {
      console.error("Analytics flush failed", err);
      eventQueue.current = [...eventsToSend, ...eventQueue.current];
    }
  };

  return null;
};

export default PortfolioTracker;
