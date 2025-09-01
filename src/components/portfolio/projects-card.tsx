import { ArrowUpRight } from 'lucide-react';

export function ProjectsCard() {
    return (
        <article className="relative flex flex-col group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-white bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c374d25d-34dc-48f7-9f70-7fbc700c42c8_800w.jpg)] bg-cover border-pink-800/30 rounded-2xl justify-between">
            <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
            <div className="relative z-10 flex flex-col justify-between h-full p-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-pink-300">Featured Work</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition-all duration-200 text-white">
                        <ArrowUpRight className="h-4 w-4" style={{strokeWidth: 1.5}} />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-pink-200 mb-2">Projects completed this year</p>
                    <span className="text-3xl font-semibold">12+</span>
                    <div className="flex gap-2 mt-3 items-center">
                        <div className="flex -space-x-2">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-pink-400/30"></div>
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-red-500 to-red-500 border-2 border-pink-400/30"></div>
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 border-2 border-pink-400/30"></div>
                        </div>
                        <span className="text-xs text-pink-200">Web & Mobile Apps</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
