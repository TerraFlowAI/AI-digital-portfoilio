
'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import createGlobe from 'cobe';

function Globe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let phi = 0;
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.5, 0.5],
      glowColor: [0.5, 0.5, 0.5],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full max-w-lg mx-auto aspect-square">
        <canvas
            ref={canvasRef}
            className="w-full h-full"
        />
    </div>
  );
}

export function ContactSection() {
    return (
        <section id="contact" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="bg-neutral-900/70 border border-white/10 rounded-3xl p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">Let's Connect</h2>
                        <p className="mt-4 text-lg text-white/70">
                            Have a project in mind, a question, or just want to say hello? I'd love to hear from you. Fill out the form, and I'll get back to you as soon as possible.
                        </p>
                        <div className="mt-8">
                           <Globe />
                        </div>
                    </div>
                    <div className="bg-neutral-950/50 p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-semibold text-white">Send me a message</h3>
                        <form className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium text-white/80">Full Name</label>
                                <Input type="text" id="name" name="name" className="mt-2 bg-neutral-900/80 border-white/10 text-white" placeholder="Shamanth" />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-white/80">Email Address</label>
                                <Input type="email" id="email" name="email" className="mt-2 bg-neutral-900/80 border-white/10 text-white" placeholder="hello@shamanth.dev" />
                            </div>
                            <div>
                                <label htmlFor="message" className="text-sm font-medium text-white/80">Message</label>
                                <Textarea id="message" name="message" rows={4} className="mt-2 bg-neutral-900/80 border-white/10 text-white" placeholder="Your message..."></Textarea>
                            </div>
                            <Button type="submit" className="w-full bg-white text-neutral-900 hover:bg-white/90">
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
