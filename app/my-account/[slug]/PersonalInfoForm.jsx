"use client";

import Label from "@/components/Label";
import { useEffect, useState } from "react";
import { CiCamera } from "react-icons/ci";
import { toast } from "react-toastify";

export default function PersonalInfoForm({ portfolio, setPortfolio, saving }) {
  const [avatarPreview, setAvatarPreview] = useState(portfolio.avatar || "");
  const [coverPreview, setCoverPreview] = useState(portfolio.cover || "");
  const [uploading, setUploading] = useState(false);
  const [slugError, setSlugError] = useState(""); // Track slug validation error

  const [liveLink, setLiveLink] = useState("");

  // Set the liveLink once the component mounts in the browser
  useEffect(() => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ""
    }`;
    setLiveLink(baseUrl);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "slug") {
      // Clean and validate slug
      const cleanedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      setPortfolio((prev) => ({ ...prev, [name]: cleanedSlug }));

      // Validate slug format
      if (value && !/^[a-z0-9-]+$/.test(value)) {
        setSlugError(
          "Slug must be lowercase, contain only letters, numbers, or hyphens, and no spaces"
        );
      } else {
        setSlugError("");
      }
    } else {
      setPortfolio((prev) => ({ ...prev, [name]: value }));
    }
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
        setPortfolio((prev) => ({
          ...prev,
          [field]: data.url,
          storageUsed: data.storageUsed || prev.storageUsed, // Keep if User tracks this
        }));
        if (field === "avatar") setAvatarPreview(data.url);
        if (field === "cover") setCoverPreview(data.url);
        toast.success(
          `${field === "avatar" ? "Avatar" : "Cover"} uploaded successfully`
        );
      } else {
        toast.error(data.message || "Upload failed");
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
      {/* Full-screen loader during upload or saving */}
      {(uploading || saving) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center text-white">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin" />
            <p className="mt-4 text-lg">
              {uploading ? "Uploading..." : "Saving..."}
            </p>
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
          <label className="absolute bottom-6 right-6 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 disabled:opacity-50">
            <CiCamera className="w-5 h-5 text-gray-700" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "cover")}
              disabled={uploading || saving}
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
                disabled={uploading || saving}
                className="hidden"
                aria-label="Upload avatar"
              />
            </label>
          </div>
        </div>

        {/* Portfolio Details */}
        <div>
          <Label htmlFor="title" className="text-white">
            Title <small>(usually your name/business name)</small>
          </Label>
          <input
            id="title"
            name="title"
            type="text"
            value={portfolio.title || ""}
            onChange={handleChange}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            required
          />
        </div>
        <div>
          <Label htmlFor="subTitle" className="text-white">
            SubTitle <small>(usually the job title)</small>
          </Label>
          <input
            id="subTitle"
            name="subTitle"
            type="text"
            value={portfolio.subTitle || ""}
            onChange={handleChange}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            required
          />
        </div>

        <div>
          <Label htmlFor="slug" className="text-white">
            Slug <small>(used in your url)</small>
          </Label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={portfolio.slug || ""}
            onChange={handleChange}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            required
          />
          {slugError && (
            <p className="text-red-400 text-sm mt-1">{slugError}</p>
          )}
        </div>

        <div>
          <Label className="text-white">Live Link</Label>
          {liveLink && portfolio && (
            <a
              href={`${liveLink}/${portfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              {`${liveLink.replace(/^https?:\/\//, "")}/${
                portfolio.slug || ""
              }`}
            </a>
          )}
        </div>

        {portfolio.type === "portfolio" && (
          <div>
            <Label htmlFor="descriptionTitle" className="text-white">
              Description Section Title
            </Label>
            <input
              id="descriptionTitle"
              name="descriptionTitle"
              rows={3}
              value={portfolio.descriptionTitle || ""}
              onChange={handleChange}
              disabled={saving}
              className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            />
          </div>
        )}

        <div>
          <Label htmlFor="description" className="text-white">
            Description <small>("bio/about")</small>
          </Label>
          <textarea
            id="description"
            name="description" // Nested update
            rows={3}
            value={portfolio.description || ""}
            onChange={handleChange}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white">
            Contact Email <small>(will be available for your visitors)</small>
          </Label>
          <input
            id="email"
            name="email"
            type="email"
            value={portfolio.email || ""}
            onChange={handleChange}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">
            Contact Phone <small>(will be available for your visitors)</small>
          </Label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={portfolio.phone || ""}
            onChange={handleChange}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
            required
          />
        </div>
      </form>
    </div>
  );
}
