"use client";

import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import Label from "@/components/Label";

export default function ExperienceForm({ portfolio, setPortfolio, saving }) {
  const [experience, setExperience] = useState(portfolio.experience || []);

  const handleExpChange = (idx, field, value) => {
    const updated = [...experience];
    updated[idx][field] = value;

    // If isPresent is toggled on, clear and disable endDate
    if (field === "isPresent" && value) {
      updated[idx].endDate = "";
    }

    setExperience(updated);
    setPortfolio((prev) => ({ ...prev, experience: updated }));
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
    setPortfolio((prev) => ({ ...prev, experience: updated }));
  };

  const removeExperience = (idx) => {
    const updated = experience.filter((_, i) => i !== idx);
    setExperience(updated);
    setPortfolio((prev) => ({ ...prev, experience: updated }));
  };

  const addBulletPoint = (expIdx) => {
    const updated = [...experience];
    updated[expIdx].description.push("");
    setExperience(updated);
    setPortfolio((prev) => ({ ...prev, experience: updated }));
  };

  const updateBulletPoint = (expIdx, bulletIdx, value) => {
    const updated = [...experience];
    updated[expIdx].description[bulletIdx] = value;
    setExperience(updated);
    setPortfolio((prev) => ({ ...prev, experience: updated }));
  };

  const removeBulletPoint = (expIdx, bulletIdx) => {
    const updated = [...experience];
    updated[expIdx].description.splice(bulletIdx, 1);
    setExperience(updated);
    setPortfolio((prev) => ({ ...prev, experience: updated }));
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
    <div>
      <h3 className="text-xl md:text-5xl text-center font-semibold mb-2 text-white">
        Experience
      </h3>
      <p className="text-sm md:text-base text-gray-400 font-normal text-center mb-4 md:mb-8">
        (automatically listed in reverse chronological order)
      </p>

      <div className="flex gap-2 items-center mb-2">
        <Label htmlFor="experienceActivatedInPortfolio" className="text-white">
          Activate In Portfolio
        </Label>
        <input
          id="experienceActivatedInPortfolio"
          name="experienceActivatedInPortfolio"
          type="checkbox"
          checked={portfolio.experienceActivatedInPortfolio || ""}
          onChange={handleActivationChange}
          disabled={saving}
          className="border border-gray-300 -mt-1 w-5 h-5 rounded px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
          required
        />
      </div>

      <div className="mb-2">
        <Label htmlFor="experienceTitle" className="text-white">
          Section Title
        </Label>
        <input
          id="experienceTitle"
          name="experienceTitle"
          type="text"
          value={portfolio.experienceTitle || ""}
          onChange={handleTitleChange}
          disabled={saving}
          className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
          required
        />
      </div>

      <div className="space-y-6">
        {experience.map((exp, idx) => (
          <div
            key={idx}
            className="border border-white/20 p-4 rounded bg-white/10 space-y-4 relative"
          >
            {/* Company, Role */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`company-${idx}`} className="text-white">
                  Company
                </Label>
                <input
                  id={`company-${idx}`}
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleExpChange(idx, "company", e.target.value)
                  }
                  disabled={saving}
                  className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <Label htmlFor={`role-${idx}`} className="text-white">
                  Role
                </Label>
                <input
                  id={`role-${idx}`}
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                  disabled={saving}
                  className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor={`location-${idx}`} className="text-white">
                Location
              </Label>
              <input
                id={`location-${idx}`}
                type="text"
                value={exp.location}
                onChange={(e) =>
                  handleExpChange(idx, "location", e.target.value)
                }
                disabled={saving}
                className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
              />
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`startDate-${idx}`} className="text-white">
                  Start Date
                </Label>
                <input
                  id={`startDate-${idx}`}
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    handleExpChange(idx, "startDate", e.target.value)
                  }
                  disabled={saving}
                  className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${idx}`} className="text-white">
                  End Date
                </Label>
                <input
                  id={`endDate-${idx}`}
                  type="date"
                  value={exp.endDate}
                  onChange={(e) =>
                    handleExpChange(idx, "endDate", e.target.value)
                  }
                  disabled={exp.isPresent || saving}
                  className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
                />
                {exp.isPresent && (
                  <span className="text-gray-300 ml-2">Present</span>
                )}
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
                disabled={saving}
                className="w-4 h-4 text-[#e45053] border-gray-300 rounded focus:ring-[#e45053] disabled:opacity-50"
              />
              <Label
                htmlFor={`isPresent-${idx}`}
                className="font-medium text-white"
              >
                Current Position (Present)
              </Label>
            </div>

            {/* Bullet Points */}
            <div>
              <Label className="block font-medium mb-2 text-white">
                Achievements/Responsibilities
              </Label>
              <div className="space-y-2">
                {exp.description.map((desc, bulletIdx) => (
                  <div key={bulletIdx} className="flex items-center gap-2">
                    <input
                      id={`bullet-${idx}-${bulletIdx}`}
                      type="text"
                      value={desc}
                      onChange={(e) =>
                        updateBulletPoint(idx, bulletIdx, e.target.value)
                      }
                      disabled={saving}
                      className="border border-gray-300 rounded w-full px-3 py-2 text-gray-900 bg-gray-50/80 focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => removeBulletPoint(idx, bulletIdx)}
                      disabled={saving}
                      className="text-red-600 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <CiTrash size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBulletPoint(idx)}
                  disabled={saving}
                  className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>

            {/* Remove Experience */}
            <button
              type="button"
              onClick={() => removeExperience(idx)}
              disabled={saving}
              className="text-red-600 hover:underline cursor-pointer absolute top-2 right-2 disabled:opacity-50"
            >
              <CiTrash size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          disabled={saving}
          className="bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Experience
        </button>
      </div>
    </div>
  );
}
