import { User, Briefcase, Heart } from 'lucide-react';

export function AboutCard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    );
}
