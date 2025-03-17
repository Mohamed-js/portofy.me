import iconMap from "@/app/[slug]/IconMap";
import { FaChevronRight, FaLink } from "react-icons/fa6";
import { BottomBlur } from "./BgBlur";

const About = ({ portfolio }) => {
  return (
    <section className="my-8 md:mb-16 p-4" id="about">
      <div className="bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] h-1 rounded-[50%] opacity-90 w-full md:w-[50%] mx-auto" />
      <br />
      <br />
      <br />
      <div className="container flex flex-col items-center py-16 md:py-0 lg:flex-row mx-auto px-4">
        <div className="w-full text-center sm:w-3/4 lg:w-3/5 mx-auto">
          <h2 className="font-header text-4xl font-semibold capitalize text-white sm:text-5xl lg:text-6xl">
            {portfolio.descriptionTitle || "Who am I?"}
          </h2>
          <p className="pt-6 font-body leading-relaxed text-grey-20 max-w-[500px] mx-auto">
            {portfolio.description}
          </p>
          <div className="flex flex-col justify-center pt-6 sm:flex-row">
            <div className="flex items-center justify-center sm:justify-start">
              <p className="font-body text-lg font-semibold capitalize text-white">
                {portfolio.socialLinksTitle || "Connect with me"}
              </p>
              <div className="hidden sm:block ml-2 mr-4">
                <FaChevronRight color="white" />
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
                        color="white"
                        className="text-2xl text-black hover:text-yellow-300"
                      />
                    ) : (
                      <FaLink
                        size={34}
                        color="white"
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
