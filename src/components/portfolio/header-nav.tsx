
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
    { href: '/', label: 'Work' },
    { href: '/#stack', label: 'Stack' },
    { href: '/#evals', label: 'Evals' },
    { href: '/about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      <nav className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <svg
            className="md:w-14 md:h-14 w-[36px] h-[36px]"
            viewBox="0 0 48 48"
            aria-hidden="true"
            strokeWidth="2"
            style={{ width: '36px', height: '36px' }}
          >
            <path d="M24 8 L40 36 H8 Z" fill="currentColor"></path>
          </svg>
          <span className="sm:text-base text-sm font-medium tracking-tight">
            Maya Chen
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-white/70 hover:text-white tracking-tight">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium tracking-tight text-white bg-white/10 hover:bg-white/15 border border-white/10 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Resume</span>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                data-menu-toggle=""
                className="md:hidden inline-flex items-center justify-center rounded-full p-2 border border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Menu className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              data-menu-panel=""
              className="md:hidden w-full max-w-xs mt-3 mr-4 rounded-2xl border border-white/10 bg-white/5 shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 grid gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-white/90 tracking-tight py-1.5">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/10 px-4 py-3">
                <a
                  href="#"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border border-white/10"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
