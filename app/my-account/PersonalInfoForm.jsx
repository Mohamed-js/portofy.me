"use client";

import { useState } from "react";
import { CiCamera } from "react-icons/ci";

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
      <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            No Cover Photo
          </div>
        )}
        <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 z-10">
          <CiCamera className="w-5 h-5 text-gray-700" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "cover")}
            className="hidden"
          />
        </label>
      </div>

      {/* Avatar Upload */}
      <div className="relative w-full flex justify-center -mt-12">
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
          <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
            <CiCamera className="w-5 h-5 text-gray-700" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "avatar")}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploading && (
        <p className="text-sm text-blue-500 mt-2 text-center">Uploading...</p>
      )}

      <div className="flex gap-4">
        <div className="w-full">
          <label className="block font-medium mb-1">First Name</label>
          <input
            name="firstName"
            type="text"
            value={user.firstName || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">Last Name</label>
          <input
            name="lastName"
            type="text"
            value={user.lastName || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <label className="block font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={user.email || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">
            Username (used in your portfolio link)
          </label>
          <input
            name="username"
            type="text"
            value={user.username || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>
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
