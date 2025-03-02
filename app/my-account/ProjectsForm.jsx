"use client";

import { useState } from "react";

export default function ProjectsForm({ user, setUser }) {
  const [projects, setProjects] = useState(user.projects || []);
  const [uploading, setUploading] = useState(false);

  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
    setUser((prev) => ({ ...prev, projects: updated }));
  };

  const addProject = () => {
    const newProj = {
      title: "",
      description: "",
      img: "",
      gallery: [],
      links: [],
    };

    const updated = [...projects, newProj];
    setProjects(updated);
    setUser((prevUser) => ({ ...prevUser, projects: updated }));
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setUser((prev) => ({ ...prev, projects: updated }));
  };

  // Function to upload the main project image to Cloudinary
  const handleImageUpload = async (e, projectIndex, field) => {
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
        handleProjectChange(projectIndex, field, data.url);
      } else {
        console.error("Upload failed:", data.error || data.message);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Function to upload multiple gallery images
  const handleGalleryUpload = async (e, projectIndex) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const updatedGallery = [...projects[projectIndex].gallery];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          updatedGallery.push(data.url);
        } else {
          console.error("Upload failed:", data.error || data.message);
        }
      } catch (error) {
        console.error("Image upload error:", error);
      }
    }

    // Update the state with the new gallery images
    handleProjectChange(projectIndex, "gallery", updatedGallery);
    setUploading(false);
  };

  // Function to remove a gallery image
  const removeGalleryImage = (projectIndex, imgIndex) => {
    const updatedGallery = projects[projectIndex].gallery.filter(
      (_, i) => i !== imgIndex
    );
    handleProjectChange(projectIndex, "gallery", updatedGallery);
  };

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div key={index} className="border p-4 rounded space-y-2">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) =>
                handleProjectChange(index, "title", e.target.value)
              }
              className="border border-gray-300 rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              rows={3}
              value={project.description}
              onChange={(e) =>
                handleProjectChange(index, "description", e.target.value)
              }
              className="border border-gray-300 rounded w-full px-3 py-2"
            />
          </div>

          {/* Main Project Image Upload */}
          <div>
            <label className="block font-medium">Main Project Image</label>
            {project.img && (
              <img
                src={project.img}
                alt="Project"
                className="w-32 h-32 object-cover mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index, "img")}
              className="block w-full border px-3 py-2 cursor-pointer"
            />
            {uploading && (
              <p className="text-sm text-blue-500 mt-1">Uploading...</p>
            )}
          </div>

          {/* Gallery Upload */}
          <div>
            <label className="block font-medium">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleGalleryUpload(e, index)}
              className="block w-full border px-3 py-2 cursor-pointer"
            />
            {uploading && (
              <p className="text-sm text-blue-500 mt-1">Uploading...</p>
            )}

            {/* Gallery Image Previews */}
            {project.gallery.length > 0 && (
              <div className="flex gap-4 mt-4">
                {project.gallery.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative w-20 h-20">
                    <img
                      src={img}
                      alt="Gallery"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-600/40 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs cursor-pointer"
                      onClick={() => removeGalleryImage(index, imgIndex)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeProject(index)}
            className="text-red-600 hover:underline cursor-pointer"
          >
            Remove Project
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addProject}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        + Add Project
      </button>
    </div>
  );
}
