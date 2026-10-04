import { AboutPreview } from "../../components/sections/AboutPreview";
import { Contact } from "../../components/sections/Contact";
import { Experiments } from "../../components/sections/Experiments";
import { FeaturedProjects } from "../../components/sections/FeaturedProjects";
import { Hero } from "../../components/sections/Hero";
import { Technology } from "../../components/sections/Technology";

export function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <Technology />
      <Experiments />
      <AboutPreview />
      <Contact />
    </>
  );
}