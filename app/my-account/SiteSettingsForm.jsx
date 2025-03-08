"use client";

export default function SiteSettingsForm({ user, setUser }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4">
      <h3 className="text-lg font-bold">Site Settings</h3>
      <div>
        <label className="block font-medium mb-1">Theme</label>
        <select
          name="theme"
          value={user.theme || "minimal"}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        >
          <option value="minimal" className="bg-black">
            Minimal
          </option>
          <option value="modern" className="bg-black">
            Modern
          </option>
          <option value="classic" className="bg-black">
            Classic
          </option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Custom Domain</label>
        <input
          name="customDomain"
          type="text"
          value={user.customDomain || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Plan</label>
        <select
          name="plan"
          value={user.plan || "free"}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full px-3 py-2"
        >
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
      </div>
    </form>
  );
}
