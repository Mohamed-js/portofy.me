"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

export default function SubscriptionClient({ initialUser }) {
  const [user, setUser] = useState(JSON.parse(initialUser));
  const [billingStep, setBillingStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);
  const searchParams = useSearchParams();

  const effectivePlan = user.effectivePlan || "free";

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Purchase successful! You’re now on Pro.");
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
          effectivePlan: data.user.plan === "pro" ? "pro" : "free",
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
    if (!["monthly", "annual"].includes(billingPeriod)) {
      toast.error("Invalid billing period selected");
      return;
    }

    setSelectedBillingPeriod(billingPeriod);
    setLoading(true);

    try {
      const res = await fetch("/api/paymob/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod }),
      });
      const data = await res.json();

      if (!data.success)
        throw new Error(data.message || "Failed to initiate payment");

      window.location.href = data.iframeUrl;
    } catch (error) {
      toast.error(error.message || "Payment initiation failed");
      setLoading(false);
      setSelectedBillingPeriod(null);
    }
  };

  const monthlyUSD = 8;
  const annualUSD = 80;

  return (
    <div className="bg-white/10 p-6 rounded-lg border border-white/20 max-w-lg">
      {!billingStep ? (
        <>
          <h4 className="text-lg font-semibold text-white mb-4">Your Plan</h4>
          <p className="text-gray-300">
            Current Plan: {effectivePlan === "pro" ? "Pro" : "Free"}
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
            Choose Your Pro Plan
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <button
                onClick={() => handleBillingChoice("monthly")}
                disabled={loading}
                className="w-full px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <span className="text-xl font-bold">${monthlyUSD}</span>
                    /month
                  </>
                )}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleBillingChoice("annual")}
                disabled={loading}
                className="w-full px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <span className="text-xl font-bold">${annualUSD}</span>
                    /year <span className="text-[#e45053]">(Save ~17%)</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setBillingStep(false);
              setSelectedBillingPeriod(null);
              setLoading(false);
            }}
            className="mt-4 w-full px-5 py-2.5 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}
