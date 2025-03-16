"use client";

import { useState } from "react";
import { GoGrabber, GoUpload } from "react-icons/go";
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
import { CiCamera, CiTrash } from "react-icons/ci";
import Label from "@/components/Label";
import { toast } from "react-toastify";

export default function SkillsForm({ portfolio, setPortfolio, saving }) {
  const [skills, setSkills] = useState(portfolio.skills || []);
  const [uploading, setUploading] = useState({}); // Per-skill upload state
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSkillChange = (idx, field, value) => {
    const updated = [...skills];
    updated[idx][field] = value;
    setSkills(updated);
    setPortfolio((prev) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    const newSkill = { name: "", image: "" };
    const updated = [...skills, newSkill];
    setSkills(updated);
    setPortfolio((prev) => ({ ...prev, skills: updated }));
  };

  const removeSkill = (idx) => {
    const updated = skills.filter((_, i) => i !== idx);
    setSkills(updated);
    setPortfolio((prev) => ({ ...prev, skills: updated }));
  };

  const handleSkillImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading((prev) => ({ ...prev, [idx]: true }));
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        handleSkillChange(idx, "image", data.url);
        setPortfolio((prev) => ({
          ...prev,
          storageUsed: data.storageUsed,
        }));
        toast.success("Skill image uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setUploading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = skills.findIndex((_, i) => i === active.id);
      const newIndex = skills.findIndex((_, i) => i === over.id);
      const updated = arrayMove(skills, oldIndex, newIndex);
      setSkills(updated);
      setPortfolio((prev) => ({ ...prev, skills: updated }));
    }
    setActiveId(null);
  };

  const handleTitleChange = (e) => {
    const { name, value } = e.target;

    setPortfolio((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivationChange = (e) => {
    const { name, checked } = e.target;

    setPortfolio((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="relative space-y-8">
      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold text-white">
        Skills/Services
      </h3>

      <div className="flex gap-2 items-center">
        <Label htmlFor="skillsActivatedInPortfolio" className="text-white">
          Activate In Portfolio
        </Label>
        <input
          id="skillsActivatedInPortfolio"
          name="skillsActivatedInPortfolio"
          type="checkbox"
          checked={portfolio.skillsActivatedInPortfolio || ""}
          onChange={handleActivationChange}
          disabled={saving}
          className="border border-gray-300 -mt-1 w-5 h-5 rounded px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
          required
        />
      </div>

      <div>
        <Label htmlFor="skillsTitle" className="text-white">
          Section Title
        </Label>
        <input
          id="skillsTitle"
          name="skillsTitle"
          type="text"
          value={portfolio.skillsTitle || ""}
          onChange={handleTitleChange}
          disabled={saving}
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
          required
        />
      </div>
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((_, i) => i)}
            strategy={verticalListSortingStrategy}
          >
            {skills.map((skill, idx) => (
              <SortableItem
                key={idx}
                id={idx}
                skill={skill}
                uploading={uploading}
                idx={idx}
                removeSkill={removeSkill}
                handleSkillImageUpload={handleSkillImageUpload}
                handleSkillChange={handleSkillChange}
                saving={saving}
              />
            ))}
          </SortableContext>
          {activeId !== null && (
            <DragOverlay>
              <SortableItemOverlay skill={skills[activeId]} />
            </DragOverlay>
          )}
        </DndContext>
        <button
          type="button"
          onClick={addSkill}
          disabled={saving}
          className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Skill
        </button>
      </div>
    </div>
  );
}

function SortableItem({
  id,
  skill,
  uploading,
  idx,
  handleSkillImageUpload,
  removeSkill,
  handleSkillChange,
  saving,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex w-full">
      <div
        className="inline-flex items-center cursor-grab text-white"
        {...listeners}
        {...attributes}
        aria-label="Drag to reorder"
      >
        <GoGrabber size={24} />
      </div>
      <div className="border border-white/20 p-4 rounded flex w-full gap-4 bg-white/10">
        {/* Skill Image */}
        <div className="relative flex-shrink-0">
          <Label htmlFor={`skill-img-${idx}`} className="text-white">
            Image
          </Label>
          {skill.image ? (
            <div className="w-10 h-10">
              <img
                src={skill.image}
                alt={`${skill.name} icon`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ) : (
            <label
              htmlFor={`skill-img-${idx}`}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md cursor-pointer disabled:opacity-50"
            >
              {uploading[idx] ? (
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
                id={`skill-img-${idx}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleSkillImageUpload(e, idx)}
                disabled={uploading[idx] || saving}
                className="hidden"
              />
            </label>
          )}
          {skill.image && (
            <label
              htmlFor={`skill-img-${idx}`}
              className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100 disabled:opacity-50"
            >
              {uploading[idx] ? (
                <svg
                  className="animate-spin h-4 w-4 text-gray-700"
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
                <CiCamera className="text-gray-700 p-1" size={20} />
              )}
              <input
                id={`skill-img-${idx}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleSkillImageUpload(e, idx)}
                disabled={uploading[idx] || saving}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Skill Name */}
        <div className="w-full">
          <Label htmlFor={`skill-${idx}`} className="text-white">
            Skill Name
          </Label>
          <input
            id={`skill-${idx}`}
            type="text"
            value={skill.name}
            onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
            disabled={saving}
            className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
          />
        </div>

        {/* Remove Skill */}
        <button
          type="button"
          onClick={() => removeSkill(idx)}
          disabled={saving}
          className="border-l pl-4 hover:underline cursor-pointer flex items-center text-red-600 disabled:opacity-50"
        >
          <CiTrash size={20} />
        </button>
      </div>
    </div>
  );
}

function SortableItemOverlay({ skill }) {
  return (
    <div className="p-4 border rounded bg-white/10 shadow text-white">
      <div>
        <Label className="block font-medium mb-1">Skill Name</Label>
        <input
          type="text"
          value={skill.name}
          disabled
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80"
        />
      </div>
    </div>
  );
}
