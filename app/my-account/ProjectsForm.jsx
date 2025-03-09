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

export default function ProjectsForm({ user, setUser }) {
  const [projects, setProjects] = useState(user.projects || []);
  const [uploading, setUploading] = useState(false);
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
    setUser((prev) => ({ ...prev, projects: updated }));
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
    setUser((prev) => ({ ...prev, projects: updated }));
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setUser((prev) => ({ ...prev, projects: updated }));
  };

  const handleImageUpload = async (e, projectIndex, field) => {
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
        handleProjectChange(projectIndex, field, data.url);
        toast.success("Project image uploaded successfully");
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

  const handleGalleryUpload = async (e, projectIndex) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
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
    setUploading(false);
  };

  const removeGalleryImage = (projectIndex, imgIndex) => {
    const updatedGallery = projects[projectIndex].gallery.filter(
      (_, i) => i !== imgIndex
    );
    handleProjectChange(projectIndex, "gallery", updatedGallery);
  };

  // New link management functions
  const addLink = (projectIndex) => {
    const updated = [...projects];
    updated[projectIndex].links.push({ type: "", url: "" });
    setProjects(updated);
    setUser((prev) => ({ ...prev, projects: updated }));
  };

  const removeLink = (projectIndex, linkIndex) => {
    const updated = [...projects];
    updated[projectIndex].links = updated[projectIndex].links.filter(
      (_, i) => i !== linkIndex
    );
    setProjects(updated);
    setUser((prev) => ({ ...prev, projects: updated }));
  };

  const handleLinkChange = (projectIndex, linkIndex, field, value) => {
    const updated = [...projects];
    updated[projectIndex].links[linkIndex][field] = value;
    setProjects(updated);
    setUser((prev) => ({ ...prev, projects: updated }));
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
      setUser((prev) => ({ ...prev, projects: updated }));
    }
    setActiveId(null);
  };

  return (
    <div className="relative space-y-4">
      {/* Full-screen loader during upload */}
      {uploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center text-white">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin" />
            <p className="mt-4 text-lg">Uploading...</p>
          </div>
        </div>
      )}

      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold">
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
        className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
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
      <div className="border border-[#141414] p-4 rounded-tl-md rounded-tr-md gap-4 flex relative justify-between">
        <div
          className="inline-flex items-center cursor-grab"
          {...listeners}
          {...attributes}
        >
          <GoGrabber size={24} />
        </div>
        <div className="w-full uppercase">{project.title}</div>
        <p className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? <GoChevronUp /> : <GoChevronDown />}
        </p>
      </div>
      {expanded && (
        <div className="bg-[#141414] p-4 rounded-bl-md rounded-br-md gap-4 flex flex-col relative">
          {/* Project Image */}
          <div className="mb-2 relative">
            <Label className="block font-medium mb-1">Project Image</Label>
            <div className="relative inline-block">
              {project.img ? (
                <div className="w-40 h-40">
                  <img
                    src={project.img}
                    alt="Project image"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ) : (
                <label className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-3xl cursor-pointer">
                  <GoUpload className="text-gray-500" size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, "img")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
              {project.img && (
                <label className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                  <CiCamera className="text-gray-700 p-1" size={40} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, "img")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title, Description, Gallery, Links */}
          <div className="w-full">
            <div className="mb-2">
              <Label className="block font-medium">Project Title</Label>
              <input
                type="text"
                value={project.title}
                onChange={(e) =>
                  handleProjectChange(index, "title", e.target.value)
                }
                className="border border-gray-300 rounded w-full px-3 py-2"
              />
            </div>
            <div className="mt-2">
              <Label className="block font-medium">Project Description</Label>
              <textarea
                rows={3}
                value={project.description}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                className="border border-gray-300 rounded w-full px-3 py-2"
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
                      alt={`Gallery image ${imgIndex + 1}`}
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
                <label className="block text-center text-xs bg-[#414141] text-white px-3 flex items-center justify-center md:py-1 rounded hover:bg-black cursor-pointer w-20 h-20">
                  + <br />
                  Add <br />
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleGalleryUpload(e, index)}
                    disabled={uploading}
                    className="block w-full border px-3 py-2 cursor-pointer hidden"
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
                      <Label className="sr-only">Type</Label>
                      <select
                        value={link.type}
                        onChange={(e) =>
                          handleLinkChange(
                            index,
                            linkIndex,
                            "type",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded w-full px-3 py-2"
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
                      <Label className="sr-only">URL</Label>
                      <input
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
                        className="border border-gray-300 rounded w-full px-3 py-2"
                        placeholder="https://example.com"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index, linkIndex)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      <CiTrash size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLink(index)}
                  className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer mt-2"
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
            className="p-2 rounded-md hover:underline cursor-pointer absolute top-2 right-3"
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
    <div className="p-4 border rounded shadow z-20">
      <div>
        <label className="block font-medium mb-1">{project.title}</label>
        <input
          type="text"
          value={project.title}
          disabled
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
    </div>
  );
}
