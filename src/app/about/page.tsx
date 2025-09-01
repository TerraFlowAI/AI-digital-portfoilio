
'use client';

import { useEffect, useRef } from 'react';
import { HeaderNav } from '@/components/portfolio/header-nav';
import { ContactFooter } from '@/components/portfolio/contact-footer';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Brain,
  Check,
  Code2,
  Cpu,
  Database,
  Download,
  Github,
  Globe,
  Handshake,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Server,
  Sparkles,
  Twitter,
  Workflow,
  LineChart,
  Target,
  Activity,
  Calendar,
  Milestone,
  Terminal,
} from 'lucide-react';
import { Chart } from 'chart.js/auto';
import * as THREE from 'three';

const CausticShader = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer();
    containerRef.current.appendChild(renderer.domElement);

    // Shader material
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      vec4 mod289(vec4 x) { return x - floor(x / 289.0) * 289.0; }
      vec4 permute(vec4 x) { return mod289((x * 34.0 + 1.0) * x); }
      vec4 snoise(vec3 v) {
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          vec3 i  = floor(v + dot(v, vec3(C.y)));
          vec3 x0 = v   - i + dot(i, vec3(C.x));
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.x;
          vec3 x2 = x0 - i2 + C.y;
          vec3 x3 = x0 - 0.5;
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
                                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          vec4 j = p - 49.0 * floor(p / 49.0);
          vec4 x_ = floor(j / 7.0);
          vec4 y_ = floor(j - 7.0 * x_); 
          vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
          vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 g0 = vec3(a0.xy, h.x);
          vec3 g1 = vec3(a0.zw, h.y);
          vec3 g2 = vec3(a1.xy, h.z);
          vec3 g3 = vec3(a1.zw, h.w);
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          vec4 m2 = m * m;
          vec4 m3 = m2 * m;
          vec4 m4 = m2 * m2;
          vec3 grad =
            -6.0 * m3.x * x0 * dot(x0, g0) + m4.x * g0 +
            -6.0 * m3.y * x1 * dot(x1, g1) + m4.y * g1 +
            -6.0 * m3.z * x2 * dot(x2, g2) + m4.z * g2 +
            -6.0 * m3.w * x3 * dot(x3, g3) + m4.w * g3;
          vec4 px = vec4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
          return 42.0 * vec4(grad, dot(m4, px));
      }
      void main() {
          vec2 fragCoord = gl_FragCoord.xy;
          vec2 p = (-iResolution.xy + 2.0*fragCoord) / iResolution.y;
          vec3 ww = normalize(-vec3(0., 1., 1.));
          vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
          vec3 vv = normalize(cross(uu,ww));
          vec3 rd = p.x*uu + p.y*vv + 1.5*ww;
          vec3 pos = -ww + rd*(ww.y/rd.y);
          pos.y = iTime*0.3;
          pos *= 3.;
          vec4 n = snoise( pos );
          pos -= 0.07*n.xyz;
          n = snoise( pos );
          pos -= 0.07*n.xyz;
          n = snoise( pos );
          float intensity = exp(n.w*3. - 1.5);
          vec3 color = vec3(intensity);
          color.b += intensity * 0.3;
          color.g += intensity * 0.1;
          gl_FragColor = vec4(color, 1.);
      }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;

    const animate = () => {
        material.uniforms.iTime.value += 0.003;
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        if (!containerRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;
        renderer.setSize(clientWidth, clientHeight);
        material.uniforms.iResolution.value.set(clientWidth, clientHeight);
    };
    
    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
};


export default function AboutPage() {
  useEffect(() => {
    // Mobile menu toggle
    const btn = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-menu-panel]');
    if (btn && panel) {
      const toggle = () => panel.classList.toggle('hidden');
      btn.addEventListener('click', toggle);
      return () => btn.removeEventListener('click', toggle);
    }
  }, []);

  useEffect(() => {
    // Letter reveal
    const nodes = document.querySelectorAll('[data-letter]');
    nodes.forEach((n, i) => {
      setTimeout(() => {
        const node = n as HTMLElement;
        node.style.transform = 'translateY(0)';
        node.style.opacity = '1';
      }, 120 + i * 120);
    });
  }, []);

  useEffect(() => {
    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }
  }, []);

  useEffect(() => {
    // Chart.js — Evals
    const el = document.getElementById('evalChart') as HTMLCanvasElement;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.05)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
        datasets: [
          {
            label: 'gpt‑4o‑mini',
            data: [64, 68, 71, 74, 78, 82],
            borderColor: '#ffffff',
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointRadius: 2,
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255,255,255,0.7)',
              font: { size: 11 },
            },
            grid: { color: 'rgba(255,255,255,0.06)' },
          },
          y: {
            min: 50,
            max: 90,
            ticks: {
              color: 'rgba(255,255,255,0.7)',
              font: { size: 11 },
              callback: (v) => v + '%',
            },
            grid: { color: 'rgba(255,255,255,0.06)' },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="antialiased selection:bg-white selection:text-neutral-900 text-white/90 bg-neutral-950 font-body">
      <HeaderNav />
      <main>
        <section className="relative h-screen flex items-center">
          <div className="absolute inset-0 w-full h-full">
             <CausticShader />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-white z-10">
                    <h1 className="leading-none text-white tracking-tight">
                        <span className="block text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] font-semibold">
                        <span
                            data-letter
                            style={{
                            display: 'inline-block',
                            transform: 'translateY(20px)',
                            opacity: 0,
                            }}
                            className="tracking-tighter"
                        >
                            Maya
                        </span>
                        <span className="block"></span>
                        <span
                            data-letter
                            style={{
                            display: 'inline-block',
                            transform: 'translateY(20px)',
                            opacity: 0,
                            }}
                            className="tracking-tighter"
                        >
                            Chen
                        </span>
                        </span>
                    </h1>
                    <p className="sm:mt-5 sm:text-3xl leading-relaxed max-w-2xl text-base text-white/70 tracking-tight mt-4">
                        AI Engineer &amp; Frontend — shipping agentic systems, RAG
                        pipelines, and developer UX. I blend product intuition with
                        systems engineering to build fast, reliable LLM apps.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a
                        href="#work"
                        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border border-white/10"
                        >
                        <ArrowRight className="w-4 h-4" />
                        <span>View Work</span>
                        </a>
                        <a
                        href="mailto:hello@mayachen.dev"
                        className="inline-flex items-center justify-center gap-2 hover:bg-white/15 text-sm font-medium text-white tracking-tight bg-white/10 border-white/10 border rounded-full pt-3 pr-5 pb-3 pl-5 shadow-sm backdrop-blur"
                        >
                        <Mail className="w-4 h-4" />
                        <span className="">hello@mayachen.dev</span>
                        </a>
                    </div>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                        <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                        <MapPin className="w-[18px] h-[18px] text-white/50 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium tracking-tight">
                            Based in San Francisco
                            </p>
                            <p className="text-xs text-white/60 mt-0.5">
                            Open to remote work
                            </p>
                        </div>
                        </div>
                        <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                        <Cpu className="w-[18px] h-[18px] text-white/50 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium tracking-tight">
                            AI Systems + Frontend
                            </p>
                            <p className="text-xs text-white/60 mt-0.5">
                            RAG, agents, benchmarks
                            </p>
                        </div>
                        </div>
                        <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                        <Check className="w-[18px] h-[18px] text-white/50 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium tracking-tight">
                            Currently available
                            </p>
                            <p className="text-xs text-white/60 mt-0.5">
                            Starting mid‑September
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-[520px] z-10">
                    <Image
                        src="https://res.cloudinary.com/dvic0tda9/image/upload/v1756748658/Generated_Image_September_01_2025_-_11_12PM_nxycgm_e_improve_e_sharpen_qoepnc.jpg"
                        alt="Maya Chen"
                        width={600}
                        height={800}
                        className="rounded-3xl object-cover object-top w-full h-full"
                    />
                </div>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="max-w-7xl sm:px-6 sm:mt-20 border-white/10 border-t mt-16 mr-auto ml-auto pt-10 pr-4 pl-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl tracking-tight">
              Recent Work
            </h2>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm tracking-tight text-white/70 hover:text-white"
            >
              <span className="">View all</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            <article className="group break-inside-avoid mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[16/9]">
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/f16eab49-7c29-4933-aca8-f41b2c337f6f_800w.jpg"
                  alt="RAG dashboard"
                  width={800}
                  height={450}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  data-ai-hint="dashboard screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Bot className="w-4 h-4" />
                  <span className="">RAG Platform</span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">
                  Vector‑backed Retrieval
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Hybrid search, chunking, schema‑aware re‑ranking,
                  observability.
                </p>
              </div>
            </article>
            <article className="group break-inside-avoid mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/41f44e91-a4d8-4042-8253-0c6a79be833b_800w.jpg"
                  alt="Agentic workflow"
                   width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                   data-ai-hint="workflow diagram"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Workflow className="w-4 h-4" />
                  <span>Agents</span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">
                  Agent Orchestrator
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Multi‑tool planning, retries, guardrails, tracing via
                  OpenTelemetry.
                </p>
              </div>
            </article>
            <article className="group break-inside-avoid mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/7fc6a2de-15db-4034-8a23-06b7a43997f6_800w.jpg"
                  alt="Code copilot"
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  data-ai-hint="code editor"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Code2 className="w-4 h-4" />
                  <span className="">Developer UX</span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">
                  Code Copilot
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Inline suggestions, context windows, evals, and latency
                  budgets.
                </p>
              </div>
            </article>
            <article className="group break-inside-avoid mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[16/9]">
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a2cd53da-e321-41c2-9467-565b1a1b0b52_800w.jpg"
                  alt="Data pipeline"
                   width={800}
                  height={450}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                   data-ai-hint="data pipeline"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Database className="w-4 h-4" />
                  <span>Data Pipeline</span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">
                  Real‑time Analytics
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Streaming data processing with Apache Kafka and real‑time
                  dashboards.
                </p>
              </div>
            </article>
            <article className="group break-inside-avoid mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[16/9]">
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/f826149d-7e8d-4b68-a4fd-cc16fb762142_800w.jpg"
                  alt="ML model"
                   width={800}
                  height={450}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                   data-ai-hint="abstract neural"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Brain className="w-4 h-4" />
                  <span className="">Machine Learning</span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">
                  Custom Model Training
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Fine‑tuned transformers for domain‑specific tasks with
                  custom datasets.
                </p>
              </div>
            </article>
            <article className="group break-inside-avoid mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/36460156-d7ce-43aa-89af-e013fb87ccfc_800w.jpg"
                  alt="API system"
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  data-ai-hint="server racks"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Server className="w-4 h-4" />
                  <span>API Architecture</span>
                </div>
                <h3 className="mt-2 text-base font-semibold tracking-tight">
                  Scalable Backend
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Microservices architecture with GraphQL, Redis caching, and
                  auto‑scaling.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="max-w-7xl sm:px-6 sm:mt-16 mt-12 mr-auto ml-auto pr-4 pl-4">
          <div className="relative overflow-hidden sm:p-8 text-white text-center bg-neutral-950 border-white/10 border rounded-3xl pt-6 pr-6 pb-6 pl-6">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(255,255,255,0.06),transparent_60%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_120%,rgba(255,255,255,0.05),transparent_60%)]"></div>
              <div
                className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.12]"
              ></div>
            </div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl tracking-tight">
                Trusted by product teams
              </h2>
              <p className="text-white/70 mt-2">
                From seed‑stage startups to enterprise platform groups.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4 mt-8 mb-8 items-center">
                <div className="flex gap-3 hover:text-white transition-colors duration-300 text-zinc-400 items-center justify-center">
                  <span className="text-lg font-normal tracking-tighter">
                    TechFlow
                  </span>
                </div>
                <div className="flex gap-3 hover:text-white transition-colors duration-300 text-zinc-400 items-center justify-center">
                  <span className="text-lg font-bold tracking-tighter font-bricolage">
                    Nexus Labs
                  </span>
                </div>
                <div className="flex gap-3 hover:text-white transition-colors duration-300 text-zinc-400 items-center justify-center">
                  <span className="text-lg font-semibold tracking-tighter font-merriweather">
                    DataSync
                  </span>
                </div>
                <div className="flex gap-3 hover:text-white transition-colors duration-300 text-zinc-400 items-center justify-center">
                  <span className="text-lg font-normal tracking-tighter font-instrument-serif">
                    VisionCorp
                  </span>
                </div>
                <div className="flex gap-3 hover:text-white transition-colors duration-300 text-zinc-400 items-center justify-center">
                  <span className="text-lg font-semibold tracking-tighter font-playfair">
                    CloudBase
                  </span>
                </div>
                <div className="flex gap-3 hover:text-white transition-colors duration-300 text-zinc-400 items-center justify-center">
                  <span className="text-lg font-normal tracking-tighter">
                    InnovateTech
                  </span>
                </div>
                <div className="flex gap-3 hover:text-white transition-colors duration-300 text-zinc-400 items-center justify-center">
                  <span className="text-lg font-bold tracking-tighter">
                    FlowState
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="stack"
          className="max-w-7xl sm:px-6 sm:mt-20 border-t border-white/10 mt-16 mx-auto pt-10 px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/5 border-white/10 border rounded-2xl pt-4 pr-4 pb-4 pl-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/80" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Tech Stack
                </h3>
              </div>
              <div className="mt-3 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2">
                    Frontend &amp; UI
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      TypeScript
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      Next.js 14
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      React 18
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      Tailwind CSS
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      Framer Motion
                    </span>
                  </div>
                </div>
                <div className="">
                  <h4 className="text-sm font-medium text-white/80 mb-2">
                    AI &amp; Backend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      Python 3.11+
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      FastAPI
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      LangChain
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      OpenAI API
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      Claude API
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      vLLM
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-white/10 border border-white/10">
                      Ollama
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-white/70 leading-relaxed">
                  <span className="font-medium text-white/80">
                    Focus areas:
                  </span>{' '}
                  RAG optimization, agentic workflows, prompt engineering,
                  model evaluation, and production-ready AI systems with
                  sub-second latency.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-white/80" />
                  <h3 className="text-xl font-semibold tracking-tight">
                    RAG Pipeline
                  </h3>
                </div>
                <span className="text-[11px] text-white/60">~42 lines</span>
              </div>
              <pre
                className="text-[12px] leading-relaxed overflow-auto text-white/90 bg-black/40 border-white/10 border rounded-xl mt-3 pt-3 pr-3 pb-3 pl-3"
                style={{
                  fontFamily:
                    "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
                }}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: `<span style="color: #ff7b72;">from</span> <span style="color: #79c0ff;">fastapi</span> <span style="color: #ff7b72;" class="">import</span> <span style="color: #79c0ff;">FastAPI</span>
<span style="color: #ff7b72;">from</span> <span style="color: #79c0ff;" class="">rag</span> <span style="color: #ff7b72;">import</span> <span style="color: #79c0ff;">embed</span>, <span style="color: #79c0ff;" class="">search</span>, <span style="color: #79c0ff;">rerank</span>, <span style="color: #79c0ff;">answer</span>
<span style="color: #ff7b72;">from</span> <span style="color: #79c_of_vfs;">tracers</span> <span style="color: #ff7b72;" class="">import</span> <span style="color: #79c_of_vfs;" class="">trace</span>

<span style="color: #ffa657;">app</span> = <span style="color: #79c_of_vfs;">FastAPI</span>()

<span style="color: #a5a5a5;">@</span><span style="color: #ffa657;" class="">app</span>.<span style="color: #d2a8ff;" class="">post</span>(<span style="color: #a5d6ff;" class="">"/ask"</span>)
<span style="color: #a5a5a5;">@</span><span style="color: #d2a8ff;">trace</span>(<span style="color: #a5d6ff;">"ask"</span>)
<span style="color: #ff7b72;">def</span> <span style="color: #d2a8ff;">ask</span>(<span style="color: #ffa657;">q</span>: <span style="color: #ff7b72;">str</span>, <span style="color: #ffa657;">user_id</span>: <span style="color: #ff7b72;">str</span>):
    <span style="color: #ffa657;" class="">q_vec</span> = <span style="color: #d2a8ff;" class="">embed</span>(<span style="color: #ffa657;" class="">q</span>)
    <span style="color: #ffa657;">chunks</span> = <span style="color: #d2a8ff;" class="">search</span>(<span style="color: #ffa657;" class="">q_vec</span>, <span style="color: #ffa657;">k</span>=<span style="color: #a5d6ff;" class="">20</span>, <span style="color: #ffa657;" class="">filters</span>={<span style="color: #a5d6ff;" class="">"user"</span>: <span style="color: #ffa657;">user_id</span>})
    <span style="color: #ffa657;" class="">ranked</span> = <span style="color: #d2a8ff;" class="">rerank</span>(<span style="color: #ffa657;" class="">q</span>, <span style="color: #ffa657;" class="">chunks</span>)[:<span style="color: #a5d6ff;">6</span>]
    <span style="color: #ff7b72;">return</span> <span style="color: #d2a8ff;">answer</span>(<span style="color: #ffa657;">q</span>, <span style="color: #ffa657;">ranked</span>, <span style="color: #ffa657;" class="">tools</span>=[<span style="color: #a5d6ff;" class="">"browser"</span>, <span style="color: #a5d6ff;" class="">"code"</span>], <span style="color: #ffa657;">guardrails</span>=<span style="color: #ff7b72;">True</span>)`,
                  }}
                />
              </pre>
            </div>
            <div className="bg-white/5 border-white/10 border rounded-2xl pt-4 pr-4 pb-4 pl-4">
              <div className="flex items-center gap-2">
                <Milestone className="w-4 h-4 text-white/80" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Timeline
                </h3>
              </div>
              <ol className="mt-3">
                <li className="relative pl-6 pb-4 border-l border-white/10">
                  <span className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-white"></span>
                  <p className="text-xs text-white/60">2025</p>
                  <p className="text-sm font-medium tracking-tight">
                    Independent — AI Engineer
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Building production AI systems, RAG pipelines, and
                    agentic workflows for startups and enterprise teams.
                  </p>
                </li>
                <li className="relative pl-6 pb-4 border-l border-white/10">
                  <span className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-white/80"></span>
                  <p className="text-xs text-white/60">2022 — 2024</p>
                  <p className="text-sm font-medium tracking-tight">
                    Senior Product Designer — Analytics
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Led design for data visualization platform, shipped
                    ML-powered insights dashboard used by 10k+ analysts.
                  </p>
                </li>
                <li className="relative pl-6 border-l border-white/10">
                  <span className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-white/60"></span>
                  <p className="text-xs text-white/60">2017 — 2021</p>
                  <p className="text-sm font-medium tracking-tight">
                    Frontend Engineer — Commerce
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Built responsive e-commerce platform with React/Node.js,
                    optimized for mobile conversion and performance.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </section>
        <section
          id="evals"
          className="max-w-7xl sm:px-6 sm:mt-20 border-t border-white/10 mt-16 mx-auto pt-10 px-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl tracking-tight">Model Evals</h2>
              <p className="text-white/70 mt-2">
                Continuous evaluation of prompts, tools, and retrieval
                quality across production workloads.
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-white/80" />
                    <h3 className="text-base font-semibold tracking-tight">
                      Pass@1 by model (weekly)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-xs text-white/60">Live data</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-48">
                    <canvas id="evalChart"></canvas>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                    <div className="text-white/60">Current best</div>
                    <div className="text-lg font-semibold tracking-tight">
                      82%
                    </div>
                    <div className="text-xs text-green-400 mt-1">
                      +4% this week
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                    <div className="text-white/60">Context win</div>
                    <div className="text-lg font-semibold tracking-tight">
                      +10% RAG
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      vs baseline
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                    <div className="text-white/60">Latency p95</div>
                    <div className="text-lg font-semibold tracking-tight">
                      780ms
                    </div>
                    <div className="text-xs text-yellow-400 mt-1">
                      Within SLA
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-white/70" />
                    <h4 className="text-sm font-medium tracking-tight">
                      Eval Categories
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">
                        Code generation
                      </span>
                      <span className="text-xs font-medium">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">
                        Q&amp;A retrieval
                      </span>
                      <span className="text-xs font-medium">82%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">
                        Tool usage
                      </span>
                      <span className="text-xs font-medium">76%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">Reasoning</span>
                      <span className="text-xs font-medium">73%</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-white/70" />
                    <h4 className="text-sm font-medium tracking-tight">
                      Recent Tests
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/90">
                          GPT-4o prompt optimization
                        </div>
                        <div className="text-[10px] text-white/60">
                          2 hours ago
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/90">
                          Claude-3.5 tool calling
                        </div>
                        <div className="text-[10px] text-white/60">
                          6 hours ago
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/90">
                          RAG chunk size A/B test
                        </div>
                        <div className="text-[10px] text-white/60">
                          12 hours ago
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chart-candlestick lucide-beaker w-[16px] h-[16px]"
                      style={{
                        width: '16px',
                        height: '16px',
                        color: 'rgb(255, 255, 255)',
                      }}
                    >
                      <path d="M9 5v4"></path>
                      <rect width="4" height="6" x="7" y="9" rx="1"></rect>
                      <path d="M9 15v2"></path>
                      <path d="M17 3v2"></path>
                      <rect width="4" height="8" x="15" y="5" rx="1"></rect>
                      <path d="M17 13v3"></path>
                      <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                    </svg>
                    <h4 className="text-sm font-medium tracking-tight">
                      Evaluation Framework
                    </h4>
                  </div>
                  <span className="text-xs text-white/60">
                    1,247 total tests
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Automated testing pipeline with custom metrics, human
                  feedback loops, and A/B testing. Tracks accuracy,
                  hallucination rates, tool usage effectiveness, and user
                  satisfaction scores across different model versions and
                  prompt templates.
                </p>
              </div>
            </div>
            <div id="about" className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/e636d5f8-9fec-44fe-b4dd-4ccb5a90c3da_1600w.jpg"
                    alt="Workspace"
                    fill
                    className="object-cover"
                    data-ai-hint="workspace desk"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold tracking-tight">
                    About
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    I build AI products end‑to‑end: data ingestion,
                    retrieval, prompt/tooling, evals, and production UI.
                    Pragmatic about latency, cost, and safety — with strong
                    attention to developer experience.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl tracking-tight">8+</div>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Years
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl tracking-tight">120+</div>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Projects
                      </p>
                    </div>
                    <div className="">
                      <div className="text-2xl tracking-tight">50+</div>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Clients
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 p-4 bg-black/30 rounded-xl border border-white/10">
                    <h4 className="text-sm font-medium tracking-tight text-white mb-2">
                      Currently learning
                    </h4>
                    <p className="text-sm text-white/70">
                      Structured outputs, memory architectures, and
                      low‑latency tool use with vLLM + GPU batching.
                    </p>
                  </div>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border border-white/10"
                  >
                    <Handshake className="w-4 h-4" />
                    <span className="">Let’s collaborate</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ContactFooter />
      </main>
    </div>
  );
}
