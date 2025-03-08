"use client";

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

import { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { GoGrabber, GoUpload } from "react-icons/go";

export default function SocialLinksForm({ user, setUser }) {
  const [links, setLinks] = useState(user.socialLinks || []);
  const [uploading, setUploading] = useState(false);
  const [activeId, setActiveId] = useState(null);

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

  function handleDragStart(event) {
    const { active } = event;

    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link._id === active.id);
      const newIndex = links.findIndex((link) => link._id === over.id);
      const updated = arrayMove(links, oldIndex, newIndex);
      console.log(active.id);
      console.log(over.id);
      console.log(oldIndex);
      console.log(newIndex);
      setLinks(updated);
      setUser((prev) => ({ ...prev, links: updated }));

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
      <h3 className="text-lg font-semibold">Social Links</h3>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        <SortableContext items={links} strategy={verticalListSortingStrategy}>
          {links.map((link, index) => (
            <SortableItem
              key={index}
              id={link._id}
              index={index}
              link={link}
              handleIconUpload={handleIconUpload}
              removeLink={removeLink}
              handleLinkChange={handleLinkChange}
              uploading={uploading}
            />
          ))}
        </SortableContext>
        {activeId && (
          <DragOverlay>
            <SortableItemOverlay link={links.find((s) => s._id === activeId)} />
          </DragOverlay>
        )}
      </DndContext>

      <button
        type="button"
        onClick={addLink}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        + Add Social Link
      </button>
    </div>
  );
}

function SortableItem({
  id,
  link,
  uploading,
  handleLinkChange,
  removeLink,
  handleIconUpload,
  index,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex">
      <div
        className="inline-flex items-center cursor-grab"
        {...listeners}
        {...attributes}
      >
        <GoGrabber size={24} />
      </div>
      <div className="border border-gray-200 p-4 py-2 rounded flex gap-2 md:gap-4 w-full">
        {/* Site Selection */}
        <div className="mb-2">
          <p className="block text-sm mb-1">Site</p>
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
        <div className="mb-2 flex-grow">
          <p className="block text-sm mb-1">URL</p>
          <input
            type="text"
            value={link.url}
            onChange={(e) => handleLinkChange(index, "url", e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>

        {/* Icon Upload & Preview */}
        <div className="mb-2 relative">
          <p className="block text-sm mb-1">Icon</p>
          <div className="relative inline-block">
            {link.icon && (
              <img
                src={link.icon}
                alt="Icon"
                className="w-10 h-10 object-cover rounded-full border border-gray-300"
              />
            )}

            {link.icon ? (
              <label className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                <CiCamera className="w-3 h-3 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIconUpload(e, index)}
                  className="hidden"
                />
              </label>
            ) : (
              <label className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIconUpload(e, index)}
                  className="hidden"
                />
                <GoUpload className="text-gray-500 cursor-pointer" size={24} />
              </label>
            )}
          </div>
          {uploading && (
            <p className="text-sm text-blue-500 mt-1">Uploading...</p>
          )}
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeLink(index)}
          className="bg-red-600 text-white p-2 rounded-md hover:underline cursor-pointer h-fit self-center"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
function SortableItemOverlay({ link }) {
  return (
    <div className="p-4 border rounded bg-white shadow">
      <div>
        <label className="block font-medium mb-1">{link.site}</label>
        <input
          type="text"
          value={link.site}
          disabled // so user can't type into the floating item
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
      {/* Render the rest of skill’s UI if you’d like */}
    </div>
  );
}
