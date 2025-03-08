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

export default function ProjectsForm({ user, setUser }) {
  const [projects, setProjects] = useState(user.projects || []);
  const [uploading, setUploading] = useState(false);
  const [activeId, setActiveId] = useState(null);

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

  function handleDragStart(event) {
    const { active } = event;

    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(
        (project) => project._id === active.id
      );
      const newIndex = projects.findIndex((project) => project._id === over.id);
      const updated = arrayMove(projects, oldIndex, newIndex);
      setProjects(updated);
      setUser((prev) => ({ ...prev, projects: updated }));

      return;
    }

    setActiveId(null);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold">
        Projects
      </h3>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        <SortableContext
          items={projects}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project, index) => (
            <Project
              key={`${project._id}` + index}
              project={project}
              index={index}
              handleProjectChange={handleProjectChange}
              handleImageUpload={handleImageUpload}
              handleGalleryUpload={handleGalleryUpload}
              removeGalleryImage={removeGalleryImage}
              removeProject={removeProject}
            />
          ))}
        </SortableContext>
        {activeId && (
          <DragOverlay>
            <SortableItemOverlay
              project={projects.find((s) => s._id === activeId)}
            />
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
  project,
  index,
  handleImageUpload,
  handleGalleryUpload,
  removeGalleryImage,
  removeProject,
  handleProjectChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div className="border p-4 rounded gap-4 flex relative justify-between">
        <div
          className="inline-flex items-center cursor-grab"
          {...listeners}
          {...attributes}
        >
          <GoGrabber size={24} />
        </div>
        <div className="w-full uppercase">{project.title}</div>
        <p
          className="cursor-pointer"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? <GoChevronUp /> : <GoChevronDown />}
        </p>
      </div>
      {expanded && (
        <div
          key={index}
          className="bg-[#141414] p-4 rounded gap-4 flex relative"
        >
          <div className="mb-2 relative">
            <p className="block font-medium mb-1">Project Image</p>
            <div className="relative inline-block">
              {project.img && (
                <div className="w-40 h-40">
                  <img
                    src={project.img}
                    alt="Icon"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              )}

              {project.img ? (
                <label className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                  <CiCamera className="text-gray-700 p-1" size={40} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, "img")}
                    className="hidden"
                  />
                </label>
              ) : (
                <label className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-3xl cursor-pointer">
                  <GoUpload className="text-gray-500" size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, "img")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          {/* Title & Description */}
          <div className="w-full md:max-w-[600px]">
            <div className="mb-2">
              <label className="block font-medium">Project Title</label>
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
              <label className="block font-medium">Project Description</label>
              <textarea
                rows={3}
                value={project.description}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                className="border border-gray-300 rounded w-full px-3 py-2"
              />
            </div>
            {/* Gallery Upload */}
            <div>
              <p className="block font-medium">Gallery Images</p>
              <label className="block w-fit bg-black text-white px-3 py-1 mt-1 rounded hover:bg-blue-700 cursor-pointer">
                + Add Image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleGalleryUpload(e, index)}
                  className="block w-full border px-3 py-2 cursor-pointer hidden"
                />
              </label>

              {/* Gallery Image Previews */}
              {project.gallery.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
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
          </div>

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
        <label className="block font-medium mb-1">{project.site}</label>
        <input
          type="text"
          value={project.site}
          disabled // so user can't type into the floating item
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
    </div>
  );
}
