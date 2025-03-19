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
import Analytics from "./Analytics";

export default function Content({ initialPortfolio }) {
  const [portfolio, setPortfolio] = useState(JSON.parse(initialPortfolio));
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "personal"
  );
  const effectivePlan = portfolio.effectivePlan;
  const portfolioType = portfolio.type;

  useEffect(() => {
    const newUrl = `?tab=${activeTab}`;
    router.replace(newUrl, { scroll: false });
  }, [activeTab, router]);

  useEffect(() => {
    const saveChanges = async () => {
      try {
        setSaving(true);
        const res = await fetch(`/api/portfolio/${portfolio.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: portfolio }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 409) {
            throw new Error(
              errorData.message || errorData.error || "Slug already taken"
            );
          } else if (res.status === 403) {
            throw new Error(
              errorData.message ||
                errorData.error ||
                "Upgrade to Pro to save these changes"
            );
          }
          throw new Error(errorData.message || "Failed to save changes");
        }
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
  }, [portfolio]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Define restricted tabs based on plan and type
  const isRestrictedTab = (tab) => {
    const socialLinksRestrictedTabs = ["skills", "experience", "projects"];
    if (effectivePlan === "free") {
      if (tab === "seo") return true; // SEO is restricted on free plan for both types
      if (tab === "analytics") return true; // Analytics is restricted on free plan for both types
      if (
        portfolioType === "social-links" &&
        socialLinksRestrictedTabs.includes(tab)
      )
        return true;
    } else if (effectivePlan === "pro") {
      if (
        portfolioType === "social-links" &&
        socialLinksRestrictedTabs.includes(tab)
      )
        return true;
    }
    return false;
  };

  const renderTabContent = () => {
    if (isRestrictedTab(activeTab)) {
      return (
        <div className="p-6 text-center text-gray-300">
          <p className="text-lg">
            {effectivePlan === "free" && activeTab === "seo"
              ? "SEO settings are available with an active Pro subscription."
              : "This feature is not available for Social Links apps."}
          </p>
          <button
            onClick={() =>
              effectivePlan === "free" && activeTab === "seo"
                ? router.push("/my-account/subscription")
                : setActiveTab("social")
            }
            className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            {effectivePlan === "free" && activeTab === "seo"
              ? "Upgrade to Pro"
              : "Back to Social Links"}
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
        );
      case "social":
        return (
          <SocialLinksForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
        );
      case "projects":
        return (
          <ProjectsForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
        );
      case "skills":
        return (
          <SkillsForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
        );
      case "seo":
        return (
          <SeoForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
        );
      case "settings":
        return (
          <SiteSettingsForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
        );
      case "analytics":
        return <Analytics portfolioId={portfolio._id} />;
      default:
        return (
          <PersonalInfoForm
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saving={saving}
          />
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
          { key: "skills", label: "Skills/Services" },
          { key: "seo", label: "SEO" },
          { key: "analytics", label: "Analytics" },
          { key: "settings", label: "Site Settings" },
        ].map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            className={`cursor-pointer min-w-fit px-3 py-1 rounded-full transition-colors ${
              activeTab === key
                ? "bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white"
                : isRestrictedTab(key)
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => handleTabChange(key)}
            disabled={isRestrictedTab(key)}
          >
            {label}
            {isRestrictedTab(key) && (
              <span className="ml-1 text-xs text-[#e45053]">
                {effectivePlan === "free" &&
                (key === "seo" || key === "analytics")
                  ? "(Pro)"
                  : "(N/A)"}
              </span>
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
