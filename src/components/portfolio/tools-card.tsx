export function ToolsCard() {
    return (
        <article className="relative flex flex-wrap content-start gap-2 hover:border-stone-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-stone-800 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ed96ff8f-02b6-47fa-8b8f-4e6c07df10a4_800w.jpg)] bg-cover border-stone-700 border rounded-2xl p-6">
            <div className="absolute inset-0 bg-stone-800/80 rounded-2xl"></div>
            <div className="relative z-10 w-full">
                <div className="w-full flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-stone-400">Tools & Software</span>
                </div>
                <div className="flex flex-wrap content-start gap-2">
                    <span className="rounded-full bg-stone-700 border border-stone-600 px-3 py-1.5 text-sm font-medium text-stone-300 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200 hover:scale-105 cursor-pointer">Figma</span>
                    <span className="rounded-full bg-stone-700 border border-stone-600 px-3 py-1.5 text-sm font-medium text-stone-300 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200 hover:scale-105 cursor-pointer">Sketch</span>
                    <span className="rounded-full bg-stone-700 border border-stone-600 px-3 py-1.5 text-sm font-medium text-stone-300 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200 hover:scale-105 cursor-pointer">Framer</span>
                    <span className="rounded-full bg-stone-700 border border-stone-600 px-3 py-1.5 text-sm font-medium text-stone-300 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200 hover:scale-105 cursor-pointer">Principle</span>
                    <span className="rounded-full bg-stone-700 border border-stone-600 px-3 py-1.5 text-sm font-medium text-stone-300 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200 hover:scale-105 cursor-pointer">After Effects</span>
                    <span className="rounded-full bg-stone-700 border border-stone-600 px-3 py-1.5 text-sm font-medium text-stone-300 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200 hover:scale-105 cursor-pointer">Webflow</span>
                    <span className="rounded-full bg-stone-700 border border-stone-600 px-3 py-1.5 text-sm font-medium text-stone-300 hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200 hover:scale-105 cursor-pointer">React</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-stone-500">Always exploring new tools</span>
                </div>
            </div>
        </article>
    );
}
