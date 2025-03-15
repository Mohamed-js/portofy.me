"use client";

import iconMap from "@/app/[slug]/IconMap";
import { FaChevronDown, FaChevronUp, FaLink } from "react-icons/fa6";

const { useState } = require("react");

const Project = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-auto md:mx-0 overflow-hidden rounded-xl relative h-[400px] w-full">
      <img
        src={project.img}
        className="w-full shadow h-full object-cover"
        alt={project.alt}
      />

      <div
        className={`absolute w-full h-full bg-black/80 text-white p-4 py-6 overflow-y-auto transition-all ${
          !isOpen ? "-bottom-81 md:-bottom-80" : "top-0"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-2xl font-bold">{project.title}</h2>
          <div className="cursor-pointer">
            {isOpen && (
              <FaChevronDown
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            )}
            {!isOpen && (
              <FaChevronUp
                onClick={() => {
                  setIsOpen(true);
                }}
              />
            )}
          </div>
        </div>
        <p>{project.description}</p>
        <br />
        <div className="flex gap-4 items-center">
          {project.links.map(({ type, url }, index) => {
            const IconComponent = iconMap[type];
            return (
              <a
                key={index}
                href={
                  url ? (url.startsWith("http") ? url : "https://" + url) : "#"
                }
                aria-label={type}
                target="_blank"
              >
                {IconComponent ? (
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
  );
};

export default Project;
