
'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export const RiveOrb = () => {
  const { RiveComponent } = useRive({
    src: 'https://public.rive.app/community/runtime-files/2156-4299-orb.riv',
    stateMachines: 'State Machine 1',
    layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return (
    <div className="w-24 h-24">
        <RiveComponent />
    </div>
  );
};
