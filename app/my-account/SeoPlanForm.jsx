"use client";

import { useState } from "react";

export default function SeoPlanForm({ user, setUser }) {
  const [keywordInput, setKeywordInput] = useState(""); // Temp input state

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("seoMeta.")) {
      // e.g. "seoMeta.title"
      const key = name.split(".")[1]; // "title"
      setUser((prev) => ({
        ...prev,
        seoMeta: { ...prev.seoMeta, [key]: value },
      }));
    }
  };

  // Handle adding a new keyword
  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    setUser((prev) => ({
      ...prev,
      seoMeta: {
        ...prev.seoMeta,
        keywords: [...(prev.seoMeta?.keywords || []), keywordInput.trim()],
      },
    }));
    setKeywordInput(""); // Reset input field
  };

  // Handle removing a keyword
  const removeKeyword = (index) => {
    setUser((prev) => ({
      ...prev,
      seoMeta: {
        ...prev.seoMeta,
        keywords: prev.seoMeta.keywords.filter((_, i) => i !== index),
      },
    }));
  };

  // Character Limits (Best SEO Practices)
  const titleLimit = 60;
  const descriptionLimit = 160;

  // Truncate function to simulate Google search results display
  const truncateText = (text, limit) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  return (
    <form className="space-y-6">
      <h3 className="text-lg font-bold">SEO Meta</h3>

      {/* SEO Live Preview */}
      <div className="mt-6 p-4 border rounded bg-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Google Search Preview
        </h4>
        <p className="text-blue-600 text-lg font-medium">
          {truncateText(user.seoMeta?.title || user.username, titleLimit)}
        </p>
        <p className="text-green-700 text-sm">
          portofy.me/@
          {user.username.toLowerCase().replace(/\s+/g, "-") || "example-title"}
        </p>
        <p className="text-gray-700 max-w-[450px]">
          {truncateText(
            user.seoMeta?.description || "Example description",
            descriptionLimit
          )}
        </p>
      </div>

      {/* SEO Title */}
      <div>
        <label className="block font-medium mb-1">SEO Title</label>
        <input
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
        <label className="block font-medium mb-1">SEO Description</label>
        <textarea
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
        <label className="block font-medium mb-1">SEO Keywords</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-grow"
            placeholder="Enter keyword..."
          />
          <button
            type="button"
            onClick={addKeyword}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            + Add
          </button>
        </div>
        {/* Display keyword tags */}
        <div className="flex flex-wrap gap-2">
          {user.seoMeta?.keywords?.map((keyword, index) => (
            <span
              key={index}
              className="bg-gray-200 px-3 py-1 rounded flex items-center space-x-2"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="text-red-600 ml-2 hover:text-red-800 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
    </form>
  );
}
