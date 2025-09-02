
'use client';

import Rive from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';

export const RiveOrb = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-24 h-24"></div>;
  }

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
