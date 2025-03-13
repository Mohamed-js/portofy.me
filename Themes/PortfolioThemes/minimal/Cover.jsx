"use client";

import { FaLink, FaChevronDown, FaChevronRight } from "react-icons/fa6";
import iconMap from "../../../app/[slug]/IconMap";

const Cover = ({ portfolio }) => {
  const avatar = portfolio.avatar || "https://via.placeholder.com/150";
  const name = portfolio.title || "Untitled Portfolio";
  const socialLinks = portfolio.socialLinks || [];
  const bio = portfolio.description || "";

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat py-8"
      style={{ backgroundImage: `url(${portfolio.cover})` }}
    >
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#5540aed9] to-[#412f90d4] bg-cover bg-center bg-no-repeat"></div>

      <div className="container relative mx-auto z-30 pt-20 pb-12 sm:pt-56 sm:pb-48 lg:pt-64 lg:pb-48">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div className="rounded-full border-8 border-[#5540af] shadow-xl">
            <img
              src={avatar}
              className="h-48 rounded-full sm:h-56"
              alt="author"
            />
          </div>
          <div className="pt-8 sm:pt-10 lg:pl-8 lg:pt-0">
            <h1 className="text-center font-header text-4xl text-white sm:text-left sm:text-5xl md:text-6xl">
              Hello, I&apos;m {name}!
            </h1>
            <div className="flex flex-col justify-center pt-3 sm:flex-row sm:pt-5 lg:justify-start">
              <div className="flex items-center justify-center pl-0 sm:justify-start md:pl-1">
                <p className="font-body text-lg uppercase text-white">
                  Let&apos;s connect
                </p>
                <div className="hidden sm:block mx-4">
                  <FaChevronRight />
                </div>
              </div>
              <div className="flex items-center justify-center pt-5 md:pl-2 sm:justify-start sm:pt-0">
                {socialLinks.map(({ site, icon, url }, index) => {
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
