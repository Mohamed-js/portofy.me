"use client";

import { FaLink, FaChevronDown } from "react-icons/fa6";
import iconMap from "../../../app/[slug]/IconMap";

const Cover = ({ portfolio }) => {
  const avatar = portfolio.avatar || "https://via.placeholder.com/150";
  const name = portfolio.title || "Untitled Portfolio";
  const socialLinks = portfolio.socialLinks || [];
  const bio = portfolio.description || ""; // Using seoMeta.description as bio

  return (
    <div className="flex flex-col-reverse md:flex-row md:min-h-[100vh] items-center md:px-4 justify-end md:justify-center">
      <div class="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0 w-screen h-screen fixed -z-10 top-0"></div>
      <div className="container relative z-30 flex max-w-7xl mt-10 md:mt-0 justify-center md:justify-end pb-10 p-4 md:p-0">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div>
            <div className="flex flex-col items-center md:items-start">
              <img
                src={avatar}
                className="h-30 rounded-full sm:h-40 z-10 mb-4  shadow-[0_0_8px_7px_#232323]"
                alt={`${portfolio.slug}'s avatar`}
                data-aos="fade-in"
                data-aos-delay={1200}
              />
              <h1
                className="font-header text-2xl text-white sm:text-4xl md:text-6xl capitalize"
                data-aos="fade-left"
                data-aos-duration={2000}
              >
                {name}
              </h1>
              <p
                className="font-header text-sm text-black capitalize mb-4 md:text-xl md:mt-2 md:mb-6 w-fit bg-white px-3 py-1 rounded"
                data-aos="fade-right"
                data-aos-delay={2000}
                data-aos-duration={2000}
              >
                {portfolio.subTitle}
              </p>
              <div className="mt-2 mb-6 md:mb-8">
                <p
                  className="max-w-xl mx-auto text-center md:text-start"
                  data-aos="fade-up"
                  data-aos-duration={2000}
                >
                  {bio}
                </p>
              </div>
            </div>

            <div className="flex flex-col pt-3">
              <div className=" items-center justify-center pl-0 sm:justify-start md:pl-1 md:mb-3">
                <div className="font-body text-lg uppercase text-white flex-col items-center justify-center text-center md:text-start">
                  <span>
                    {portfolio.socialLinksTitle || "Let&apos;s connect"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap md:max-w-[300px] gap-6 items-center justify-center md:justify-start mt-4">
                {socialLinks.map(({ site, icon, url }, index) => {
                  const IconComponent = iconMap[site];
                  const time = (index + 2) * 200;
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
                      // data-aos="flip-right"
                      // data-aos-delay={time}
                      // data-aos-duration={2000}
                      className="animate-bounce"
                    >
                      {icon ? (
                        <img
                          src={icon}
                          className="w-8 h-8 object-contain text-white hover:text-yellow-300 rounded-full border-3 hover:border-yellow-300"
                          alt={`${site} icon`}
                        />
                      ) : IconComponent ? (
                        <IconComponent
                          size={34}
                          className="text-2xl text-white hover:text-yellow-300"
                        />
                      ) : (
                        <FaLink
                          size={34}
                          className="text-2xl text-white hover:text-yellow-300"
                        />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[40vh] md:h-[80vh] overflow-x-hidden hidden md:block">
        <div
          className="h-full overflow-hidden md:rounded-xl"
          data-aos="fade-left"
          data-aos-duration={1000}
        >
          <img
            alt="Cover photo"
            className="w-full h-full object-cover md:max-w-[550px] md:rounded-xl z-10"
            src={portfolio.cover || "/assets/default-cover.jpg"}
          />
        </div>
      </div>
    </div>
  );
};

export default Cover;
