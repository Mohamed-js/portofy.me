"use client";

import { useState } from "react";
import Link from "next/link";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-16" id="pricing">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Choose Your Plan</h2>
        {/* Toggle Switch */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span
            className={`text-sm font-medium ${
              !isAnnual ? "text-white" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex items-center h-6 w-11 rounded-full bg-gray-700 transition-colors duration-200 focus:outline-none"
            aria-label="Toggle billing period"
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${
                isAnnual ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              isAnnual ? "text-white" : "text-gray-400"
            }`}
          >
            Annually <span className="text-[#e45053]">(Save ~17%)</span>
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white border border-white/20 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Free</h3>
              <p className="text-3xl font-bold mb-6">
                $0<span className="text-sm">/month</span>
              </p>
              <ul className="text-left text-gray-300 space-y-3 mb-8">
                <li>Unlimited Visitors</li>
                <li>Animated Page</li>
                <li>1 Theme (Minimal)</li>
                <li>URL (portofy.me/@username)</li>
                <li>SEO</li>
                <li>20MB Storage</li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="block w-full px-5 py-2.5 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white border border-white/20 relative flex flex-col justify-between">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e45053] text-white text-xs px-3 py-1 rounded-full">
              Best Value
            </span>
            <h3 className="text-2xl font-semibold mb-4">Pro</h3>
            <p className="text-3xl font-bold mb-6">
              {isAnnual ? (
                <>
                  <span className="line-through text-gray-400 mr-2">$108</span>
                  $90
                </>
              ) : (
                "$9"
              )}
              <span className="text-sm">{isAnnual ? "/year" : "/month"}</span>
              {isAnnual && (
                <span className="block text-sm text-gray-400 mt-1">
                  (~$7.50/month)
                </span>
              )}
            </p>
            <ul className="text-left text-gray-300 space-y-3 mb-8">
              <li>Unlimited Visitors</li>
              <li>Animated Page</li>
              <li>QR Code Access</li>
              <li>All Themes</li>
              <li>Custom Domain</li>
              <li>SEO</li>
              <li>1GB Storage</li>
              <li>Hide Portofy.me Branding</li>
              <li>Priority Support</li>
              <li>Built-in Analytics</li>
              <li>PDF Downloadable</li>
            </ul>
            <Link
              href="/signup"
              className="block w-full px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Go Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
