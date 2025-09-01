import { ExternalLink } from 'lucide-react';

export function ExperienceCard() {
    return (
        <article className="relative overflow-hidden group hover:border-orange-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-stone-800 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1329c306-0747-4910-83ea-6f0a8b58467e_800w.jpg)] bg-cover border-stone-700 border rounded-2xl">
            <div className="absolute inset-0 bg-stone-800/80"></div>
            <div className="relative h-full flex flex-col p-6 justify-between">
                <div className="flex items-center justify-between">
                    <span className="rounded-full bg-orange-500/20 text-orange-400 px-3 py-1 text-xs font-medium border border-orange-500/30">Experience</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-700 hover:bg-stone-600 transition-all duration-200 text-stone-300">
                        <ExternalLink className="h-4 w-4" style={{strokeWidth: 1.5}} />
                    </button>
                </div>
                <div className="">
                    <h3 className="text-2xl mb-2 tracking-tight text-white">Senior Designer</h3>
                    <p className="text-sm text-stone-400 mb-1">Meta • 2022 - Present</p>
                    <p className="text-sm text-stone-400">Leading product design for AR/VR experiences</p>
                </div>
            </div>
        </article>
    );
}
