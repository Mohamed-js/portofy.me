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

  return (
    <form className="space-y-4">
      <h3 className="text-lg font-bold">SEO Meta</h3>
      <div>
        <label className="block font-medium mb-1">SEO Title</label>
        <input
          name="seoMeta.title"
          type="text"
          value={user.seoMeta?.title || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">SEO Description</label>
        <textarea
          rows={2}
          name="seoMeta.description"
          value={user.seoMeta?.description || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
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
