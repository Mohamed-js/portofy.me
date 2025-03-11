"use client";

import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import Label from "@/components/Label";

export default function ExperienceForm({ user, setUser }) {
  const [experience, setExperience] = useState(user.experience || []);

  const handleExpChange = (idx, field, value) => {
    const updated = [...experience];
    updated[idx][field] = value;

    // If isPresent is toggled on, clear and disable endDate
    if (field === "isPresent" && value) {
      updated[idx].endDate = "";
    }

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
      isPresent: false,
      description: [],
    };
    const updated = [...experience, newExp];
    setExperience(updated);
    setUser((prev) => ({ ...prev, experience: updated }));
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
    <div>
      <h3 className="text-xl md:text-5xl text-center font-semibold mb-2">
        Experience
      </h3>
      <p className="text-sm md:text-base text-gray-400 font-normal text-center mb-4 md:mb-8">
        (automatically listed in reverse chronological order)
      </p>

      <div className="space-y-6">
        {experience.map((exp, idx) => (
          <div
            key={idx}
            className="border border-gray-200 p-4 rounded space-y-4 relative"
          >
            {/* Company, Role */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`company-${idx}`}>Company</Label>
                <input
                  id={`company-${idx}`}
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleExpChange(idx, "company", e.target.value)
                  }
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>
              <div>
                <Label htmlFor={`role-${idx}`}>Role</Label>
                <input
                  id={`role-${idx}`}
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor={`location-${idx}`}>Location</Label>
              <input
                id={`location-${idx}`}
                type="text"
                value={exp.location}
                onChange={(e) =>
                  handleExpChange(idx, "location", e.target.value)
                }
                className="border border-gray-300 rounded w-full px-3 py-2"
              />
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`startDate-${idx}`}>Start Date</Label>
                <input
                  id={`startDate-${idx}`}
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    handleExpChange(idx, "startDate", e.target.value)
                  }
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${idx}`}>End Date</Label>
                <input
                  id={`endDate-${idx}`}
                  type="date"
                  value={exp.endDate}
                  onChange={(e) =>
                    handleExpChange(idx, "endDate", e.target.value)
                  }
                  disabled={exp.isPresent}
                  className={`border border-gray-300 rounded w-full px-3 py-2 ${
                    exp.isPresent ? "hidden cursor-not-allowed" : ""
                  }`}
                />
                {exp.isPresent && "Present"}
              </div>
            </div>

            {/* Is Present */}
            <div className="flex items-center gap-2">
              <input
                id={`isPresent-${idx}`}
                type="checkbox"
                checked={exp.isPresent}
                onChange={(e) =>
                  handleExpChange(idx, "isPresent", e.target.checked)
                }
                className="w-4 h-4"
              />
              <Label htmlFor={`isPresent-${idx}`} className="font-medium">
                Current Position (Present)
              </Label>
            </div>

            {/* Bullet Points */}
            <div>
              <Label className="block font-medium mb-2">
                Achievements/Responsibilities
              </Label>
              <div className="space-y-2">
                {exp.description.map((desc, bulletIdx) => (
                  <div key={bulletIdx} className="flex items-center gap-2">
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
                      <CiTrash size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBulletPoint(idx)}
                  className="bg-linear-to-bl from-[#e45053] to-[#fd9c46] text-white px-3 py-1 rounded cursor-pointer"
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>

            {/* Remove Experience */}
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
  );
}
