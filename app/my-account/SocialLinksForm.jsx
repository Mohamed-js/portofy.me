"use client";

import { useState } from "react";

export default function SocialLinksForm({ user, setUser }) {
  const [links, setLinks] = useState(user.socialLinks || []);
  const [uploading, setUploading] = useState(false);

  const handleLinkChange = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
    setUser((prev) => ({ ...prev, socialLinks: updated }));
  };

  const addLink = () => {
    const newLink = { site: "", url: "", icon: "" };
    const updated = [...links, newLink];
    setLinks(updated);
    setUser((u) => ({ ...u, socialLinks: updated }));
  };

  const removeLink = (index) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    setUser((prev) => ({ ...prev, socialLinks: updated }));
  };

  // Function to handle image upload
  const handleIconUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        // Update user state with new image URL
        handleLinkChange(index, "icon", data.url);
      } else {
        console.error("Upload failed:", data.error || data.message);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div key={index} className="border p-4 rounded">
          {/* Site Selection */}
          <div className="mb-2">
            <label className="block font-medium">Site</label>
            <select
              value={link.site}
              onChange={(e) => handleLinkChange(index, "site", e.target.value)}
              className="border border-gray-300 rounded w-full px-3 py-2"
            >
              <option value="">Select Site</option>
              <option value="github">GitHub</option>
              <option value="behance">Behance</option>
              <option value="dribbble">Dribbble</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          {/* URL Input */}
          <div className="mb-2">
            <label className="block font-medium">URL</label>
            <input
              type="text"
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className="border border-gray-300 rounded w-full px-3 py-2"
            />
          </div>

          {/* Icon Upload & Preview */}
          <div className="mb-2">
            <label className="block font-medium">Icon</label>
            {link.icon && (
              <img
                src={link.icon}
                alt="Icon"
                className="w-10 h-10 object-contain mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleIconUpload(e, index)}
              className="block w-full border px-3 py-2 cursor-pointer"
            />
            {uploading && (
              <p className="text-sm text-blue-500 mt-1">Uploading...</p>
            )}
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeLink(index)}
            className="text-red-600 hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add New Social Link */}
      <button
        type="button"
        onClick={addLink}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        + Add Social Link
      </button>
    </div>
  );
}
