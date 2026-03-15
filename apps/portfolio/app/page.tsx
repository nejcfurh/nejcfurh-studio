"use client";

import { JSX, useRef } from "react";
import Navbar from "./features/homepage/components/Navbar";
import Hero from "./features/homepage/components/Hero";
import About from "./features/homepage/components/About";
import Experience from "./features/homepage/components/Experience";
import Projects from "./features/homepage/components/Projects";
import Contact from "./features/homepage/components/Contact";
import Footer from "./features/homepage/components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import GrainOverlay from "./components/GrainOverlay";

export default function Home(): JSX.Element {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <main ref={mainRef} className="relative bg-primary">
      <GrainOverlay />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Experience mainRef={mainRef} />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
