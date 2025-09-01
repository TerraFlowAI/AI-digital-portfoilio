
import { Linkedin, Twitter, Dribbble, Github, Mail, Calendar, Handshake, Globe } from 'lucide-react';

export function ContactFooter() {
    return (
        <section id="contact" className="max-w-7xl sm:px-6 sm:mt-24 border-t border-white/10 mt-16 mx-auto mb-16 pt-10 px-4">
       <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 text-white p-6 sm:p-8">
         <div className="absolute inset-0 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(255,255,255,0.07),transparent_60%)]"></div>
           <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_120%,rgba(255,255,255,0.06),transparent_60%)]"></div>
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]"></div>
         </div>
          <div className="relative">
           <h2 className="text-[14vw] sm:text-[10vw] lg:text-[7vw] leading-[0.9] font-semibold tracking-tight">
             Build with <span className="text-white/70">AI.</span>
           </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:divide-x md:divide-white/10">
             <div className="">
               <p className="text-sm text-white/70">Email</p>
               <a href="mailto:hello@mayachen.dev" className="mt-2 inline-flex items-center gap-3 text-xl sm:text-2xl font-medium tracking-tight">
                 <Mail className="w-5 h-5" />
                 <span className="break-all">hello@mayachen.dev</span>
               </a>
             </div>
             <div className="md:pl-8">
               <p className="text-sm text-white/70">Schedule</p>
               <a href="#" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border border-white/10 mt-2">
                 <Calendar className="w-4 h-4" />
                 <span>Book a call</span>
               </a>
             </div>
             <div className="md:pl-8">
               <p className="text-sm text-white/70">Social</p>
               <div className="flex flex-wrap gap-3 mt-2">
                 <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-neutral-900 border border-white/10 hover:bg-white/90">
                   <Twitter className="w-4 h-4" />
                 </a>
                 <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-neutral-900 border border-white/10 hover:bg-white/90">
                   <Github className="w-4 h-4" />
                 </a>
                 <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-neutral-900 border border-white/10 hover:bg-white/90">
                   <Globe className="w-4 h-4" />
                 </a>
                 <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-neutral-900 border border-white/10 hover:bg-white/90">
                   <Linkedin className="w-4 h-4" />
                 </a>
               </div>
             </div>
           </div>
            <p className="text-[11px] text-white/60 text-center mt-6">© Alex Chen — Available for freelance &amp; contracts<span id="year">2025</span></p>
         </div>
       </div>
     </section>
    );
}
