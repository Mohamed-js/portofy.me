"use client";

import Label from "@/components/Label";
import { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { toast } from "react-toastify";

export default function PersonalInfoForm({ user, setUser }) {
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const [coverPreview, setCoverPreview] = useState(user.cover || "");
  const [uploading, setUploading] = useState(false);

  const liveLink =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://www.portofy.me";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

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
        setUser((prev) => ({
          ...prev,
          [field]: data.url,
          storageUsed: data.storageUsed,
        }));
        if (field === "avatar") setAvatarPreview(data.url);
        if (field === "cover") setCoverPreview(data.url);
        toast.success(
          `${field === "avatar" ? "Avatar" : "Cover"} uploaded successfully`
        );
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Full-screen loader during upload */}
      {uploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center text-white">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin" />
            <p className="mt-4 text-lg">Uploading...</p>
          </div>
        </div>
      )}

      <form className="space-y-6">
        {/* Cover Upload */}
        <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              No Cover Photo
            </div>
          )}
          <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 disabled:opacity-50">
            <CiCamera className="w-5 h-5 text-gray-700" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "cover")}
              disabled={uploading}
              className="hidden"
              aria-label="Upload cover photo"
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
                className="w-24 h-24 rounded-full border-4 border-[#242424] shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-[#242424] shadow-md flex items-center justify-center text-gray-500">
                No Avatar
              </div>
            )}
            <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 disabled:opacity-50">
              <CiCamera className="w-5 h-5 text-gray-700" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "avatar")}
                disabled={uploading}
                className="hidden"
                aria-label="Upload avatar"
              />
            </label>
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={user.firstName || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={user.lastName || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email || ""}
              readOnly
              className="border border-gray-300 rounded w-full px-3 py-2 cursor-not-allowed"
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <input
              id="username"
              name="username"
              type="text"
              value={user.username || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <Label>Portfolio Link</Label>
          <a
            href={`${liveLink}/@${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            {`portofy.me/@${user.username || ""}`}
          </a>
        </div>

        <div>
          <Label htmlFor="employment">Employment</Label>
          <input
            id="employment"
            name="employment"
            type="text"
            value={user.employment || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <input
            id="location"
            name="location"
            type="text"
            value={user.location || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={user.bio || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>
      </form>
    </div>
  );
}
