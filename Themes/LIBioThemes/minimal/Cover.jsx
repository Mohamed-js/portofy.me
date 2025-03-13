// app/[slug]/minimal/Cover.jsx
"use client";

import { FaLink, FaChevronDown } from "react-icons/fa6";
import iconMap from "../../../app/[slug]/IconMap";

const Cover = ({ portfolio }) => {
  const avatar = portfolio.avatar || "https://via.placeholder.com/150";
  const name = portfolio.title || "Untitled Portfolio";
  const socialLinks = portfolio.socialLinks || [];
  const bio = portfolio.description || ""; // Using seoMeta.description as bio

  return (
    <div className="relative grid md:grid-cols-2 overflow-hidden">
      <div className="relative w-full md:h-[100vh]">
        <div
          className="h-full rounded-lg w-screen md:w-[50vw] fixed top-0 left-0 right-0 blur-1"
          data-aos="fade-right"
          data-aos-duration={1000}
        >
          <img
            alt="Cover photo"
            className="w-full h-full object-cover"
            src={portfolio.cover || "/assets/default-cover.jpg"}
          />
          <div className="md:hidden bg-black/70 absolute inset-0 b"></div>
        </div>
      </div>
      <div className="container relative z-30 flex max-w-7xl mt-10 md:mt-8 justify-center p-4 pb-10">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div className="text-center">
            <div>
              <img
                src={avatar}
                className="h-30 rounded-full md:h-50 z-10 mx-auto mb-4 md:border-6 border-[#242424]"
                alt={`${portfolio.slug}'s avatar`}
                data-aos="fade-in"
                data-aos-delay={1200}
              />
              <h1
                className="font-header text-4xl text-white md:text-6xl capitalize"
                data-aos="fade-left"
                data-aos-duration={2000}
              >
                {name}
              </h1>
              <p
                className="font-header text-base text-gray-200 md:text-gray-400 capitalize mb-4 md:text-xl md:mt-2 md:mb-8"
                data-aos="fade-right"
                data-aos-delay={2000}
                data-aos-duration={2000}
              >
                {portfolio.subTitle}
              </p>
              <div className="text-center mt-2 mb-6 md:mt-4 md:mb-8">
                <p
                  className="max-w-xl mx-auto text-lg text-balance"
                  data-aos="fade-up"
                  data-aos-duration={2000}
                >
                  {bio}
                </p>
              </div>
            </div>
            <hr
              className="py-2 md:hidden"
              data-aos="fade-in"
              data-aos-delay={2000}
            />
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="flex items-center justify-center pl-0 md:justify-start md:pl-1">
                <div className="font-body text-lg uppercase text-white flex flex-col items-center justify-center">
                  <span data-aos="fade-right" data-aos-duration={2000}>
                    Let's connect
                  </span>
                  <span
                    className="animate-bounce mt-4"
                    data-aos="fade-down"
                    data-aos-delay={2000}
                  >
                    <FaChevronDown />
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap max-w-[300px] gap-6 items-center justify-center mt-4 pb-28">
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
    </div>
  );
};

export default Cover;
