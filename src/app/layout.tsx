
'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { VoiceCloneDialog } from '@/components/portfolio/voice-clone-dialog';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { RiveOrb } from '@/components/portfolio/rive-orb';
import dynamic from 'next/dynamic';

const FloatingOrb = dynamic(
  () => import('@/components/shared/floating-orb').then(mod => mod.FloatingOrb),
  { ssr: false }
);


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
