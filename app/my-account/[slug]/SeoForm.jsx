"use client";

import { useState } from "react";
import Label from "@/components/Label";

export default function SeoForm({ user, setUser }) {
  const [keywordInput, setKeywordInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("seoMeta.")) {
      const key = name.split(".")[1];
      setUser((prev) => ({
        ...prev,
        seoMeta: { ...prev.seoMeta, [key]: value },
      }));
    }
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    setUser((prev) => ({
      ...prev,
      seoMeta: {
        ...prev.seoMeta,
        keywords: [...(prev.seoMeta?.keywords || []), keywordInput.trim()],
      },
    }));
    setKeywordInput("");
  };

  const removeKeyword = (index) => {
    setUser((prev) => ({
      ...prev,
      seoMeta: {
        ...prev.seoMeta,
        keywords: prev.seoMeta.keywords.filter((_, i) => i !== index),
      },
    }));
  };

  // Character Limits (SEO Best Practices)
  const titleLimit = 60;
  const descriptionLimit = 160;

  // Truncate function for preview
  const truncateText = (text, limit) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  return (
    <div className="space-y-6">
      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold">
        SEO Meta
      </h3>

      {/* SEO Live Preview */}
      <div className="p-4 border border-gray-200 rounded bg-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Google Search Preview
        </h4>
        <p className="text-blue-600 text-lg font-medium">
          {truncateText(
            user.seoMeta?.title || user.username || "Your Portfolio",
            titleLimit
          )}
        </p>
        <p className="text-green-700 text-sm">
          portofy.me/@
          {user.username?.toLowerCase().replace(/\s+/g, "-") || "your-username"}
        </p>
        <p className="text-gray-700 max-w-[450px]">
          {truncateText(
            user.seoMeta?.description || "A showcase of my work and skills.",
            descriptionLimit
          )}
        </p>
      </div>

      {/* SEO Title */}
      <div>
        <Label htmlFor="seo-title">SEO Title</Label>
        <input
          id="seo-title"
          name="seoMeta.title"
          type="text"
          value={user.seoMeta?.title || ""}
          onChange={handleChange}
          maxLength={titleLimit}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
        <p className="text-right text-sm text-gray-500 mt-1">
          {user.seoMeta?.title?.length || 0}/{titleLimit} characters
        </p>
      </div>

      {/* SEO Description */}
      <div>
        <Label htmlFor="seo-description">SEO Description</Label>
        <textarea
          id="seo-description"
          rows={2}
          name="seoMeta.description"
          value={user.seoMeta?.description || ""}
          onChange={handleChange}
          maxLength={descriptionLimit}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
        <p className="text-right text-sm text-gray-500 mt-1">
          {user.seoMeta?.description?.length || 0}/{descriptionLimit} characters
        </p>
      </div>

      {/* Keywords Management */}
      <div>
        <Label>SEO Keywords</Label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addKeyword()}
            className="border border-gray-300 rounded w-full px-3 py-2"
            placeholder="Enter keyword..."
          />
          <button
            type="button"
            onClick={addKeyword}
            className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer min-w-fit"
          >
            + Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.seoMeta?.keywords?.map((keyword, index) => (
            <span
              key={index}
              className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-3 py-1 rounded-full flex items-center gap-2"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="text-white hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
