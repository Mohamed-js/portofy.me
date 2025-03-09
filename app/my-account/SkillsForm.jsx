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

export default function SkillsForm({ user, setUser }) {
  const [skills, setSkills] = useState(user.skills || []);
  const [uploading, setUploading] = useState(false);
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
    setUser((prev) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    const newSkill = { name: "", image: "" };
    const updated = [...skills, newSkill];
    setSkills(updated);
    setUser((prev) => ({ ...prev, skills: updated }));
  };

  const removeSkill = (idx) => {
    const updated = skills.filter((_, i) => i !== idx);
    setSkills(updated);
    setUser((prev) => ({ ...prev, skills: updated }));
  };

  const handleSkillImageUpload = async (e, idx) => {
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
        handleSkillChange(idx, "image", data.url);
        toast.success("Skill image uploaded successfully");
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
      const oldIndex = skills.findIndex((_, i) => i === active.id);
      const newIndex = skills.findIndex((_, i) => i === over.id);
      const updated = arrayMove(skills, oldIndex, newIndex);
      setSkills(updated);
      setUser((prev) => ({ ...prev, skills: updated }));
    }
    setActiveId(null);
  };

  return (
    <div className="relative space-y-8">
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
        Skills
      </h3>
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
          className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
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
        className="inline-flex items-center cursor-grab"
        {...listeners}
        {...attributes}
      >
        <GoGrabber size={24} />
      </div>
      <div className="border border-gray-200 p-4 rounded flex w-full gap-4">
        {/* Skill Image */}
        <div className="relative flex-shrink-0">
          <Label>Image</Label>
          {skill.image ? (
            <div className="w-10 h-10">
              <img
                src={skill.image}
                alt={`${skill.name} icon`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ) : (
            <label className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md cursor-pointer">
              <GoUpload className="text-gray-500" size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSkillImageUpload(e, idx)}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
          {skill.image && (
            <label className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
              <CiCamera className="text-gray-700 p-1" size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSkillImageUpload(e, idx)}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Skill Name */}
        <div className="w-full">
          <Label htmlFor={`skill-${idx}`}>Skill Name</Label>
          <input
            id={`skill-${idx}`}
            type="text"
            value={skill.name}
            onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>

        {/* Remove Skill */}
        <button
          type="button"
          onClick={() => removeSkill(idx)}
          className="border-l pl-4 hover:underline cursor-pointer flex items-center"
        >
          <CiTrash className="text-red-600" size={20} />
        </button>
      </div>
    </div>
  );
}

function SortableItemOverlay({ skill }) {
  return (
    <div className="p-4 border rounded bg-white shadow">
      <div>
        <label className="block font-medium mb-1">Skill Name</label>
        <input
          type="text"
          value={skill.name}
          disabled
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
    </div>
  );
}
