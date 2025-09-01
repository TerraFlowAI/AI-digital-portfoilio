import { HeroCard } from '@/components/portfolio/hero-card';
import { SkillsCard } from '@/components/portfolio/skills-card';
import { ExperienceCard } from '@/components/portfolio/experience-card';
import { ProjectsCard } from '@/components/portfolio/projects-card';
import { EducationCard } from '@/components/portfolio/education-card';
import { ToolsCard } from '@/components/portfolio/tools-card';
import { ContactFooter } from '@/components/portfolio/contact-footer';

export default function Home() {
  return (
    <>
      <main className="max-w-7xl lg:px-8 mx-auto px-4 py-12 sm:py-20">
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
          <ContactFooter />
      </main>
    </>
  );
}
