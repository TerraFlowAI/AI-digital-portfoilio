
'use client';

import { Button } from '@/components/ui/button';
import { Menu, Download } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Signature = () => {
    const name = "Shamanth";
    const variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => {
            const delay = i * 0.1;
            return {
                pathLength: 1,
                opacity: 1,
                transition: {
                    pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                    opacity: { delay, duration: 0.01 },
                },
            };
        },
    };

    return (
        <motion.svg
            width="150"
            height="50"
            viewBox="0 0 400 100"
            initial="hidden"
            animate="visible"
            className="text-white"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
            <motion.path
                d="M50,70 C50,20 100,20 120,50 C140,80 180,20 200,50 C220,80 260,20 280,50 C300,80 340,20 350,40"
                fill="transparent"
                strokeWidth="8"
                stroke="currentColor"
                strokeLinecap="round"
                variants={variants}
                custom={1}
            />
             <text x="40" y="90" fontFamily="Brush Script MT, Brush Script Std, cursive" fontSize="60" fill="currentColor">
                Shamanth
            </text>
        </motion.svg>
    )
}


export function HeaderNav() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#experience', label: 'Experience' },
    { href: '/#projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4">
      <nav className="mt-4 max-w-6xl mx-auto flex items-center justify-between rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg px-4 py-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="sm:text-base text-sm font-semibold tracking-tight text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            SHAMANTH
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-stone-300 hover:text-white tracking-tight px-3 py-1.5 rounded-full transition-colors duration-300 hover:bg-white/10" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#"
            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-tight text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-md"
          >
            <span>Download CV</span>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                data-menu-toggle=""
                className="md:hidden inline-flex items-center justify-center rounded-full p-2 border border-stone-800/10 bg-white/20 hover:bg-white/30"
              >
                <Menu className="w-4 h-4 text-white" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              data-menu-panel=""
              className="md:hidden w-full max-w-xs mt-3 mr-4 rounded-2xl border border-white/20 bg-white/10 shadow-lg overflow-hidden backdrop-blur-lg"
            >
              <div className="px-4 py-3 grid gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-stone-200 hover:text-white tracking-tight py-1.5">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/20 px-4 py-3">
                <a
                  href="#"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-tight text-white bg-gradient-to-r from-orange-400 to-orange-600"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
