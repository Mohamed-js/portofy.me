import {
  FaLinkedin,
  FaFacebookF,
  FaDribbble,
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaBehance,
  FaChevronRight,
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
    Dribbble: FaDribbble,
    Instagram: FaInstagram,
    X: FaXTwitter,
    Twitter: FaXTwitter, // Fallback for older "Twitter" labels
  };

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${user.cover})` }}
    >
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-gray-900/80 to-gray-700/80 bg-cover bg-center bg-no-repeat"></div>

      <div className="container relative z-30 flex items-center justify-center mx-auto max-w-7xl min-h-screen">
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <div className="rounded-full border-8 border-[#e45053] shadow-xl">
            <img
              src={avatar}
              className="h-48 rounded-full sm:h-56 scale-x-[-1]"
              alt={`${user.username}'s avatar`}
            />
          </div>
          <div className="pt-8 sm:pt-10 lg:pl-8 lg:pt-0 text-center lg:text-left">
            <h1 className="font-header text-4xl text-white sm:text-5xl md:text-6xl">
              Hello, I'm {name}!
            </h1>
            <div className="flex flex-col justify-center pt-3 sm:flex-row sm:pt-5 lg:justify-start">
              <div className="flex items-center justify-center pl-0 sm:justify-start md:pl-1">
                <p className="font-body text-lg uppercase text-white">
                  Let's connect
                </p>
                <div className="hidden sm:block ml-2">
                  <FaChevronRight />
                </div>
              </div>
              <div className="flex items-center justify-center pt-5 md:pl-2 sm:justify-start sm:pt-0 ml-4">
                {socialLinks.map(({ site, icon, url }, index) => {
                  const IconComponent = iconMap[site];
                  return (
                    <a
                      key={index}
                      href={url}
                      className={`pl-${index !== 0 ? 4 : 0}`}
                      aria-label={site}
                    >
                      {!icon ? (
                        <img
                          src={icon}
                          className="w-6 h-6 text-white hover:text-yellow-300"
                          alt={`${site} icon`}
                        />
                      ) : IconComponent ? (
                        <IconComponent className="text-2xl text-white hover:text-yellow-300" />
                      ) : (
                        <span className="text-2xl text-white hover:text-yellow-300">
                          {site}
                        </span>
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
