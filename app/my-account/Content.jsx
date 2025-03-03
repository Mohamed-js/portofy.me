"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PersonalInfoForm from "./PersonalInfoForm";
import SocialLinksForm from "./SocialLinksForm";
import ProjectsForm from "./ProjectsForm";
import SkillsExperienceForm from "./SkillsExperienceForm";
import SeoPlanForm from "./SeoPlanForm";
import SiteSettingsForm from "./SiteSettingsForm";
import { toast } from "react-toastify";

export default function Content({ initialUser }) {
  const [user, setUser] = useState(JSON.parse(initialUser));
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "personal"
  );

  useEffect(() => {
    const newUrl = `?tab=${activeTab}`;
    router.replace(newUrl);
  }, [activeTab, router]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSaveAll = async () => {
    try {
      console.log(user);
      const res = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: user }),
      });
      if (!res.ok) throw new Error("Update failed");
      const { data } = await res.json();
      setUser(data);
      toast.success("All changes saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving changes. Check console for details.");
    }
  };

  const autosave = useCallback(() => {
    const saveChanges = async () => {
      try {
        setSaving(true);
        const res = await fetch("/api/portfolio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: user }),
        });

        if (!res.ok) throw new Error("Failed to save changes");

        const { data } = await res.json();
        setSaving(false);
      } catch (error) {
        console.error("Autosave failed:", error);
        setSaving(false);
      }
    };

    const delay = setTimeout(() => {
      saveChanges();
    }, 1500);

    return () => clearTimeout(delay);
  }, [user]);

  useEffect(() => {
    autosave();
  }, [user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoForm user={user} setUser={setUser} />;
      case "social":
        return <SocialLinksForm user={user} setUser={setUser} />;
      case "projects":
        return <ProjectsForm user={user} setUser={setUser} />;
      case "skills-exp":
        return <SkillsExperienceForm user={user} setUser={setUser} />;
      case "seo":
        return <SeoPlanForm user={user} setUser={setUser} />;
      case "settings":
        return <SiteSettingsForm user={user} setUser={setUser} />;
      default:
        return <PersonalInfoForm user={user} setUser={setUser} />;
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="min-h-screen bg-indigo-900">
          <nav className="flex flex-col items-start gap-4 p-4 sticky top-5 min-w-[200px]">
            {[
              { key: "personal", label: "Personal Info" },
              { key: "social", label: "Social Links" },
              { key: "projects", label: "Projects" },
              { key: "skills-exp", label: "Skills & Experience" },
              { key: "seo", label: "SEO" },
              { key: "settings", label: "Site Setting & Plan" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`pb-2 cursor-pointer ${
                  activeTab === key
                    ? "border-b-2 border-blue-500 font-bold text-white"
                    : "text-white"
                }`}
                onClick={() => handleTabChange(key)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Render the form for the active tab */}
        <div className="p-4 w-full">
          {renderTabContent()}
          <div className="">
            <button
              className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700 cursor-pointer"
              onClick={handleSaveAll}
            >
              Save All Changes
            </button>
          </div>
          <div
            className={`mt-4 fixed bottom-4 right-4 text-white py-2 px-4 rounded-md font-semibold ${
              saving ? "bg-indigo-600" : "bg-green-500"
            }`}
          >
            {saving ? "Saving..." : "All changes saved ✔"}
          </div>
        </div>
      </div>
    </div>
  );
}
