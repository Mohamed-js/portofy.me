"use client";

import { useState } from "react";
import { GoGrabber } from "react-icons/go";
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

export default function SkillsExperienceForm({ user, setUser }) {
  const [skills, setSkills] = useState(user.skills || []);
  const [experience, setExperience] = useState(user.experience || []);
  const [uploading, setUploading] = useState(false);

  const [activeId, setActiveId] = useState(null);

  // Handle skill changes
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

  // Function to handle skill image upload
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

  // Handle experience changes
  const handleExpChange = (idx, field, value) => {
    const updated = [...experience];
    updated[idx][field] = value;
    setExperience(updated);
    setUser((prev) => ({ ...prev, experience: updated }));
  };

  const addExperience = () => {
    const newExp = {
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      description: [],
    };

    const updated = [...experience, newExp];
    setExperience(updated);
    setUser((prevUser) => ({ ...prevUser, experience: updated }));
  };

  const removeExperience = (idx) => {
    const updated = experience.filter((_, i) => i !== idx);
    setExperience(updated);
    setUser((prev) => ({ ...prev, experience: updated }));
  };

  // Handle Description Bullet Points
  const addBulletPoint = (expIdx) => {
    const updated = [...experience];
    updated[expIdx].description.push("");
    setExperience(updated);
    setUser((prev) => ({ ...prev, experience: updated }));
  };

  const updateBulletPoint = (expIdx, bulletIdx, value) => {
    const updated = [...experience];
    updated[expIdx].description[bulletIdx] = value;
    setExperience(updated);
    setUser((prev) => ({ ...prev, experience: updated }));
  };

  const removeBulletPoint = (expIdx, bulletIdx) => {
    const updated = [...experience];
    updated[expIdx].description.splice(bulletIdx, 1);
    setExperience(updated);
    setUser((prev) => ({ ...prev, experience: updated }));
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
      {/* SKILLS */}
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            + Add Skill
          </button>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div>
        <h3 className="text-lg font-bold mb-4">
          Experience{" "}
          <span className="text-sm text-gray-400 font-normal">
            (automatically listed in reverse chronological order)
          </span>
        </h3>
        <div className="space-y-4">
          {experience.map((exp, idx) => (
            <div key={idx} className="border p-4 rounded space-y-2">
              <div>
                <label className="block font-medium">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleExpChange(idx, "company", e.target.value)
                  }
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium">Role</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>

              {/* Bullet Points for Description */}
              <div>
                <label className="block font-medium">
                  Achievements/Responsibilities
                </label>
                <div className="space-y-2">
                  {exp.description.map((desc, bulletIdx) => (
                    <div
                      key={bulletIdx}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) =>
                          updateBulletPoint(idx, bulletIdx, e.target.value)
                        }
                        className="border border-gray-300 rounded w-full px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeBulletPoint(idx, bulletIdx)}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addBulletPoint(idx)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeExperience(idx)}
                className="text-red-600 hover:underline cursor-pointer"
              >
                Remove Experience
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            + Add Experience
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
      <div className="border p-4 rounded">
        <div>
          <label className="block font-medium mb-1">Skill Name</label>
          <input
            type="text"
            value={skill.name}
            onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Skill Image</label>
          {skill.image && (
            <img
              src={skill.image}
              alt="Skill"
              className="w-16 h-16 object-cover mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSkillImageUpload(e, idx)}
            className="block w-full border px-3 py-2 cursor-pointer"
          />
          {uploading && (
            <p className="text-sm text-blue-500 mt-1">Uploading...</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => removeSkill(idx)}
          className="text-red-600 hover:underline mt-2 cursor-pointer"
        >
          Remove Skill
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
      {/* Render the rest of skill’s UI if you’d like */}
    </div>
  );
}
