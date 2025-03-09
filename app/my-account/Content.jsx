// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import PersonalInfoForm from "./PersonalInfoForm";
// import SocialLinksForm from "./SocialLinksForm";
// import ProjectsForm from "./ProjectsForm";
// import ExperienceForm from "./ExperienceForm";
// import SkillsForm from "./SkillsForm";
// import SeoForm from "./SeoForm";
// import SiteSettingsForm from "./SiteSettingsForm";

// export default function Content({ initialUser }) {
//   const [user, setUser] = useState(JSON.parse(initialUser));
//   const [saving, setSaving] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState(
//     searchParams.get("tab") || "personal"
//   );

//   useEffect(() => {
//     const newUrl = `?tab=${activeTab}`;
//     router.replace(newUrl);
//   }, [activeTab, router]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   useEffect(() => {
//     const saveChanges = async () => {
//       try {
//         setSaving(true);
//         const res = await fetch("/api/portfolio", {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ data: user }),
//         });

//         if (!res.ok) throw new Error("Failed to save changes");

//         const { data } = await res.json();
//         setSaving(false);
//       } catch (error) {
//         console.error("Autosave failed:", error);
//         setSaving(false);
//       }
//     };
//     const delay = setTimeout(() => {
//       saveChanges();
//     }, 2000);

//     return () => clearTimeout(delay);
//   }, [user]);

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "personal":
//         return <PersonalInfoForm user={user} setUser={setUser} />;
//       case "social":
//         return <SocialLinksForm user={user} setUser={setUser} />;
//       case "projects":
//         return <ProjectsForm user={user} setUser={setUser} />;
//       case "experience":
//         return <ExperienceForm user={user} setUser={setUser} />;
//       case "skills":
//         return <SkillsForm user={user} setUser={setUser} />;
//       case "seo":
//         return <SeoForm user={user} setUser={setUser} />;
//       case "settings":
//         return <SiteSettingsForm user={user} setUser={setUser} />;
//       default:
//         return <PersonalInfoForm user={user} setUser={setUser} />;
//     }
//   };

//   return (
//     <div>
//       <div>
//         <div>
//           <nav className="flex items-center gap-4 p-2 px-4 md:px-8 fixed top-16 left-[calc(50%)] -translate-x-[50%] min-w-[200px] w-max max-w-[90vw] overflow-x-auto z-50 bg-linear-to-bl from-neutral-800 via-neutral-900 to-neutral-950 rounded-full">
//             {[
//               { key: "personal", label: "Personal Info" },
//               { key: "social", label: "Social Links" },
//               { key: "projects", label: "Projects" },
//               { key: "experience", label: "Experience" },
//               { key: "skills", label: "Skills" },
//               { key: "seo", label: "SEO" },
//               { key: "settings", label: "Site Setting & Plan" },
//             ].map(({ key, label }) => (
//               <button
//                 key={key}
//                 className={`cursor-pointer min-w-fit ${
//                   activeTab === key
//                     ? "p-1 px-3 bg-linear-to-bl from-[#e45053] to-[#fd9c46] rounded-full"
//                     : "text-white"
//                 }`}
//                 onClick={() => handleTabChange(key)}
//               >
//                 {label}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="py-4 pb-8 w-full max-w-4xl mx-auto">
//           {renderTabContent()}
//           <div
//             className={`mt-4 fixed bottom-4 right-4 text-white py-2 px-4 rounded-md font-semibold ${
//               saving ? "bg-green-700" : "bg-[#5e0ca1]"
//             }`}
//           >
//             {saving ? "Saving..." : "All changes saved ✔"}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  // Sync tab with URL
  useEffect(() => {
    const newUrl = `?tab=${activeTab}`;
    router.replace(newUrl, { scroll: false });
  }, [activeTab, router]);

  // Original autosave with 2-second delay
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
          }
          throw new Error(errorData.message || "Failed to save changes");
        }

        const { data } = await res.json();
        // Optionally update local user state with server response if needed
        // setUser(data);
        // toast.success("Changes saved successfully");
      } catch (error) {
        console.error("Autosave failed:", error.message);
        toast.error(error.message); // Display specific error message
      } finally {
        setSaving(false); // Reset saving state in all cases
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

  const renderTabContent = () => {
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
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => handleTabChange(key)}
          >
            {label}
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
