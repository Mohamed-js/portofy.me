import iconMap from "@/app/[slug]/IconMap";
import { FaChevronRight, FaLink } from "react-icons/fa6";

const About = ({ portfolio }) => {
  return (
    <section className="" id="about">
      <div className="container flex flex-col items-center py-16 md:py-0 lg:flex-row mx-auto px-4">
        <div className="w-full text-center sm:w-3/4 lg:w-3/5 mx-auto">
          <h2 className="font-header text-4xl font-semibold uppercase text-[#3f51b5] sm:text-5xl lg:text-6xl">
            Who am I?
          </h2>
          <p className="pt-6 font-body leading-relaxed text-grey-20 max-w-[500px] mx-auto">
            {portfolio.description}
          </p>
          <div className="flex flex-col justify-center pt-6 sm:flex-row">
            <div className="flex items-center justify-center sm:justify-start">
              <p className="font-body text-lg font-semibold uppercase text-grey-20">
                Connect with me
              </p>
              <div className="hidden sm:block ml-2 mr-4">
                <FaChevronRight color="#3f51b5" />
              </div>
            </div>
            <div className="flex items-center justify-center pt-5 pl-2 sm:justify-start sm:pt-0 gap-4">
              {portfolio.socialLinks.map(({ site, icon, url }, index) => {
                const IconComponent = iconMap[site];
                return (
                  <a
                    key={index}
                    href={
                      url
                        ? url.startsWith("http")
                          ? url
                          : "https://" + url
                        : "#"
                    }
                    aria-label={site}
                    target="_blank"
                  >
                    {icon ? (
                      <img
                        src={icon}
                        className="w-8 h-8 object-contain text-white bg-black hover:text-yellow-300 rounded-full border-3 hover:border-yellow-300"
                        alt={`${site} icon`}
                      />
                    ) : IconComponent ? (
                      <IconComponent
                        size={34}
                        className="text-2xl text-black hover:text-yellow-300"
                      />
                    ) : (
                      <FaLink
                        size={34}
                        className="text-2xl text-black hover:text-yellow-300"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
