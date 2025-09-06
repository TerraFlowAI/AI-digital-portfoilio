
'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { VoiceCloneDialog } from '@/components/portfolio/voice-clone-dialog';
import { RiveOrb } from '@/components/portfolio/rive-orb';

export const FloatingOrb = () => {
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
