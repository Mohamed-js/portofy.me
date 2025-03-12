"use client";

import { useState } from "react";
import { CiCamera, CiTrash } from "react-icons/ci";
import {
  GoChevronDown,
  GoChevronUp,
  GoGrabber,
  GoUpload,
} from "react-icons/go";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Label from "@/components/Label";
import { toast } from "react-toastify";

export default function ProjectsForm({ portfolio, setPortfolio, saving }) {
  const [projects, setProjects] = useState(portfolio.projects || []);
  const [uploading, setUploading] = useState({}); // Track per-project uploads
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
    setPortfolio((prev) => ({ ...prev, projects: updated }));
  };

  const addProject = () => {
    const newProj = {
      title: "New Project...",
      description: "",
      img: "",
      gallery: [],
      links: [],
    };
    const updated = [...projects, newProj];
    setProjects(updated);
    setPortfolio((prev) => ({ ...prev, projects: updated }));
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setPortfolio((prev) => ({ ...prev, projects: updated }));
  };

  const handleImageUpload = async (e, projectIndex, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading((prev) => ({ ...prev, [`${projectIndex}-${field}`]: true }));
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
        setPortfolio((prev) => ({
          ...prev,
          storageUsed: data.storageUsed,
        }));
        toast.success("Project image uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setUploading((prev) => ({
        ...prev,
        [`${projectIndex}-${field}`]: false,
      }));
    }
  };

  const handleGalleryUpload = async (e, projectIndex) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading((prev) => ({ ...prev, [`${projectIndex}-gallery`]: true }));
    const updatedGallery = [...projects[projectIndex].gallery];

    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`Skipping ${file.name}: Please upload image files only`);
        continue;
      }

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
          setPortfolio((prev) => ({
            ...prev,
            storageUsed: data.storageUsed,
          }));
          toast.success(`Gallery image ${file.name} uploaded successfully`);
        } else {
          toast.error(data.error || `Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error("Gallery upload error:", error);
        toast.error(`Error uploading ${file.name}`);
      }
    }

    handleProjectChange(projectIndex, "gallery", updatedGallery);
    setUploading((prev) => ({ ...prev, [`${projectIndex}-gallery`]: false }));
  };

  const removeGalleryImage = (projectIndex, imgIndex) => {
    const updatedGallery = projects[projectIndex].gallery.filter(
      (_, i) => i !== imgIndex
    );
    handleProjectChange(projectIndex, "gallery", updatedGallery);
  };

  const addLink = (projectIndex) => {
    const updated = [...projects];
    updated[projectIndex].links.push({ type: "", url: "" });
    setProjects(updated);
    setPortfolio((prev) => ({ ...prev, projects: updated }));
  };

  const removeLink = (projectIndex, linkIndex) => {
    const updated = [...projects];
    updated[projectIndex].links = updated[projectIndex].links.filter(
      (_, i) => i !== linkIndex
    );
    setProjects(updated);
    setPortfolio((prev) => ({ ...prev, projects: updated }));
  };

  const handleLinkChange = (projectIndex, linkIndex, field, value) => {
    const updated = [...projects];
    updated[projectIndex].links[linkIndex][field] = value;
    setProjects(updated);
    setPortfolio((prev) => ({ ...prev, projects: updated }));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex((_, i) => i === active.id);
      const newIndex = projects.findIndex((_, i) => i === over.id);
      const updated = arrayMove(projects, oldIndex, newIndex);
      setProjects(updated);
      setPortfolio((prev) => ({ ...prev, projects: updated }));
    }
    setActiveId(null);
  };

  return (
    <div className="relative space-y-4">
      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold text-white">
        Projects
      </h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((_, i) => i)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project, index) => (
            <Project
              key={index}
              id={index}
              project={project}
              index={index}
              handleProjectChange={handleProjectChange}
              handleImageUpload={handleImageUpload}
              handleGalleryUpload={handleGalleryUpload}
              removeGalleryImage={removeGalleryImage}
              removeProject={removeProject}
              addLink={addLink}
              removeLink={removeLink}
              handleLinkChange={handleLinkChange}
              uploading={uploading}
              saving={saving}
            />
          ))}
        </SortableContext>
        {activeId !== null && (
          <DragOverlay>
            <SortableItemOverlay project={projects[activeId]} />
          </DragOverlay>
        )}
      </DndContext>

      <button
        type="button"
        onClick={addProject}
        disabled={saving}
        className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add Project
      </button>
    </div>
  );
}

const Project = ({
  id,
  project,
  index,
  handleImageUpload,
  handleGalleryUpload,
  removeGalleryImage,
  removeProject,
  handleProjectChange,
  addLink,
  removeLink,
  handleLinkChange,
  uploading,
  saving,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="border border-[#141414] p-4 rounded-tl-md rounded-tr-md gap-4 flex relative justify-between bg-white/10">
        <div
          className="inline-flex items-center cursor-grab text-white"
          {...listeners}
          {...attributes}
          aria-label="Drag to reorder"
        >
          <GoGrabber size={24} />
        </div>
        <div className="w-full uppercase text-white">{project.title}</div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white focus:outline-none"
          aria-expanded={expanded}
          aria-controls={`project-details-${index}`}
        >
          {expanded ? <GoChevronUp /> : <GoChevronDown />}
        </button>
      </div>
      {expanded && (
        <div
          id={`project-details-${index}`}
          className="bg-[#141414] p-4 rounded-bl-md rounded-br-md gap-4 flex flex-col relative text-white"
        >
          {/* Project Image */}
          <div className="mb-2 relative">
            <Label
              htmlFor={`project-img-${index}`}
              className="block font-medium mb-1"
            >
              Project Image
            </Label>
            <div className="relative inline-block">
              {project.img ? (
                <div className="w-40 h-40">
                  <img
                    src={project.img}
                    alt={`${project.title} image`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ) : (
                <label
                  htmlFor={`project-img-${index}`}
                  className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-3xl cursor-pointer"
                >
                  {uploading[`${index}-img`] ? (
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        className="opacity-75"
                      />
                    </svg>
                  ) : (
                    <GoUpload className="text-gray-500" size={24} />
                  )}
                  <input
                    id={`project-img-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, "img")}
                    disabled={uploading[`${index}-img`] || saving}
                    className="hidden"
                  />
                </label>
              )}
              {project.img && (
                <label
                  htmlFor={`project-img-${index}`}
                  className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100"
                >
                  {uploading[`${index}-img`] ? (
                    <svg
                      className="animate-spin h-8 w-8 text-gray-700"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        className="opacity-75"
                      />
                    </svg>
                  ) : (
                    <CiCamera className="text-gray-700 p-1" size={40} />
                  )}
                  <input
                    id={`project-img-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, "img")}
                    disabled={uploading[`${index}-img`] || saving}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title, Description, Gallery, Links */}
          <div className="w-full">
            <div className="mb-2">
              <Label
                htmlFor={`project-title-${index}`}
                className="block font-medium"
              >
                Project Title
              </Label>
              <input
                id={`project-title-${index}`}
                type="text"
                value={project.title}
                onChange={(e) =>
                  handleProjectChange(index, "title", e.target.value)
                }
                disabled={saving}
                className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
              />
            </div>
            <div className="mt-2">
              <Label
                htmlFor={`project-desc-${index}`}
                className="block font-medium"
              >
                Project Description
              </Label>
              <textarea
                id={`project-desc-${index}`}
                rows={3}
                value={project.description}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                disabled={saving}
                className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
              />
            </div>

            {/* Gallery */}
            <div className="mt-2">
              <Label className="block font-medium">Gallery Images</Label>
              <div className="flex flex-wrap gap-4 mt-4">
                {project.gallery.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative w-20 h-20">
                    <img
                      src={img}
                      alt={`${project.title} gallery image ${imgIndex + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-600/40 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs cursor-pointer disabled:opacity-50"
                      onClick={() => removeGalleryImage(index, imgIndex)}
                      disabled={saving}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label
                  htmlFor={`gallery-upload-${index}`}
                  className="block text-center text-xs bg-[#414141] text-white px-3 flex items-center justify-center md:py-1 rounded hover:bg-black cursor-pointer w-20 h-20 disabled:opacity-50"
                >
                  {uploading[`${index}-gallery`] ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        className="opacity-75"
                      />
                    </svg>
                  ) : (
                    <>
                      + <br />
                      Add <br />
                      Image
                    </>
                  )}
                  <input
                    id={`gallery-upload-${index}`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleGalleryUpload(e, index)}
                    disabled={uploading[`${index}-gallery`] || saving}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Links */}
            <div className="mt-4">
              <Label className="block font-medium">Project Links</Label>
              <div className="space-y-2 mt-2">
                {project.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex gap-2 items-center">
                    <div className="w-1/3">
                      <Label
                        htmlFor={`link-type-${index}-${linkIndex}`}
                        className="sr-only"
                      >
                        Type
                      </Label>
                      <select
                        id={`link-type-${index}-${linkIndex}`}
                        value={link.type}
                        onChange={(e) =>
                          handleLinkChange(
                            index,
                            linkIndex,
                            "type",
                            e.target.value
                          )
                        }
                        disabled={saving}
                        className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
                      >
                        <option value="">Select Type</option>
                        {[
                          "github",
                          "gitlab",
                          "bitbucket",
                          "live",
                          "figma",
                          "adobexd",
                          "sketch",
                          "youtube",
                          "vimeo",
                          "dribbble",
                          "behance",
                          "instagram",
                          "codepen",
                          "codesandbox",
                          "replit",
                          "playstore",
                          "appstore",
                          "download",
                          "website",
                        ].map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-grow">
                      <Label
                        htmlFor={`link-url-${index}-${linkIndex}`}
                        className="sr-only"
                      >
                        URL
                      </Label>
                      <input
                        id={`link-url-${index}-${linkIndex}`}
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(
                            index,
                            linkIndex,
                            "url",
                            e.target.value
                          )
                        }
                        disabled={saving}
                        className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
                        placeholder="https://example.com"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index, linkIndex)}
                      disabled={saving}
                      className="text-red-600 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <CiTrash size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLink(index)}
                  disabled={saving}
                  className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Link
                </button>
              </div>
            </div>
          </div>

          {/* Remove Project */}
          <button
            type="button"
            onClick={() => removeProject(index)}
            disabled={saving}
            className="p-2 rounded-md hover:underline cursor-pointer absolute top-2 right-3 disabled:opacity-50"
          >
            <CiTrash className="text-red-600" size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

function SortableItemOverlay({ project }) {
  return (
    <div className="p-4 border rounded shadow z-20 bg-white/10 text-white">
      <div>
        <label className="block font-medium mb-1">{project.title}</label>
        <input
          type="text"
          value={project.title}
          disabled
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80"
        />
      </div>
    </div>
  );
}
