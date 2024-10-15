import Link from "next/link";
import React from "react";
import {
  FiGithub,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";

const Footer = () => {
  const socialLinks = [
    {
      name: "Github",
      icon: <FiGithub />,
      link: "https://www.github.com/pray3m",
    },
    {
      name: "Youtube",
      icon: <FiYoutube />,
      link: "https://www.youtube.com/",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin />,
      link: "https://www.linkedin.com/in/pray3m/",
    },
    {
      name: "Instagram",
      icon: <FiInstagram />,
      link: "https://instagram.com/pray3m",
    },
    {
      name: "Twitter",
      icon: <FiTwitter />,
      link: "https://twitter.com/pray3m_",
    },
  ];

  return (
    <footer className="w-full px-4 md:px-8 lg:px-20 py-8 bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl md:text-3xl font-bold">
              freelance<b className="text-green-500">X</b>
            </span>
            <p className="text-gray-600 text-sm md:text-base">
              &copy; {new Date().getFullYear()} freelanceX Global Inc.
            </p>
          </div>
          <ul className="flex gap-4 md:gap-6">
            {socialLinks.map(({ icon, link, name }) => (
              <li key={name}>
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  <span className="text-xl md:text-2xl text-gray-600 hover:text-green-500 transition-colors duration-300">
                    {icon}
                  </span>
                  <span className="sr-only">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-center mt-6 text-sm md:text-base text-gray-600 font-medium">
          Made With Sleepless Nights! 🌙
        </p>
      </div>
    </footer>
  );
};

export default Footer;