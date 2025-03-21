"use client";
import { useState, useEffect } from "react";

const VideoComponent: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(800);

  useEffect(() => {
    const isSSR = typeof window === "undefined";
    if (!isSSR) {
      setWindowWidth(window.innerWidth);
    }
  }, [windowWidth]);
  return (
    <video width={`${windowWidth + 400}px`} autoPlay loop muted>
      <source src="/hero.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoComponent;
