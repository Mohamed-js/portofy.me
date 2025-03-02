"use client";

import { useState } from "react";

export default function PersonalInfoForm({ user, setUser }) {
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const [coverPreview, setCoverPreview] = useState(user.cover || "");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle image upload
  const handleImageUpload = async (e, field) => {
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
        setUser((prev) => ({ ...prev, [field]: data.url }));

        // Update preview
        if (field === "avatar") setAvatarPreview(data.url);
        if (field === "cover") setCoverPreview(data.url);
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
    <form className="space-y-4">
      {/* Cover Upload */}
      <div>
        <label className="block font-medium mb-1">Cover Image</label>
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover"
            className="w-full aspect-5/2 object-cover mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "cover")}
          className="block w-full border px-3 py-2 cursor-pointer"
        />
        {uploading && (
          <p className="text-sm text-blue-500 mt-1">Uploading...</p>
        )}
      </div>

      {/* Avatar Upload */}
      <div>
        <label className="block font-medium mb-1">Avatar</label>
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "avatar")}
          className="block w-full border px-3 py-2 cursor-pointer"
        />
        {uploading && (
          <p className="text-sm text-blue-500 mt-1">Uploading...</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">First Name</label>
        <input
          name="firstName"
          type="text"
          value={user.firstName || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Last Name</label>
        <input
          name="lastName"
          type="text"
          value={user.lastName || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={user.email || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Username</label>
        <input
          name="username"
          type="text"
          value={user.username || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Employment</label>
        <input
          name="employment"
          type="text"
          value={user.employment || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Location</label>
        <input
          name="location"
          type="text"
          value={user.location || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          rows={3}
          value={user.bio || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
    </form>
  );
}
