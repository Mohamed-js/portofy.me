"use client";

import { links } from "../menuData";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { FaBurger } from "react-icons/fa6";

const Navbar = ({ portfolio, user }) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const triggerNavItem = (id) => {
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";

  return (
    <div className="mx-auto px-4  w-full z-50 top-0 py-3 sm:py-5 absolute">
      <div className="container flex items-center justify-between mx-auto">
        <div className="text-xl font-semibold text-white">
          <a href="/">
            <span className="capitalize">
              {user.firstName} {user.lastName}
            </span>{" "}
            {effectivePlan === "free" && `| `}
            {effectivePlan === "free" && <Link href="/">Portofy.me</Link>}
          </a>
        </div>

        <div className="hidden lg:block">
          <ul className="flex items-center">
            {links.map((link) => (
              <li className="group pl-6" key={link.id}>
                <span
                  onClick={() => triggerNavItem(link.id)}
                  className="cursor-pointer pt-0.5 font-header font-semibold uppercase text-white"
                >
                  {link.label}
                </span>
                <span className="block h-0.5 w-full bg-transparent group-hover:bg-yellow"></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="block lg:hidden">
          <button onClick={() => setMobileMenu(true)}>
            <i className="bx bx-menu text-4xl text-white"></i>
            <FaBurger size={25} color="white" />
          </button>
        </div>
      </div>

      {mobileMenu && (
        <MobileMenu links={links} closeMenu={() => setMobileMenu(false)} />
      )}
    </div>
  );
};

export default Navbar;
