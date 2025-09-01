
'use client';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const titles = [
    "AI Automation Expert",
    "UI/UX Designer",
    "Power BI Enthusiast",
    "Customer Experience Designer"
];

const VaporText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVaporizing, setIsVaporizing] = useState(false);

    useEffect(() => {
        setIsVaporizing(true);
        const vaporizeOut = async () => {
            for (let i = displayedText.length; i >= 0; i--) {
                await new Promise(resolve => setTimeout(resolve, 30));
                setDisplayedText(prev => prev.slice(0, i));
            }
            setIsVaporizing(false);
        };
        vaporizeOut();
    }, [text]);

    useEffect(() => {
        if (!isVaporizing) {
            const vaporizeIn = async () => {
                for (let i = 0; i <= text.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    setDisplayedText(text.slice(0, i));
                }
            };
            vaporizeIn();
        }
    }, [isVaporizing, text]);


    return (
        <span className="text-orange-400 transition-colors duration-300">
            {displayedText}
            <span className="inline-block w-1 h-full bg-orange-400 animate-pulse"></span>
        </span>
    );
};


export function HeroCard() {
    const [titleIndex, setTitleIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTitleIndex(prevIndex => (prevIndex + 1) % titles.length);
        }, 3000); 

        return () => clearInterval(intervalId);
    }, []);

    return (
        <article className="relative col-span-1 row-span-2 overflow-hidden md:col-span-2 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c60c653a-1c73-431a-8619-861a312cc7db_1600w.jpg)] bg-cover rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col md:p-10 p-6 justify-between">
                <div className="flex items-start justify-between">
                    <h1 className="max-w-sm leading-tight md:text-4xl lg:text-5xl text-3xl text-white tracking-tight">Shamanth —<br /><VaporText text={titles[titleIndex]} /></h1>
                    <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
                        <div className="h-2 w-2 rounded-full bg-pink-400"></div>
                        Available for hire
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <p className="max-w-xs text-stone-300 text-lg font-light">Crafting intuitive digital experiences at the intersection of design and technology</p>
                        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-1 text-stone-300">
                                <MapPin className="h-4 w-4 flex-shrink-0" style={{strokeWidth: 1.5}} />
                                <span className="text-sm font-medium">San Francisco, CA</span>
                            </div>
                            <div className="flex items-center gap-1 text-stone-300">
                                <Calendar className="h-4 w-4 flex-shrink-0" style={{strokeWidth: 1.5}} />
                                <span className="text-sm font-medium">8+ Years</span>
                            </div>
                        </div>
                    </div>
                    <button className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-200 hover:scale-110 text-white">
                        <ArrowUpRight className="h-5 w-5" style={{strokeWidth: 1.5}} />
                    </button>
                </div>
            </div>
        </article>
    );
}
