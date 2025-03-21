import { TopBlur } from "./BgBlur";

const Services = ({ portfolio }) => {
  return (
    <div className="container py-16 mt-8 md:pb-0 mx-auto px-4" id="services">
      <div className="bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] h-1 rounded-[50%] opacity-90 w-full md:w-[50%] mx-auto" />
      <br />
      <br />
      <br />
      <h2 className="text-center font-header text-4xl font-semibold capitalize text-[white] sm:text-5xl lg:text-6xl">
        {portfolio.skillsTitle || "Here's what I'm good at"}
      </h2>

      <div className="grid grid-cols-2 gap-6 pt-10 sm:grid-cols-2 md:gap-10 md:pt-12 lg:grid-cols-3">
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
              <h3 className="pt-8 text-lg font-semibold text-[white] group-hover:text-yellow-400 lg:text-xl">
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
