
'use client';

import Rive from '@rive-app/react-canvas';

export const RiveOrb = () => {
  return (
    <div className="w-24 h-24">
      <Rive
        src="/orb.riv"
        stateMachines="State Machine 1"
        autoPlay={true}
      />
    </div>
  );
};
