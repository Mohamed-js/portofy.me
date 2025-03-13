// import closeIcon from "/assets/img/icon-close.svg";

const MobileMenu = ({ links, closeMenu }) => {
  const handleNavigation = (id) => {
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-70 min-h-screen bg-black opacity-90 lg:hidden">
      <div className="absolute right-0 min-h-screen w-2/3 bg-[#5540af] py-4 px-8 shadow md:w-1/3">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-white text-xl"
          onClick={closeMenu}
        >
          ×
        </button>
        <ul className="mt-8 flex flex-col">
          {links.map((link) => (
            <li className="py-2" key={link.id}>
              <span
                onClick={() => handleNavigation(link.id)}
                className="cursor-pointer pt-0.5 font-header font-semibold uppercase text-white"
              >
                {link.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
