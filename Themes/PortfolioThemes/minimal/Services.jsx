const Services = ({ portfolio }) => {
  return (
    <div
      className="container py-16 md:py-20 md:pt-0 mx-auto px-4"
      id="services"
    >
      <h2 className="text-center font-header text-4xl font-semibold uppercase text-[#3f51b5] sm:text-5xl lg:text-6xl">
        {portfolio.skillsTitle || "Here's what I'm good at"}
      </h2>

      <div className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 md:gap-10 md:pt-12 lg:grid-cols-3">
        {portfolio.skills.map((skill, index) => (
          <div
            key={index}
            className="rounded px-8 py-12 shadow transition duration-300"
          >
            <div className="mx-auto h-24 w-24 text-center xl:h-28 xl:w-28">
              <img
                src={skill.image}
                alt={`${skill.name} icon`}
                className="w-full h-full object-contain object-center"
              />
            </div>
            <div className="text-center">
              <h3 className="pt-8 text-lg font-semibold text-[#3f51b5] group-hover:text-yellow-400 lg:text-xl">
                {skill.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
