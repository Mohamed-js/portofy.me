"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import CreateAppForm from "./CreateAppForm";

export default function MyAccountClient({ initialPortfolios, effectivePlan }) {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const hasToasted = useRef(false);

  useEffect(() => {
    if (hasToasted.current) return; // Prevent duplicate toasts
    hasToasted.current = true;

    const success = searchParams.get("success");
    const pending = searchParams.get("pending");
    const errorOccurred = searchParams.get("error_occured");
    const txnResponseCode = searchParams.get("txn_response_code");

    if (success) {
      if (
        success === "true" &&
        pending === "false" &&
        errorOccurred === "false" &&
        txnResponseCode === "APPROVED"
      ) {
        toast.success("Subscription successful! You’re now on Pro.");
      } else if (
        success === "false" ||
        errorOccurred === "true" ||
        txnResponseCode !== "APPROVED"
      ) {
        toast.error("Payment failed. Please try again.");
      } else if (pending === "true") {
        toast.info(
          "Payment is pending. We’ll update your plan once confirmed."
        );
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen px-4">
      <h1 className="text-3xl font-bold text-white mb-6">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="mb-8 bg-white/10 p-4 rounded-lg">
          <h2 className="text-xl text-gray-300 mb-2 capitalize">
            Plan: {effectivePlan}
          </h2>
          <Link
            href="/my-account/subscription"
            className="text-blue-500 hover:underline"
          >
            Manage Subscription
          </Link>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl text-gray-300 mb-4">Your Apps</h2>
        {initialPortfolios.length === 0 ? (
          <p className="text-gray-400">You haven’t created any apps yet.</p>
        ) : (
          <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {initialPortfolios.map((portfolio) => (
              <li
                key={portfolio._id}
                className="p-4 bg-white/10 rounded-lg shadow-md"
              >
                <Link href={`/my-account/${portfolio.slug}`}>
                  <h3 className="text-lg font-semibold text-white capitalize">
                    {portfolio.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-400 capitalize">
                    Type: {portfolio.type}
                  </p>
                  <p className="text-sm text-gray-400">
                    Slug: {portfolio.slug}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        + Create New App
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#242424] p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Create New App
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-300 hover:text-white text-2xl"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <CreateAppForm
              closeModal={() => setShowModal(false)}
              effectivePlan={effectivePlan}
            />
          </div>
        </div>
      )}
    </div>
  );
}
