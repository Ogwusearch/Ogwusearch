import { AboutPreview } from "../components/AboutPreview";
import { Contact } from "../components/Contact";
import { Experiments } from "../components/Experiments";
import { FeaturedProjects } from "../components/FeaturedProjects";
import { Hero } from "../components/Hero";
import { Technology } from "../components/Technology";

export function HomePage() {
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