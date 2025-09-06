import { User, Briefcase, Heart } from 'lucide-react';

export function AboutCard() {
    return (
        <section id="about" className="md:p-8 bg-stone-900/80 backdrop-blur-sm border-stone-800 border rounded-[40px] pt-4 pr-4 pb-4 pl-2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] mt-12">
            <h2 className="text-3xl font-bold text-white mb-6 px-2 md:px-0">About Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 flex flex-col items-center text-center hover:border-orange-500 transition-colors duration-300">
                    <div className="bg-orange-500/20 text-orange-400 rounded-full p-3 mb-4 border border-orange-500/30">
                        <User className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Who I Am</h3>
                    <p className="text-stone-400 text-sm">
                        I'm Shamanth, a Senior Product Designer with a passion for creating intuitive and beautiful user experiences. I thrive at the intersection of design and technology.
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
    );
}
