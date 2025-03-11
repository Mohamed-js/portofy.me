// app/my-account/CreateAppForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateAppForm() {
  // Removed effectivePlan prop
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("portfolio");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, type }), // Removed effectivePlan
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create app");
      }

      const { portfolio } = await res.json();
      toast.success("App created successfully!");
      router.push(`/my-account/${portfolio.slug}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl text-gray-300 mb-4">Create New App</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="App Title"
          className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-700"
          required
        />
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug (e.g., my-portfolio)"
          className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-700"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-700"
        >
          <option value="portfolio">Portfolio</option>
          <option value="link-in-bio">Link-in-Bio</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create App"}
        </button>
      </form>
    </div>
  );
}
