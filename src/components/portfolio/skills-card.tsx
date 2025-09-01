import { ArrowUpRight } from 'lucide-react';

export function SkillsCard() {
    return (
        <article className="relative flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-white bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/6674ed65-221c-42e3-8cf9-a9c3eca77da6_800w.jpg)] bg-cover rounded-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-red-300">Core Skills</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-200 text-white">
                        <ArrowUpRight className="h-4 w-4" style={{strokeWidth: 1.5}} />
                    </button>
                </div>
                <h3 className="text-xl font-semibold mb-2">Design & Strategy</h3>
                <p className="text-sm text-red-200 mb-4">Full-stack design from research to implementation</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400"></div>
                        <span>Product Design</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                        <span>Design Systems</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                        <span>User Research</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
