"use client";

import { useEffect, useState } from "react";
import Label from "@/components/Label";

export default function SeoForm({ portfolio, setPortfolio, saving }) {
  const [keywordInput, setKeywordInput] = useState("");
  const [liveLink, setLiveLink] = useState("");

  // Set the liveLink once the component mounts in the browser
  useEffect(() => {
    const baseUrl = `${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ""
    }`;
    setLiveLink(baseUrl);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("seoMeta.")) {
      const key = name.split(".")[1];
      setPortfolio((prev) => ({
        ...prev,
        seoMeta: { ...prev.seoMeta, [key]: value },
      }));
    }
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    setPortfolio((prev) => ({
      ...prev,
      seoMeta: {
        ...prev.seoMeta,
        keywords: [...(prev.seoMeta?.keywords || []), keywordInput.trim()],
      },
    }));
    setKeywordInput("");
  };

  const removeKeyword = (index) => {
    setPortfolio((prev) => ({
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
      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold text-white">
        SEO Meta
      </h3>

      {/* SEO Live Preview */}
      <div className="p-4 border border-white/20 rounded bg-white/10">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          Google Search Preview
        </h4>
        <p className="text-blue-500 text-lg font-medium">
          {truncateText(
            portfolio.seoMeta?.title || portfolio.username || "Your Portfolio",
            titleLimit
          )}
        </p>
        <p className="text-green-600 text-sm">
          {liveLink && portfolio && `${liveLink}/${portfolio.slug}`}
        </p>
        <p className="text-gray-300 max-w-[450px]">
          {truncateText(
            portfolio.seoMeta?.description ||
              "A showcase of my work and skills.",
            descriptionLimit
          )}
        </p>
      </div>

      {/* SEO Title */}
      <div>
        <Label htmlFor="seo-title" className="text-white">
          SEO Title
        </Label>
        <input
          id="seo-title"
          name="seoMeta.title"
          type="text"
          value={portfolio.seoMeta?.title || ""}
          onChange={handleChange}
          maxLength={titleLimit}
          disabled={saving}
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
        />
        <p className="text-right text-sm text-gray-400 mt-1">
          {portfolio.seoMeta?.title?.length || 0}/{titleLimit} characters
        </p>
      </div>

      {/* SEO Description */}
      <div>
        <Label htmlFor="seo-description" className="text-white">
          SEO Description
        </Label>
        <textarea
          id="seo-description"
          rows={2}
          name="seoMeta.description"
          value={portfolio.seoMeta?.description || ""}
          onChange={handleChange}
          maxLength={descriptionLimit}
          disabled={saving}
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
        />
        <p className="text-right text-sm text-gray-400 mt-1">
          {portfolio.seoMeta?.description?.length || 0}/{descriptionLimit}{" "}
          characters
        </p>
      </div>

      {/* Keywords Management */}
      <div>
        <Label className="text-white">SEO Keywords</Label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addKeyword()}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            placeholder="Enter keyword..."
          />
          <button
            type="button"
            onClick={addKeyword}
            disabled={saving}
            className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer min-w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {portfolio.seoMeta?.keywords?.map((keyword, index) => (
            <span
              key={index}
              className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-3 py-1 rounded-full flex items-center gap-2"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                disabled={saving}
                className="text-white hover:text-gray-200 cursor-pointer disabled:opacity-50"
                aria-label={`Remove ${keyword}`}
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
