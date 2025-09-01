import { HeroCard } from '@/components/portfolio/hero-card';
import { SkillsCard } from '@/components/portfolio/skills-card';
import { ExperienceCard } from '@/components/portfolio/experience-card';
import { ProjectsCard } from '@/components/portfolio/projects-card';
import { EducationCard } from '@/components/portfolio/education-card';
import { ToolsCard } from '@/components/portfolio/tools-card';
import { ContactFooter } from '@/components/portfolio/contact-footer';
import { HeaderNav } from '@/components/portfolio/header-nav';
import { AboutCard } from '@/components/portfolio/about-card';

export default function Home() {
  return (
    <>
      <HeaderNav />
      <main className="max-w-7xl lg:px-8 mx-auto px-4 pt-24 pb-12 sm:pt-32 sm:pb-20">
          <section className="md:p-8 bg-stone-900 border-stone-800 border rounded-[40px] pt-4 pr-4 pb-4 pl-2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
              <div className="grid auto-rows-[240px] gap-4 md:auto-rows-[300px] lg:auto-rows-[360px] md:grid-cols-3">
                  <HeroCard />
                  <SkillsCard />
                  <ExperienceCard />
                  <ProjectsCard />
                  <EducationCard />
                  <ToolsCard />
              </div>
          </section>
          <section id="about" className="md:p-8 bg-stone-900 border-stone-800 border rounded-[40px] pt-4 pr-4 pb-4 pl-2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] mt-12">
            <h2 className="text-3xl font-bold text-white mb-6 px-2 md:px-0">About Me</h2>
            <AboutCard />
          </section>
          <section id="experience" className="md:p-8 bg-stone-900 border-stone-800 border rounded-[40px] pt-4 pr-4 pb-4 pl-2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] mt-12">
            <h2 className="text-3xl font-bold text-white mb-6 px-2 md:px-0">Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 hover:border-orange-500 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-orange-400">Meta</span>
                        <span className="text-sm text-stone-400">2022 - Present</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Senior Product Designer</h3>
                    <p className="text-stone-400 text-sm">
                        Leading design for flagship VR products on the Meta Quest platform. Responsible for end-to-end design process, from concept to launch, including user research, wireframing, prototyping, and visual design. Collaborating with cross-functional teams to deliver intuitive and immersive experiences.
                    </p>
                </div>
                <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 hover:border-orange-500 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-orange-400">Google</span>
                        <span className="text-sm text-stone-400">2019 - 2022</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Product Designer</h3>
                    <p className="text-stone-400 text-sm">
                        Worked on Google's Material Design system, contributing to the evolution of design guidelines and components. Designed and shipped features for various Google products, including Google Maps and Google Photos, focusing on usability and accessibility.
                    </p>
                </div>
                 <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 hover:border-orange-500 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-orange-400">Airbnb</span>
                        <span className="text-sm text-stone-400">2017 - 2019</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">UI/UX Designer</h3>
                    <p className="text-stone-400 text-sm">
                        Focused on improving the user experience of the booking flow. Conducted A/B tests and user studies to inform design decisions. Created high-fidelity mockups and interactive prototypes for new features, contributing to an increase in conversion rates.
                    </p>
                </div>
                 <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 hover:border-orange-500 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-orange-400">Dropbox</span>
                        <span className="text-sm text-stone-400">2016 - 2017</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Design Intern</h3>
                    <p className="text-stone-400 text-sm">
                        Assisted the design team with various projects, including the redesign of the Dropbox web interface. Gained experience in user research, interaction design, and working within a large-scale design system.
                    </p>
                </div>
            </div>
          </section>
          <ContactFooter />
      </main>
    </>
  );
}
