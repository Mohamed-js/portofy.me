"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Animator = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return <></>;
};

export default Animator;
