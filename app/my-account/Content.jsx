"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PersonalInfoForm from "./PersonalInfoForm";
import SocialLinksForm from "./SocialLinksForm";
import ProjectsForm from "./ProjectsForm";
import ExperienceForm from "./ExperienceForm";
import SkillsForm from "./SkillsForm";
import SeoForm from "./SeoForm";
import SiteSettingsForm from "./SiteSettingsForm";

export default function Content({ initialUser }) {
  const [user, setUser] = useState(JSON.parse(initialUser));
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "personal"
  );
  const effectivePlan = user.effectivePlan || "free";

  // Sync tab with URL
  useEffect(() => {
    const newUrl = `?tab=${activeTab}`;
    router.replace(newUrl, { scroll: false });
  }, [activeTab, router]);

  // Autosave with 2-second delay
  useEffect(() => {
    const saveChanges = async () => {
      try {
        setSaving(true);
        const res = await fetch("/api/portfolio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: user }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 409) {
            throw new Error(errorData.message || "Username already taken");
          } else if (res.status === 403) {
            throw new Error(
              errorData.message || "Upgrade to Pro to save these changes"
            );
          }
          throw new Error(errorData.message || "Failed to save changes");
        }

        const { data } = await res.json();
        // Optionally sync local state with server response
        // setUser(data);
        // toast.success("Changes saved successfully");
      } catch (error) {
        console.error("Autosave failed:", error.message);
        toast.error(error.message);
      } finally {
        setSaving(false);
      }
    };

    const delay = setTimeout(() => {
      saveChanges();
    }, 2000);

    return () => clearTimeout(delay);
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const isProOnlyTab = (tab) =>
    ["projects", "experience", "skills", "seo"].includes(tab);

  const renderTabContent = () => {
    if (effectivePlan === "free" && isProOnlyTab(activeTab)) {
      return (
        <div className="p-6 text-center text-gray-300">
          <p className="text-lg">
            This feature is available with an active Pro subscription.
          </p>
          <button
            onClick={() => setActiveTab("settings")}
            className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            Upgrade to Pro
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoForm user={user} setUser={setUser} saving={saving} />
        );
      case "social":
        return (
          <SocialLinksForm user={user} setUser={setUser} saving={saving} />
        );
      case "projects":
        return <ProjectsForm user={user} setUser={setUser} saving={saving} />;
      case "experience":
        return <ExperienceForm user={user} setUser={setUser} saving={saving} />;
      case "skills":
        return <SkillsForm user={user} setUser={setUser} saving={saving} />;
      case "seo":
        return <SeoForm user={user} setUser={setUser} saving={saving} />;
      case "settings":
        return (
          <SiteSettingsForm user={user} setUser={setUser} saving={saving} />
        );
      default:
        return (
          <PersonalInfoForm user={user} setUser={setUser} saving={saving} />
        );
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-16">
      <nav
        role="tablist"
        className="flex items-center gap-4 p-2 px-4 md:px-8 fixed top-20 left-1/2 -translate-x-1/2 min-w-[200px] w-max max-w-[90vw] overflow-x-auto z-50 bg-gradient-to-bl from-neutral-800 via-neutral-900 to-neutral-950 rounded-full shadow-lg"
      >
        {[
          { key: "personal", label: "Personal Info" },
          { key: "social", label: "Social Links" },
          { key: "projects", label: "Projects" },
          { key: "experience", label: "Experience" },
          { key: "skills", label: "Skills" },
          { key: "seo", label: "SEO" },
          { key: "settings", label: "Site Settings & Plan" },
        ].map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            className={`cursor-pointer min-w-fit px-3 py-1 rounded-full transition-colors ${
              activeTab === key
                ? "bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white"
                : effectivePlan === "free" && isProOnlyTab(key)
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => handleTabChange(key)}
            disabled={effectivePlan === "free" && isProOnlyTab(key)}
          >
            {label}
            {effectivePlan === "free" && isProOnlyTab(key) && (
              <span className="ml-1 text-xs text-[#e45053]">(Pro)</span>
            )}
          </button>
        ))}
      </nav>
      <div className="py-4 w-full max-w-4xl mx-auto">
        {renderTabContent()}
        <div
          className={`mt-4 fixed bottom-4 right-4 text-white py-2 px-4 rounded-md font-semibold shadow-md transition-all ${
            saving ? "bg-green-600" : "bg-[#5e0ca1]"
          }`}
        >
          {saving ? "Saving..." : "All changes saved ✔"}
        </div>
      </div>
    </div>
  );
}
