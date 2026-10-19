import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Photography from "@/components/sections/Photography";
import Skills from "@/components/sections/Skills";
import ExperienceSection from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity";
import HeroDivider from "@/components/sections/HeroDivider";
import { getProfile, getProjects, getSkills, getExperiences } from "@/lib/queries";
import { getPhotos } from "@/lib/photos";

export const instant = false;

export default async function Home() {
  const [profile, projects, skills, experiences, photos] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getExperiences(),
    getPhotos(),
  ]);

  return (
    <>
      {/* Cinematic overlays */}
      <div className="grain-overlay" />
      <div className="hidden dark:block vignette" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero profile={profile} />

        {/* Scroll Velocity Divider */}
        <HeroDivider />

        {/* About Section */}
        <About profile={profile} />

        {/* Projects Section */}
        <Projects projects={projects} />

        {/* Photography Section */}
        <Photography photos={photos} />

        {/* Scroll Velocity Divider */}
        <ScrollVelocity
          texts={["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "React"]}
          velocity={25}
          className="text-black/[0.08] dark:text-white/[0.06] tracking-tighter"
        />

        {/* Skills Section */}
        <Skills skills={skills} />

        {/* Experience Section */}
        <ExperienceSection experiences={experiences} />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer profile={profile} />
    </>
  );
}
