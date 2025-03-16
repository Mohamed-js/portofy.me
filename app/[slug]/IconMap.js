import {
  FaLinkedin,
  FaFacebookF,
  FaDribbble,
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaBehance,
  FaLink,
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
  other: FaLink,
};

export default iconMap;
