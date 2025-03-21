"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Label from "@/components/Label";
import QRCodeGenerator from "../QRCodeGenerator";

export default function SiteSettingsForm({ portfolio, setPortfolio, saving }) {
  const [verifying, setVerifying] = useState(false);
  const [verificationInstructions, setVerificationInstructions] =
    useState(null);

  const effectivePlan = portfolio.effectivePlan || "free";

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "customDomain" && value !== portfolio.customDomain) {
      // Reset domainVerified when customDomain changes
      setPortfolio((prev) => ({
        ...prev,
        [name]: value,
        domainVerified: false, // Reset verification status
      }));
      setVerificationInstructions(null); // Clear old instructions
    } else {
      setPortfolio((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVerifyDomain = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/domain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: portfolio.customDomain,
          portfolioId: portfolio._id,
        }),
      });
      const result = await res.json();
      if (result.success) {
        if (result.verified) {
          setPortfolio((prev) => ({ ...prev, domainVerified: true }));
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
        Site Settings
      </h3>

      {/* Type */}
      <p className="capitalize mb-4">
        <Label>App Type: {portfolio.type.split("-").join(" ")}</Label>
      </p>

      {/* Theme */}
      <div>
        <Label htmlFor="theme">Theme</Label>
        <select
          id="theme"
          name="theme"
          value={portfolio.theme || "minimal"}
          onChange={handleChange}
          disabled={effectivePlan === "free" || saving}
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
        >
          <option value="minimal">Minimal</option>
          <option disabled={effectivePlan === "free"} value="flames">
            Flames
          </option>
          <option disabled={effectivePlan === "free"} value="modern">
            Modern
          </option>
        </select>
        {effectivePlan === "free" && (
          <p className="text-gray-400 mt-2 text-sm">
            All themes available with Pro –{" "}
            <a
              href="/my-account/subscription"
              className="text-[#e45053] hover:text-[#fd9c46]"
            >
              Upgrade Now
            </a>
          </p>
        )}
      </div>

      {/* FONT */}
      <div>
        <Label htmlFor="font">Font</Label>
        <select
          id="font"
          name="font"
          value={portfolio.font || "minimal"}
          onChange={handleChange}
          disabled={effectivePlan === "free" || saving}
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
        >
          <option value="poppins">Poppins</option>
          <option value="openSans">Open Sans</option>
          <option value="roboto">Roboto</option>
          <option disabled={effectivePlan === "free"} value="robotoSlab">
            Roboto Slab
          </option>
          <option disabled={effectivePlan === "free"} value="almarai">
            Almarai
          </option>
          <option disabled={effectivePlan === "free"} value="changa">
            Changa
          </option>
          <option disabled={effectivePlan === "free"} value="tajawal">
            Tajawal
          </option>
          <option disabled={effectivePlan === "free"} value="merriweatherSans">
            Merriweather Sans
          </option>
          <option disabled={effectivePlan === "free"} value="cairo">
            Cairo
          </option>
          <option disabled={effectivePlan === "free"} value="lato">
            Lato
          </option>
        </select>
        {effectivePlan === "free" && (
          <p className="text-gray-400 mt-2 text-sm">
            All fonts available with Pro –{" "}
            <a
              href="/my-account/subscription"
              className="text-[#e45053] hover:text-[#fd9c46]"
            >
              Upgrade Now
            </a>
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
            value={portfolio.customDomain || ""}
            onChange={handleChange}
            placeholder="e.g., yourdomain.com"
            disabled={effectivePlan === "free" || saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
          />
          {effectivePlan === "pro" &&
            portfolio.customDomain &&
            !portfolio.domainVerified && (
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
            <a
              href="/my-account/subscription"
              className="text-[#e45053] hover:text-[#fd9c46]"
            >
              Upgrade Now
            </a>
          </p>
        )}
        {verificationInstructions && !portfolio.domainVerified && (
          <p className="text-gray-300 mt-2 text-sm">
            {verificationInstructions.message}
          </p>
        )}
        {portfolio.domainVerified && (
          <p className="text-green-400 mt-2 text-sm">Domain verified ✓</p>
        )}
      </div>

      {/* QR GENERATOR */}
      <QRCodeGenerator slug={portfolio.slug} title={portfolio.title} />
    </div>
  );
}
