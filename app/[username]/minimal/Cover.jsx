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

const Cover = ({ user }) => {
  //   const backgroundImage = "/assets/bg-hero.jpg"; // Static, adjust if dynamic
  const avatar = user.avatar;
  const name =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const socialLinks = user.socialLinks || [];

  // Map labels to React Icons if no icon is provided
  const iconMap = {
    github: FaGithub,
    behance: FaBehance,
    facebook: FaLinkedin,
    linkedin: FaFacebookF,
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
  };

  return (
    <div className="relative p-4">
      <div className="relative w-full h-50 md:h-100 bg-gray-200 rounded-xl md:rounded-3xl ">
        <div className="h-full rounded-lg md:rounded-3xl overflow-hidden">
          <img
            alt="Cover photo"
            className="w-full h-full object-cover"
            src={user.cover}
          />
        </div>
        <img
          src={avatar}
          className="h-30 rounded-full sm:h-56 z-10 mx-auto -translate-y-20 md:-translate-y-30 border-5 md:border-6 border-[#242424]"
          alt={`${user.username}'s avatar`}
        />
      </div>
      {/* sadasdasd */}
      <div className="container relative z-30 flex max-w-7xl mt-16 md:mt-32 justify-center pb-10">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div className="text-center">
            <h1 className="font-header text-4xl text-white sm:text-5xl md:text-6xl">
              Hello, I'm {name}!
            </h1>
            <div className="text-center mt-2 mb-6 md:mt-4 md:mb-8">
              <p className="max-w-xl mx-auto text-lg">{user.bio}</p>
            </div>
            <hr className="py-2 md:hidden" />
            <div className="flex flex-col items-center justify-center pt-3 ">
              <div className="flex items-center justify-center pl-0 sm:justify-start md:pl-1">
                <div className="font-body text-lg uppercase text-white flex flex-col items-center justify-center">
                  <span>Let's connect</span>

                  <FaChevronDown className="animate-bounce mt-4" />
                </div>
              </div>
              <div className="flex flex-wrap max-w-[300px] gap-6 items-center justify-center mt-10">
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
                      {IconComponent ? (
                        <IconComponent
                          size={34}
                          className="text-2xl text-white hover:text-yellow-300"
                        />
                      ) : icon ? (
                        <img
                          src={icon}
                          className="w-8 h-8 object-contain text-white hover:text-yellow-300 rounded-full border-3 hover:border-yellow-300"
                          alt={`${site} icon`}
                        />
                      ) : (
                        <>
                          <FaLink
                            size={34}
                            className="text-2xl text-white hover:text-yellow-300"
                          />
                        </>
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
