// app/[slug]/minimal/Cover.jsx
"use client";

import {
  FaLinkedin,
  FaFacebookF,
  FaDribbble,
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaBehance,
  FaLink,
  FaChevronDown,
  FaGitlab,
  FaBitbucket,
  FaYoutube,
  FaVimeo,
  FaTiktok,
  FaTwitch,
  FaMedium,
  FaStackOverflow,
  FaPinterest,
  FaSoundcloud,
  FaSpotify,
  FaPatreon,
  FaLocationArrow,
} from "react-icons/fa6";

const Cover = ({ portfolio }) => {
  const avatar = portfolio.avatar || "https://via.placeholder.com/150";
  const name = portfolio.title || "Untitled Portfolio";
  const socialLinks = portfolio.socialLinks || [];
  const bio = portfolio.seoMeta?.description || ""; // Using seoMeta.description as bio

  const iconMap = {
    github: FaGithub,
    behance: FaBehance,
    facebook: FaFacebookF, // Fixed: was FaLinkedin
    linkedin: FaLinkedin, // Fixed: swapped with facebook
    dribbble: FaDribbble,
    instagram: FaInstagram,
    twitter: FaXTwitter,
    gitlab: FaGitlab,
    bitbucket: FaBitbucket,
    youtube: FaYoutube,
    vimeo: FaVimeo,
    tiktok: FaTiktok,
    twitch: FaTwitch,
    medium: FaMedium,
    stackoverflow: FaStackOverflow,
    pinterest: FaPinterest,
    soundcloud: FaSoundcloud,
    spotify: FaSpotify,
    patreon: FaPatreon,
    website: FaLocationArrow,
    other: FaLink, // Added for "other" site type
  };

  return (
    <div className="relative p-4">
      <div className="relative w-full h-50 md:h-100 rounded-xl md:rounded-3xl">
        <div
          className="h-full rounded-lg md:rounded-3xl overflow-hidden"
          data-aos="fade-down"
          data-aos-duration={1000}
        >
          <img
            alt="Cover photo"
            className="w-full h-full object-cover"
            src={portfolio.cover || "/assets/default-cover.jpg"}
          />
        </div>
        <img
          src={avatar}
          className="h-30 rounded-full sm:h-56 z-10 mx-auto -translate-y-20 md:-translate-y-30 border-5 md:border-6 border-[#242424]"
          alt={`${portfolio.slug}'s avatar`}
          data-aos="fade-in"
          data-aos-delay={1200}
        />
      </div>
      <div className="container relative z-30 flex max-w-7xl mt-16 md:mt-32 justify-center pb-10">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div className="text-center">
            <h1
              className="font-header text-4xl text-white sm:text-5xl md:text-6xl capitalize"
              data-aos="fade-left"
              data-aos-duration={2000}
            >
              Hello, I'm {name}!
            </h1>
            <div className="text-center mt-2 mb-6 md:mt-4 md:mb-8">
              <p
                className="max-w-xl mx-auto text-lg text-balance"
                data-aos="fade-up"
                data-aos-duration={2000}
              >
                {bio}
              </p>
            </div>
            <hr className="py-2 md:hidden" />
            <div className="flex flex-col items-center justify-center pt-3">
              <div className="flex items-center justify-center pl-0 sm:justify-start md:pl-1">
                <div className="font-body text-lg uppercase text-white flex flex-col items-center justify-center">
                  <span data-aos="fade-right" data-aos-duration={2000}>
                    Let's connect
                  </span>
                  <FaChevronDown
                    className="animate-bounce mt-4"
                    data-aos="fade-down"
                    data-aos-delay={2000}
                  />
                </div>
              </div>
              <div className="flex flex-wrap max-w-[300px] gap-6 items-center justify-center mt-10">
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