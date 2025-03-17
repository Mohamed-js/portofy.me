// app/[slug]/minimal/Cover.jsx
"use client";

import { FaLink, FaChevronRight } from "react-icons/fa6";
import iconMap from "../../../app/[slug]/IconMap";

const Cover = ({ portfolio }) => {
  const avatar = portfolio.avatar || "https://via.placeholder.com/150";
  const name = portfolio.title || "Untitled Portfolio";
  const socialLinks = portfolio.socialLinks || [];
  const bio = portfolio.description || ""; // Using seoMeta.description as bio

  return (
    <div className="relative p-4 flex items-center justify-center w-full">
      <div className="container relative z-30 flex max-w-7xl mt-16 justify-center pb-10">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div className="text-center">
            <img
              src={avatar}
              className="h-30 rounded-full sm:h-56 z-10 mx-auto mb-6 border-5 md:border-6 border-[#242424]"
              alt={`${portfolio.slug}'s avatar`}
              data-aos="fade-in"
              data-aos-delay={1200}
            />
            <div className="text-left">
              <h1
                className="font-header text-4xl text-white sm:text-5xl md:text-6xl capitalize"
                data-aos="fade-left"
                data-aos-duration={2000}
              >
                {name}
              </h1>
              <p
                className="font-header text-sm text-gray-400 capitalize mb-4 md:text-xl md:mt-2 md:mb-8"
                data-aos="fade-right"
                data-aos-delay={2000}
                data-aos-duration={2000}
              >
                {portfolio.subTitle}
              </p>
            </div>
            <hr
              className="py-2 md:hidden"
              data-aos="fade-in"
              data-aos-delay={2000}
            />
            <div className="flex items-center">
              <div className="flex items-center justify-center pl-0 sm:justify-start md:pl-1">
                <div className="font-body text-lg uppercase text-white flex items-center justify-center">
                  <span data-aos="fade-right" data-aos-duration={2000}>
                    Let's connect
                  </span>
                  <span
                    className="animate-bounce ml-2 mt-1"
                    data-aos="fade-down"
                    data-aos-delay={2000}
                  >
                    <FaChevronRight />
                  </span>
                </div>
              </div>
              <div className="ml-6 flex flex-wrap max-w-[300px] gap-6 items-center justify-center">
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
                      data-aos="flip-right"
                      data-aos-delay={time}
                      data-aos-duration={2000}
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
      <div className="relative w-[90%] h-[80vh] rounded-xl md:rounded-3xl opacity-80">
        <img
          alt="Cover photo"
          className="w-[90%] h-full object-cover rounded-3xl"
          src={portfolio.cover || "/assets/default-cover.jpg"}
        />
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-bl from-black via-[#e45053] to-[#fd9c46] w-[90%] rounded-3xl opacity-30"></div>
      </div>
    </div>
  );
};

export default Cover;
