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

export default function SkillsForm({ user, setUser }) {
  const [skills, setSkills] = useState(user.skills || []);
  const [uploading, setUploading] = useState(false);
  const [activeId, setActiveId] = useState(null);

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
    setUser((prevUser) => ({ ...prevUser, skills: updated }));
  };

  const removeSkill = (idx) => {
    const updated = skills.filter((_, i) => i !== idx);
    setSkills(updated);
    setUser((prev) => ({ ...prev, skills: updated }));
  };

  const handleSkillImageUpload = async (e, idx) => {
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
        handleSkillChange(idx, "image", data.url);
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
      const oldIndex = skills.findIndex((skill) => skill._id === active.id);
      const newIndex = skills.findIndex((skill) => skill._id === over.id);
      const updated = arrayMove(skills, oldIndex, newIndex);

      setSkills(updated);
      setUser((prev) => ({ ...prev, skills: updated }));

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
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-4">Skills</h3>
        <div className="space-y-4">
          <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            collisionDetection={closestCenter}
            sensors={sensors}
          >
            <SortableContext
              items={skills}
              strategy={verticalListSortingStrategy}
            >
              {skills.map((skill, idx) => (
                <SortableItem
                  key={idx}
                  id={skill._id}
                  skill={skill}
                  uploading={uploading}
                  idx={idx}
                  removeSkill={removeSkill}
                  handleSkillImageUpload={handleSkillImageUpload}
                  handleSkillChange={handleSkillChange}
                />
              ))}
            </SortableContext>
            {activeId && (
              <DragOverlay>
                <SortableItemOverlay
                  skill={skills.find((s) => s._id === activeId)}
                />
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
      <div className="border p-4 rounded flex w-full gap-4">
        <div className="w-full">
          <label className="block font-medium mb-1">Skill Name</label>
          <input
            type="text"
            value={skill.name}
            onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>
        <div className="relative inline-block w-[100px]">
          <label className="block font-medium mb-1">Skill Image</label>
          {skill.image && (
            <div className="w-12 h-12">
              <img
                src={skill.image}
                alt="Icon"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}

          {skill.image ? (
            <label className="absolute -bottom-1 right-2 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
              <CiCamera className="text-gray-700 p-1" size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSkillImageUpload(e, idx)}
                className="hidden"
              />
            </label>
          ) : (
            <label className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-3xl cursor-pointer">
              <GoUpload className="text-gray-500" size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSkillImageUpload(e, idx)}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="button"
          onClick={() => removeSkill(idx)}
          className=" border-l pl-4 hover:underline mt-2 cursor-pointer"
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
          disabled // so user can't type into the floating item
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
    </div>
  );
}
