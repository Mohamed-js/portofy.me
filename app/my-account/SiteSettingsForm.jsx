"use client";

import Label from "@/components/Label";

export default function SiteSettingsForm({ user, setUser }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl md:text-5xl text-center mb-4 md:mb-8 font-semibold">
        Site Settings
      </h3>

      {/* Theme */}
      <div>
        <Label htmlFor="theme">Theme</Label>
        <select
          id="theme"
          name="theme"
          value={user.theme || "minimal"}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        >
          <option value="minimal">Minimal</option>
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
        </select>
      </div>

      {/* Custom Domain */}
      <div>
        <Label htmlFor="customDomain">Custom Domain</Label>
        <input
          id="customDomain"
          name="customDomain"
          type="text"
          value={user.customDomain || ""}
          onChange={handleChange}
          placeholder="e.g., yourdomain.com"
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>

      {/* Plan */}
      <div>
        <Label htmlFor="plan">Plan</Label>
        <select
          id="plan"
          name="plan"
          value={user.plan || "free"}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        >
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
      </div>
    </div>
  );
}
