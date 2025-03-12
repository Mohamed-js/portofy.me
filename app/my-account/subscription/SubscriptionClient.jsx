"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SubscriptionClient({ initialUser }) {
  const [user, setUser] = useState(JSON.parse(initialUser));
  const [billingStep, setBillingStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null); // New state
  const searchParams = useSearchParams();

  const effectivePlan = user.effectivePlan || "free";

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Upgrade successful! You’re now on Pro.");
      fetchUserData();
    }
  }, [searchParams]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setUser({
          ...data.user,
          _id: data.user._id.toString(),
          effectivePlan:
            data.user.plan === "pro" &&
            data.user.subscriptionEnd &&
            new Date(data.user.subscriptionEnd) > new Date()
              ? "pro"
              : "free",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUpgrade = () => {
    setBillingStep(true);
  };

  const handleBillingChoice = async (billingPeriod) => {
    setLoading(true);
    setSelectedBillingPeriod(billingPeriod); // Track the selected period
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod }),
      });
      const { success, sessionId, message } = await res.json();

      if (!success) {
        throw new Error(message || "Failed to initiate checkout");
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      toast.error(error.message || "Checkout failed");
      setBillingStep(false);
      setSelectedBillingPeriod(null); // Reset on failure
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { success, url, message } = await res.json();
      if (success) {
        window.location.href = url;
      } else {
        throw new Error(message || "Failed to open subscription portal");
      }
    } catch (error) {
      toast.error(error.message || "Failed to manage subscription");
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-lg border border-white/20 max-w-lg">
      {!billingStep ? (
        <>
          <h4 className="text-lg font-semibold text-white mb-4">Your Plan</h4>
          <p className="text-gray-300">
            Current Plan: {effectivePlan === "pro" ? "Pro" : "Free"}
          </p>
          {effectivePlan === "pro" && user.subscriptionEnd && (
            <>
              <p className="text-gray-300">
                Subscription Ends:{" "}
                {new Date(user.subscriptionEnd).toLocaleDateString()}
              </p>
              <button
                onClick={handleManageSubscription}
                className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed my-4 transition-all duration-200"
              >
                Manage Subscription
              </button>
            </>
          )}
          {user.plan === "pro" &&
            user.subscriptionEnd &&
            new Date(user.subscriptionEnd) <= new Date() && (
              <p className="text-red-400 mt-2">
                Your Pro subscription has expired. Upgrade to restore Pro
                features.
              </p>
            )}
          <p className="text-gray-300">
            Storage Used: {(user.storageUsed / 1024 / 1024).toFixed(2)} MB /{" "}
            {effectivePlan === "pro" ? "1000" : "20"} MB
          </p>
          {effectivePlan === "free" && (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upgrade to Pro
            </button>
          )}
        </>
      ) : (
        <>
          <h4 className="text-lg font-semibold text-white mb-4">
            Choose Your Pro Billing
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleBillingChoice("monthly")}
              disabled={loading}
              className="px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && selectedBillingPeriod === "monthly" ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    className="opacity-75"
                  />
                </svg>
              ) : (
                <>
                  <span className="text-xl font-bold">$9</span>/month
                </>
              )}
            </button>
            <button
              onClick={() => handleBillingChoice("annual")}
              disabled={loading}
              className="px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && selectedBillingPeriod === "annual" ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    className="opacity-75"
                  />
                </svg>
              ) : (
                <>
                  <span className="text-xl font-bold">$90</span>/year{" "}
                  <span className="text-[#e45053]">(Save ~17%)</span>
                </>
              )}
            </button>
          </div>
          <button
            onClick={() => setBillingStep(false)}
            className="mt-4 w-full px-5 py-2.5 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}
