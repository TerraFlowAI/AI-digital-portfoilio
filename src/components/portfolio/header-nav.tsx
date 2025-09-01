'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function HeaderNav() {
  const navLinks = [
    { href: '#', label: 'Home' },
    { href: '#', label: 'Experience' },
    { href: '#', label: 'Projects' },
    { href: '#about', label: 'About' },
    { href: '#', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between rounded-full bg-black/20 border border-stone-700/50 backdrop-blur-lg shadow-lg px-4 py-2 text-white">
          <div className="flex items-center">
            <a href="#" className="text-lg font-bold tracking-tight">
              ALEX CHEN
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-stone-300 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild className="hidden md:flex rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all hover:scale-105">
              <a href="#">Download CV</a>
            </Button>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-stone-900/95 border-l-stone-800 w-64">
                  <div className="flex flex-col items-center justify-center h-full">
                    <nav className="flex flex-col items-center gap-6">
                      {navLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="px-4 py-2 text-lg font-medium text-stone-300 hover:text-orange-400 transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                     <Button asChild className="mt-8 w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all hover:scale-105">
                        <a href="#">Download CV</a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
