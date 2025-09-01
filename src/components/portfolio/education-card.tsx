import { GraduationCap } from 'lucide-react';

export function EducationCard() {
    return (
        <article className="relative flex flex-col group hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-stone-800 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/92a6b77d-f9a6-4e04-9d1f-9e2f3929a5ee_800w.jpg)] bg-cover border-stone-700 border rounded-2xl justify-between">
            <div className="absolute inset-0 bg-stone-800/80 rounded-2xl"></div>
            <div className="relative z-10 flex flex-col justify-between h-full p-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-400">Education</span>
                    <div className="flex items-center gap-1 text-orange-400">
                        <GraduationCap className="h-4 w-4" style={{strokeWidth: 1.5}} />
                        <span className="text-xs font-medium">2016</span>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-stone-400 mb-2">Master of Design</p>
                    <span className="text-xl text-white font-medium">Stanford University</span>
                    <p className="text-xs text-stone-500 mt-1">Human-Computer Interaction</p>
                </div>
            </div>
        </article>
    );
}
