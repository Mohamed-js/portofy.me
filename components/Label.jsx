const Label = ({ children }) => {
  return (
    <label className="block text-xs md:text-sm font-semibold mb-2 text-[#e0e0e0]">
      {children}
    </label>
  );
};

export default Label;
