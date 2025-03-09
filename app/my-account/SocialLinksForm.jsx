"use client";

import Label from "@/components/Label";
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
import { CiCamera, CiTrash } from "react-icons/ci";
import { GoGrabber, GoUpload } from "react-icons/go";
import { toast } from "react-toastify";

export default function SocialLinksForm({ user, setUser }) {
  const [links, setLinks] = useState(user.socialLinks || []);
  const [uploading, setUploading] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    setUser((prev) => ({ ...prev, socialLinks: updated }));
  };

  const removeLink = (index) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    setUser((prev) => ({ ...prev, socialLinks: updated }));
  };

  const handleIconUpload = async (e, index) => {
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
        handleLinkChange(index, "icon", data.url);
        toast.success("Icon uploaded successfully");
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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((_, i) => i === active.id);
      const newIndex = links.findIndex((_, i) => i === over.id);
      const updated = arrayMove(links, oldIndex, newIndex);
      setLinks(updated);
      setUser((prev) => ({ ...prev, socialLinks: updated }));
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
        Social Links
      </h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((_, i) => i)}
          strategy={verticalListSortingStrategy}
        >
          {links.map((link, index) => (
            <SortableItem
              key={index}
              id={index}
              index={index}
              link={link}
              handleIconUpload={handleIconUpload}
              removeLink={removeLink}
              handleLinkChange={handleLinkChange}
              uploading={uploading}
            />
          ))}
        </SortableContext>
        {activeId !== null && (
          <DragOverlay>
            <SortableItemOverlay link={links[activeId]} />
          </DragOverlay>
        )}
      </DndContext>

      <button
        type="button"
        onClick={addLink}
        className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
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
      <div className="border border-gray-200 p-2 md:p-4 py-2 rounded flex gap-2 md:gap-4 w-full justify-between">
        {/* Icon Upload & Preview */}
        <div className="mb-2 relative">
          <Label>Icon</Label>
          <div className="relative inline-block">
            {link.icon ? (
              <img
                src={link.icon}
                alt="Icon"
                className="w-10 h-10 object-cover rounded-full border border-gray-300"
              />
            ) : (
              <label className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIconUpload(e, index)}
                  disabled={uploading}
                  className="hidden"
                />
                <GoUpload className="text-gray-500 cursor-pointer" size={24} />
              </label>
            )}
            {link.icon && (
              <label className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                <CiCamera className="w-3 h-3 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIconUpload(e, index)}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Site and URL */}
        <div className="flex flex-col md:flex-row md:gap-2 md:w-full">
          <div className="mb-2">
            <Label>Site</Label>
            <select
              value={link.site}
              onChange={(e) => handleLinkChange(index, "site", e.target.value)}
              className="border border-gray-300 rounded w-full px-3 py-2"
            >
              <option value="">Select Site</option>
              {[
                "github",
                "gitlab",
                "bitbucket",
                "behance",
                "dribbble",
                "linkedin",
                "instagram",
                "twitter",
                "youtube",
                "vimeo",
                "tiktok",
                "twitch",
                "medium",
                "devto",
                "stackoverflow",
                "facebook",
                "pinterest",
                "soundcloud",
                "spotify",
                "patreon",
                "website",
              ].map((site) => (
                <option key={site} value={site} className="capitalize">
                  {site}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2 flex-grow">
            <Label>URL</Label>
            <input
              type="text"
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className="border border-gray-300 rounded w-full px-3 py-2"
            />
          </div>
        </div>

        {/* Remove Button */}
        <div className="border-l flex items-center justify-center pl-2 md:pl-4">
          <button
            type="button"
            onClick={() => removeLink(index)}
            className="text-white rounded-md hover:underline cursor-pointer h-fit self-center"
          >
            <CiTrash size={20} className="font-bold text-red-600" />
          </button>
        </div>
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
          disabled
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
    </div>
  );
}
