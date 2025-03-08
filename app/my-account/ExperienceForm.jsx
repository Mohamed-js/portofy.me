"use client";

import { useState } from "react";
import { CiTrash } from "react-icons/ci";

export default function SkillsExperienceForm({ user, setUser }) {
  const [experience, setExperience] = useState(user.experience || []);

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
      <div>
        <h3 className="text-lg font-bold mb-4">
          Experience{" "}
          <span className="text-sm text-gray-400 font-normal">
            (automatically listed in reverse chronological order)
          </span>
        </h3>
        <div className="space-y-4">
          {experience.map((exp, idx) => (
            <div key={idx} className="border p-4 rounded space-y-2 relative">
              <div>
                <label className="block font-medium mb-2">Company</label>
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
                <label className="block font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>

              {/* Bullet Points for Description */}
              <div>
                <label className="block font-medium mb-2">
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
                className="text-red-600 hover:underline cursor-pointer absolute top-2 right-2"
              >
                <CiTrash size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            + Add Experience
          </button>
        </div>
      </div>
    </div>
  );
}
