
'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { VoiceCloneDialog } from '@/components/portfolio/voice-clone-dialog';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { RiveOrb } from '@/components/portfolio/rive-orb';

const FloatingOrb = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-8 right-8 z-50 cursor-pointer group">
          <RiveOrb />
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-neutral-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Talk to My Clone
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 rotate-45"></div>
          </div>
        </div>
      </DialogTrigger>
      <VoiceCloneDialog />
    </Dialog>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="" style={{scrollBehavior:'smooth'}}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <FloatingOrb />
      </body>
    </html>
  );
}
