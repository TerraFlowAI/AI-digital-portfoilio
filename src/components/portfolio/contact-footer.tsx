import { Linkedin, Twitter, Dribbble, Github } from 'lucide-react';

export function ContactFooter() {
    return (
        <footer id="contact" className="md:px-12 bg-stone-900 border-stone-800 rounded-[40px] border-t mt-12 py-12 px-6 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-stone-300">
                <div className="">
                    <h4 className="text-lg font-semibold mb-4 tracking-tight text-white">Let's Connect</h4>
                    <p className="text-sm font-light max-w-xs text-stone-400">Always open to discussing new opportunities and interesting projects.</p>
                    <p className="mt-4 text-xs text-stone-500">© 2024 Alex Chen. All rights reserved.</p>
                </div>
                <div className="">
                    <h5 className="text-sm font-semibold mb-3 tracking-tight text-white">Contact</h5>
                    <ul className="space-y-2 text-sm font-light text-stone-400">
                        <li><a href="mailto:alex@example.com" className="hover:text-orange-400 transition-colors duration-200">alex@example.com</a></li>
                        <li><a href="tel:+1234567890" className="hover:text-orange-400 transition-colors duration-200">+1 (234) 567-890</a></li>
                        <li className="hover:text-orange-400 transition-colors duration-200 cursor-pointer">San Francisco, CA</li>
                    </ul>
                </div>
                <div className="">
                    <h5 className="text-sm font-semibold mb-3 tracking-tight text-white">Resources</h5>
                    <ul className="space-y-2 text-sm font-light text-stone-400">
                        <li className=""><a href="#" className="hover:text-orange-400 transition-colors duration-200">Resume</a></li>
                        <li className=""><a href="#" className="hover:text-orange-400 transition-colors duration-200">Portfolio</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors duration-200">Case Studies</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors duration-200">References</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-sm font-semibold mb-3 tracking-tight text-white">Social</h5>
                    <div className="flex space-x-4">
                        <a href="#" className="text-stone-500 hover:text-orange-400 transition-all duration-200 hover:scale-110">
                            <Linkedin className="w-5 h-5" style={{strokeWidth: 1.5}} />
                        </a>
                        <a href="#" className="text-stone-500 hover:text-orange-400 transition-all duration-200 hover:scale-110">
                            <Twitter className="w-5 h-5" style={{strokeWidth: 1.5}} />
                        </a>
                        <a href="#" className="text-stone-500 hover:text-orange-400 transition-all duration-200 hover:scale-110">
                            <Dribbble className="w-5 h-5" style={{strokeWidth: 1.5}} />
                        </a>
                        <a href="#" className="text-stone-500 hover:text-orange-400 transition-all duration-200 hover:scale-110">
                            <Github className="w-5 h-5" style={{strokeWidth: 1.5}} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
