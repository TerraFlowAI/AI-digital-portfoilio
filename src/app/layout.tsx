
'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { Mic } from 'lucide-react';
import Link from 'next/link';
import { VoiceCloneDialog } from '@/components/portfolio/voice-clone-dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const FloatingOrb = ({ onClick }: { onClick: () => void }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative group">
             <EtherealShadow 
              color="hsl(var(--primary))"
              animation={{
                scale: 50,
                speed: 50,
              }}
              noise={{
                opacity: 0.1,
                scale: 1,
              }}
              className="w-20 h-20 rounded-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </EtherealShadow>
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-neutral-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Talk to My Clone
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 rotate-45"></div>
            </div>
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
  const [isVoiceCloneOpen, setIsVoiceCloneOpen] = useState(false);
  
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
        <FloatingOrb onClick={() => setIsVoiceCloneOpen(true)} />
      </body>
    </html>
  );
}
