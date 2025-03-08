"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PersonalInfoForm from "./PersonalInfoForm";
import SocialLinksForm from "./SocialLinksForm";
import ProjectsForm from "./ProjectsForm";
import ExperienceForm from "./ExperienceForm";
import SkillsForm from "./SkillsForm";
import SeoForm from "./SeoForm";
import SiteSettingsForm from "./SiteSettingsForm";
// import { toast } from "react-toastify";

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

  // const handleSaveAll = async () => {
  //   try {
  //     const res = await fetch("/api/portfolio", {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ data: user }),
  //     });
  //     if (!res.ok) throw new Error("Update failed");
  //     const { data } = await res.json();
  //     setUser(data);
  //     toast.success("All changes saved!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error saving changes. Check console for details.");
  //   }
  // };

  // const autosave = useCallback(() => {
  //   const saveChanges = async () => {
  //     try {
  //       setSaving(true);
  //       const res = await fetch("/api/portfolio", {
  //         method: "PATCH",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ data: user }),
  //       });

  //       if (!res.ok) throw new Error("Failed to save changes");

  //       const { data } = await res.json();
  //       setSaving(false);
  //     } catch (error) {
  //       console.error("Autosave failed:", error);
  //       setSaving(false);
  //     }
  //   };

  //   const delay = setTimeout(() => {
  //     saveChanges();
  //   }, 3000);

  //   return () => clearTimeout(delay);
  // }, [user]);

  useEffect(() => {
    // autosave();
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
    }, 2000);

    return () => clearTimeout(delay);
  }, [user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoForm user={user} setUser={setUser} />;
      case "social":
        return <SocialLinksForm user={user} setUser={setUser} />;
      case "projects":
        return <ProjectsForm user={user} setUser={setUser} />;
      case "experience":
        return <ExperienceForm user={user} setUser={setUser} />;
      case "skills":
        return <SkillsForm user={user} setUser={setUser} />;
      case "seo":
        return <SeoForm user={user} setUser={setUser} />;
      case "settings":
        return <SiteSettingsForm user={user} setUser={setUser} />;
      default:
        return <PersonalInfoForm user={user} setUser={setUser} />;
    }
  };

  return (
    <div>
      <div>
        <div>
          <nav className="flex items-center gap-4 p-2 px-4 md:px-8 fixed top-16 left-[calc(50%)] -translate-x-[50%] min-w-[200px] w-max max-w-[90vw] overflow-x-auto z-50 bg-linear-to-bl from-neutral-800 via-neutral-900 to-neutral-950 rounded-full">
            {[
              { key: "personal", label: "Personal Info" },
              { key: "social", label: "Social Links" },
              { key: "projects", label: "Projects" },
              { key: "experience", label: "Experience" },
              { key: "skills", label: "Skills" },
              { key: "seo", label: "SEO" },
              { key: "settings", label: "Site Setting & Plan" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`cursor-pointer min-w-fit ${
                  activeTab === key
                    ? "p-1 px-3 bg-linear-to-bl from-[#e45053] to-[#fd9c46] rounded-full"
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
        <div className="py-4 pb-8 w-full max-w-4xl mx-auto">
          {renderTabContent()}
          {/* <div className="">
            <button
              className="bg-[#5e0ca1] text-white px-4 py-2 mt-4 rounded hover:bg-blue-700 cursor-pointer"
              onClick={handleSaveAll}
            >
              Save All Changes
            </button>
          </div> */}
          <div
            className={`mt-4 fixed bottom-4 right-4 text-white py-2 px-4 rounded-md font-semibold ${
              saving ? "bg-green-700" : "bg-[#5e0ca1]"
            }`}
          >
            {saving ? "Saving..." : "All changes saved ✔"}
          </div>
        </div>
      </div>
    </div>
  );
}
