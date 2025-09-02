
'use client';

import Rive from '@rive-app/react-canvas';

export const RiveOrb = () => {
  return (
    <div className="w-24 h-24">
      <Rive
        src="https://public.rive.app/community/runtime-files/2156-4299-orb.riv"
        stateMachines="State Machine 1"
        autoplay
      />
    </div>
  );
};
