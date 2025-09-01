
'use client';

import { Button } from '@/components/ui/button';
import { Menu, Download } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

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
          <span className="sm:text-base text-sm font-semibold tracking-tight text-stone-800">
            ALEX CHEN
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-stone-800 hover:text-stone-950 tracking-tight">
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
                <Menu className="w-4 h-4 text-stone-800" />
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
                  <Link key={link.href} href={link.href} className="text-sm text-stone-800 tracking-tight py-1.5">
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
