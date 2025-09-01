
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { User, Briefcase, Heart, Linkedin, Twitter, Dribbble, Github } from 'lucide-react';
import { HeaderNav } from '@/components/portfolio/header-nav';
import { ContactFooter } from '@/components/portfolio/contact-footer';

export default function AboutPage() {
  return (
    <>
      <HeaderNav />
      <main className="max-w-7xl lg:px-8 mx-auto px-4 pt-24 pb-12 sm:pt-32 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section className="md:p-8 bg-stone-900 border-stone-800 border rounded-[40px] pt-4 pr-4 pb-4 pl-2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-4 md:p-8">
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://picsum.photos/600/750"
                      alt="Alex Chen"
                      fill
                      className="object-cover"
                      data-ai-hint="professional portrait"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </motion.div>
              </div>
              <div className="lg:col-span-7">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                  I'm Alex Chen.
                  <br />
                  A Product Designer based in San Francisco.
                </h1>
                <p className="mt-6 text-lg text-stone-300 max-w-xl">
                  With over 8 years of experience, I specialize in crafting intuitive and beautiful user experiences that bridge the gap between user needs and business goals. I thrive in collaborative environments, transforming complex problems into elegant solutions.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#" className="text-stone-400 hover:text-orange-400 transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-stone-400 hover:text-orange-400 transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-stone-400 hover:text-orange-400 transition-colors">
                    <Dribbble className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-stone-400 hover:text-orange-400 transition-colors">
                    <Github className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 p-4 md:p-8">
                <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 flex flex-col items-center text-center hover:border-orange-500 transition-colors duration-300">
                    <div className="bg-orange-500/20 text-orange-400 rounded-full p-3 mb-4 border border-orange-500/30">
                        <User className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Who I Am</h3>
                    <p className="text-stone-400 text-sm">
                        I'm Alex Chen, a Senior Product Designer with a passion for creating intuitive and beautiful user experiences. I thrive at the intersection of design and technology.
                    </p>
                </div>
                <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 flex flex-col items-center text-center hover:border-orange-500 transition-colors duration-300">
                    <div className="bg-orange-500/20 text-orange-400 rounded-full p-3 mb-4 border border-orange-500/30">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">What I Do</h3>
                    <p className="text-stone-400 text-sm">
                        With over 8 years of experience, I specialize in full-stack design, from user research and strategy to creating pixel-perfect interfaces and design systems.
                    </p>
                </div>
                <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 flex flex-col items-center text-center hover:border-orange-500 transition-colors duration-300">
                    <div className="bg-orange-500/20 text-orange-400 rounded-full p-3 mb-4 border border-orange-500/30">
                        <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">What I Love</h3>
                    <p className="text-stone-400 text-sm">
                        I'm passionate about solving complex problems and building products that not only look great but are also a joy to use. I'm always exploring new tools and techniques.
                    </p>
                </div>
            </div>
          </section>
        </motion.div>
      </main>
      <ContactFooter />
    </>
  );
}
