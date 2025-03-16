"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

export default function SubscriptionClient({ initialUser }) {
  const [user, setUser] = useState(JSON.parse(initialUser));
  const [billingStep, setBillingStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const searchParams = useSearchParams();

  const effectivePlan = user.effectivePlan || "free";

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Upgrade successful! You’re now on Pro.");
      fetchUserData();
    }
    fetchExchangeRate();
  }, [searchParams]);

  const fetchExchangeRate = async () => {
    try {
      const res = await fetch("/api/paymob/exchange-rate");
      const data = await res.json();
      if (data.success) setExchangeRate(data.rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setExchangeRate(50.6); // Fallback
    }
  };

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

  const handleBillingChoice = async (billingPeriod, paymentMethod) => {
    setSelectedBillingPeriod(billingPeriod);
    setSelectedPaymentMethod(paymentMethod);
    setLoading(true);

    try {
      const res = await fetch("/api/paymob/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod, paymentMethod }),
      });
      const { success, paymentKey, orderId, amountEGP } = await res.json();
      if (!success) throw new Error("Failed to initiate payment");

      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
      window.location.href = iframeUrl;
    } catch (error) {
      toast.error(error.message || "Payment initiation failed");
      setLoading(false);
      setSelectedBillingPeriod(null);
      setSelectedPaymentMethod(null);
    }
  };

  const monthlyEGP = exchangeRate ? Math.round(8 * exchangeRate) : 405;
  const annualEGP = exchangeRate ? Math.round(80 * exchangeRate) : 4050;

  return (
    <div className="bg-white/10 p-6 rounded-lg border border-white/20 max-w-lg">
      {!billingStep ? (
        <>
          <h4 className="text-lg font-semibold text-white mb-4">Your Plan</h4>
          <p className="text-gray-300">
            Current Plan: {effectivePlan === "pro" ? "Pro" : "Free"}
          </p>
          {effectivePlan === "pro" && user.subscriptionEnd && (
            <p className="text-gray-300">
              Subscription Ends:{" "}
              {new Date(user.subscriptionEnd).toLocaleDateString()}
            </p>
          )}
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
            <div>
              <button
                onClick={() => handleBillingChoice("monthly", "card")}
                disabled={loading}
                className="w-full px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading &&
                selectedBillingPeriod === "monthly" &&
                selectedPaymentMethod === "card" ? (
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
                    <span className="text-xl font-bold">{monthlyEGP} EGP</span>
                    /month (Card)
                  </>
                )}
              </button>
              <button
                onClick={() => handleBillingChoice("monthly", "wallet")}
                disabled={loading}
                className="w-full mt-2 px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading &&
                selectedBillingPeriod === "monthly" &&
                selectedPaymentMethod === "wallet" ? (
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
                    <span className="text-xl font-bold">{monthlyEGP} EGP</span>
                    /month (Wallet)
                  </>
                )}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleBillingChoice("annual", "card")}
                disabled={loading}
                className="w-full px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading &&
                selectedBillingPeriod === "annual" &&
                selectedPaymentMethod === "card" ? (
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
                    <span className="text-xl font-bold">{annualEGP} EGP</span>
                    /year (Card){" "}
                    <span className="text-[#e45053]">(Save ~17%)</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleBillingChoice("annual", "wallet")}
                disabled={loading}
                className="w-full mt-2 px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading &&
                selectedBillingPeriod === "annual" &&
                selectedPaymentMethod === "wallet" ? (
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
                    <span className="text-xl font-bold">{annualEGP} EGP</span>
                    /year (Wallet){" "}
                    <span className="text-[#e45053]">(Save ~17%)</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setBillingStep(false);
              setSelectedBillingPeriod(null);
              setSelectedPaymentMethod(null);
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
