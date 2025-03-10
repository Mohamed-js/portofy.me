"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Label from "@/components/Label";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SiteSettingsForm({ user, setUser, saving }) {
  const [billingStep, setBillingStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [verificationInstructions, setVerificationInstructions] =
    useState(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Upgrade successful! You’re now on Pro.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpgrade = () => {
    setBillingStep(true);
  };

  const handleBillingChoice = async (billingPeriod) => {
    setLoading(true);
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

  const effectivePlan = user.effectivePlan || "free"; // Use effectivePlan from MyAccount

  const handleVerifyDomain = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/domain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: user.customDomain }),
      });
      const result = await res.json();
      if (result.success) {
        if (result.verified) {
          setUser((prev) => ({ ...prev, domainVerified: true }));
          toast.success("Domain verified successfully!");
        } else {
          setVerificationInstructions(result.instructions);
          toast.info("Please add the TXT record to verify your domain.");
        }
      } else {
        throw new Error(result.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold text-white">
        Site Settings & Plan
      </h3>

      {!billingStep ? (
        <>
          {/* Theme */}
          <div>
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              name="theme"
              value={user.theme || "minimal"}
              onChange={handleChange}
              disabled={effectivePlan === "free"}
              className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            >
              <option value="minimal">Minimal</option>
              <option disabled={effectivePlan === "free"} value="modern">
                Modern
              </option>
              <option disabled={effectivePlan === "free"} value="classic">
                Classic
              </option>
            </select>
            {effectivePlan === "free" && (
              <p className="text-gray-400 mt-2 text-sm">
                All themes available with Pro –{" "}
                <button
                  onClick={handleUpgrade}
                  className="text-[#e45053] hover:text-[#fd9c46]"
                >
                  Upgrade Now
                </button>
              </p>
            )}
          </div>

          {/* Custom Domain */}
          <div>
            <Label htmlFor="customDomain">Custom Domain</Label>
            <div className="flex items-center gap-2">
              <input
                id="customDomain"
                name="customDomain"
                type="text"
                value={user.customDomain || ""}
                onChange={handleChange}
                placeholder="e.g., yourdomain.com"
                disabled={effectivePlan === "free" || saving}
                className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
              />
              {effectivePlan === "pro" &&
                user.customDomain &&
                !user.domainVerified && (
                  <button
                    onClick={handleVerifyDomain}
                    disabled={verifying || saving}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50"
                  >
                    {verifying ? "Verifying..." : "Verify"}
                  </button>
                )}
            </div>
            {effectivePlan === "free" && (
              <p className="text-gray-400 mt-2 text-sm">
                Custom domains available with Pro –{" "}
                <button
                  onClick={handleUpgrade}
                  className="text-[#e45053] hover:text-[#fd9c46]"
                >
                  Upgrade Now
                </button>
              </p>
            )}
            {verificationInstructions && !user.domainVerified && (
              <p className="text-gray-300 mt-2 text-sm">
                {verificationInstructions.message}
              </p>
            )}
            {user.domainVerified && (
              <p className="text-green-400 mt-2 text-sm">Domain verified ✓</p>
            )}
          </div>

          {/* Plan Info */}
          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
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
                  className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
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
                disabled={saving}
                className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white/10 p-6 rounded-lg border border-white/20">
          <h4 className="text-lg font-semibold text-white mb-4">
            Choose Your Pro Billing
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleBillingChoice("monthly")}
              disabled={saving || loading}
              className="px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && billingPeriod === "monthly" ? (
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
              disabled={saving || loading}
              className="px-5 py-4 text-sm font-semibold text-white bg-white/20 border border-white/20 rounded-md hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && billingPeriod === "annual" ? (
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
        </div>
      )}
    </div>
  );
}
