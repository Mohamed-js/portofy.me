// app/my-account/CreateAppForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateAppForm({ closeModal, effectivePlan }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("social-links");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, type }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create app");
      }

      const { portfolio } = await res.json();
      toast.success("App created successfully!");
      closeModal(); // Close modal on success
      router.push(`/my-account/${portfolio.slug}`); // Redirect to new app
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div>
          <label htmlFor="title" className="block text-white mb-1">
            App Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="App Title"
            className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-700 w-full"
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-white mb-1">
            Slug (e.g., my-portfolio)
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
            }
            placeholder="Slug (e.g., my-portfolio)"
            className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-700 w-full"
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-white mb-1">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-700 w-full"
            disabled={submitting}
          >
            <option value="social-links">Social Links</option>
            <option value="portfolio" disabled={effectivePlan === "free"}>
              Portfolio {effectivePlan === "free" && "(Pro Only)"}
            </option>
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 cursor-pointer bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating..." : "Create App"}
        </button>
      </form>
    </div>
  );
}
