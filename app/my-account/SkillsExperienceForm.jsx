"use client";

import { useState } from "react";

export default function SkillsExperienceForm({ user, setUser }) {
  const [skills, setSkills] = useState(user.skills || []);
  const [experience, setExperience] = useState(user.experience || []);
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="space-y-8">
      {/* SKILLS */}
      <div>
        <h3 className="text-lg font-bold mb-4">Skills</h3>
        <div className="space-y-4">
          {skills.map((skill, idx) => (
            <div key={idx} className="border p-4 rounded">
              <div>
                <label className="block font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    handleSkillChange(idx, "name", e.target.value)
                  }
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
          ))}
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
        <h3 className="text-lg font-bold mb-4">Experience</h3>
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
