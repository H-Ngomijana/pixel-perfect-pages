import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Bot,
  Box,
  Braces,
  Check,
  Code2,
  Figma,
  GitBranch,
  Menu,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JH Digitals — Digital Products That Drive Growth" },
      { name: "description", content: "JH Digitals designs and engineers high-performance software, AI products, and digital experiences for ambitious businesses." },
      { property: "og:title", content: "JH Digitals — Digital Products That Drive Growth" },
      { property: "og:description", content: "A B2B software and digital product studio engineering products built to scale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const nav = [
  ["Work", "#work"], ["About", "#about"], ["Services", "#services"], ["Pricing", "#pricing"],
] as const;

const terminalData = {
  Architecture: [
    ["frontend", '"React 19 + TanStack"'], ["styling", '"Tailwind CSS v4"'], ["api", '"Edge-native services"'], ["security", '"Encrypted by default"'],
  ],
  "Web Vitals": [
    ["performance", "99.8"], ["largestPaint", '"< 1.2s"'], ["interaction", '"< 100ms"'], ["layoutShift", '"0.01"'],
  ],
  "Growth Engine": [
    ["analytics", '"Live signals"'], ["experiments", '"Always learning"'], ["automation", '"AI-assisted"'], ["conversion", '"Compounding"'],
  ],
};

const stacks = [
  { name: "React", label: "Frontend", icon: Braces },
  { name: "TypeScript", label: "Language", icon: Code2 },
  { name: "AI Systems", label: "Intelligence", icon: Bot },
  { name: "Figma", label: "Product Design", icon: Figma },
  { name: "Cloud", label: "Infrastructure", icon: Box },
  { name: "Git", label: "Version Control", icon: GitBranch },
];

const projects = [
  { number: "01", title: "Atlas Commerce", type: "Commerce platform", copy: "A modular buying experience that turns complex catalogs into a fast, decisive customer journey.", tags: ["React", "AI Search", "Cloud"] },
  { number: "02", title: "Signal OS", type: "Operations platform", copy: "A real-time command center giving teams one sharp view of customers, revenue, and delivery.", tags: ["Product", "Data", "Automation"] },
  { number: "03", title: "Northstar AI", type: "Intelligence product", copy: "An AI workspace designed to turn fragmented business knowledge into confident action.", tags: ["AI", "UX", "Engineering"] },
];

function Brand({ inverted = false }: { inverted?: boolean }) {
  return <a href="#top" className="group flex items-center gap-3" aria-label="JH Digitals home"><span className={`grid size-9 place-items-center border-2 font-mono text-xs font-bold transition-colors ${inverted ? "border-primary-foreground text-primary-foreground group-hover:border-accent group-hover:text-accent" : "border-foreground text-foreground group-hover:border-accent group-hover:text-accent"}`}>JH</span><span className={`font-display text-2xl uppercase ${inverted ? "text-primary-foreground" : "text-foreground"}`}>Digitals</span></a>;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function StatusBadge({ dark = false }: { dark?: boolean }) {
  return <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 font-mono text-[10px] font-semibold uppercase md:text-xs ${dark ? "border-primary-foreground/15 bg-primary/80 text-primary-foreground" : "border-foreground/15 bg-background/80 text-foreground"}`}><span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-success" /></span>Accepting new projects <span className="text-accent">Q3 & Q4</span></div>;
}

function useHeaderVisibility() {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    last.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 140);
        last.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

function Header({ hidden }: { hidden: boolean }) {
  const [open, setOpen] = useState(false);
  return <>
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10"><Brand /><nav className="hidden items-center gap-9 md:flex">{nav.map(([label, href]) => <a key={label} href={href} className="font-mono text-xs font-semibold uppercase transition-colors hover:text-accent">{label}</a>)}</nav><a href="mailto:hello@jhdigitals.com" className="hidden font-display text-2xl italic transition-colors hover:text-accent md:block">Connect ↗</a><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button></div>
    </header>
    <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[70] flex flex-col bg-background p-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu"><X /></Button></div><nav className="my-auto flex flex-col gap-5">{nav.map(([label, href], i) => <motion.a key={label} href={href} onClick={() => setOpen(false)} className="border-b border-foreground/20 pb-3 font-display text-6xl uppercase" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }}>{label}</motion.a>)}</nav><a href="mailto:hello@jhdigitals.com" className="font-mono text-sm uppercase text-accent">hello@jhdigitals.com ↗</a></motion.div>}</AnimatePresence>
  </>;
}

function Terminal() {
  const [active, setActive] = useState<keyof typeof terminalData>("Architecture");
  return <motion.div className="relative w-full max-w-xl rounded-[2rem] border border-primary-foreground/10 bg-panel p-4 text-card-foreground shadow-2xl md:p-7" initial={{ opacity: 0, scale: .96, y: 25 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .8, delay: .25 }}>
    <div className="absolute -right-2 -top-5 rounded-full border border-primary-foreground/10 bg-primary px-4 py-2 font-mono text-[10px] font-semibold text-primary-foreground shadow-xl md:right-4"><span className="mr-2 inline-block size-2 rounded-full bg-success" />Full-Stack & AI Engineering</div>
    <div className="mb-6 flex items-center justify-between"><div className="flex gap-2"><span className="size-3 rounded-full bg-destructive" /><span className="size-3 rounded-full bg-chart-4" /><span className="size-3 rounded-full bg-success" /></div><span className="font-mono text-[10px] text-muted-foreground">jh-engine.v3.build</span></div>
    <div className="grid grid-cols-3 rounded-xl border border-primary-foreground/10 bg-primary p-1">{Object.keys(terminalData).map((tab) => <button key={tab} onClick={() => setActive(tab as keyof typeof terminalData)} className={`rounded-lg px-1 py-3 text-[10px] transition-colors md:text-xs ${active === tab ? "bg-primary-foreground/10 text-primary-foreground" : "text-muted-foreground hover:text-primary-foreground"}`}>{tab}</button>)}</div>
    <div className="mt-5 min-h-72 rounded-xl border border-primary-foreground/10 bg-primary p-5 font-mono text-xs leading-8 md:text-sm"><div className="mb-3 flex justify-between border-b border-primary-foreground/10 pb-3 text-[10px] text-muted-foreground"><span>SYSTEM_STACK.config.ts</span><span className="text-success">READY</span></div><div><span className="text-chart-1">export const</span> <span className="text-chart-4">jhEngine</span> = {"{"}</div><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>{terminalData[active].map(([key, value]) => <div key={key} className="pl-5"><span className="text-chart-5">{key}</span>: <span className="text-success">{value}</span>,</div>)}</motion.div></AnimatePresence><div>{"}"};<span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-accent align-middle" /></div><div className="mt-4 text-[10px] text-success">✓ compiled successfully in 86ms</div></div>
  </motion.div>;
}

function Hero() {
  return <section id="top" className="industrial-grid relative min-h-[920px] overflow-hidden rounded-b-[3rem] bg-background pt-32 md:min-h-[900px] md:rounded-b-[5rem] md:pt-40"><div className="absolute inset-0 bg-background/90" /><div className="relative mx-auto grid max-w-[1500px] items-center gap-16 px-5 pb-36 md:px-10 lg:grid-cols-[1.12fr_.88fr]">
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}><StatusBadge /><h1 className="mt-8 max-w-4xl text-balance font-display text-[clamp(4rem,8vw,8rem)] uppercase leading-[.91]">We Build Digital Products That <span className="inline-block -rotate-1 rounded-xl bg-primary px-4 pb-2 text-primary-foreground shadow-xl">Drive Growth.</span></h1><p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">JH Digitals is a software and digital product studio. We engineer high-performance experiences that elevate brands and scale businesses.</p><div className="mt-9 flex flex-wrap items-center gap-6"><Button asChild size="lg"><a href="#work">View our work <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></a></Button><a href="#pricing" className="font-mono text-sm font-semibold uppercase underline-offset-8 hover:text-accent hover:underline">See pricing →</a></div></motion.div><Terminal />
  </div><div className="absolute inset-x-0 bottom-0 border-t border-foreground/10 bg-background/95"><div className="mx-auto grid max-w-[1500px] grid-cols-3 px-5 py-8 md:px-10 md:py-10">{[["130+", "Products built"], ["99.8%", "Satisfaction"], ["<100ms", "Response speed"]].map(([value,label]) => <div key={label}><div className="font-display text-3xl uppercase md:text-5xl">{value}</div><div className="mt-1 font-mono text-[8px] uppercase text-muted-foreground md:text-xs">{label}</div></div>)}</div></div></section>;
}

function TechStack() {
  return <section id="about" className="dark-grid grain relative overflow-hidden bg-primary py-28 text-primary-foreground md:py-40"><div className="relative mx-auto max-w-[1300px] px-5 md:px-10"><div className="text-center"><StatusBadge dark /><p className="mt-10 font-mono text-xs font-semibold uppercase text-accent">Our tech stack</p><Reveal><h2 className="mx-auto mt-5 max-w-4xl text-balance font-display text-5xl uppercase leading-none md:text-8xl">Engineered With Next-Gen Tools.</h2></Reveal></div><div className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{stacks.map(({ name,label,icon: Icon },i) => <Reveal key={name} delay={i*.06}><div className="group flex min-h-48 flex-col items-center justify-center rounded-lg border border-primary-foreground/10 bg-panel/80 p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-accent"><Icon className="mb-5 size-10 transition-colors group-hover:text-accent" /><h3 className="font-display text-xl uppercase">{name}</h3><p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{label}</p></div></Reveal>)}</div></div></section>;
}

function Work() {
  return <section id="work" className="bg-background py-28 md:py-40"><div className="mx-auto max-w-[1400px] px-5 md:px-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><Reveal><p className="font-mono text-xs font-semibold uppercase text-accent">Selected work / 2024—26</p><h2 className="mt-4 max-w-3xl font-display text-6xl uppercase leading-none md:text-8xl">Built For Bold Brands.</h2></Reveal><p className="max-w-md text-muted-foreground">Products with a clear point of view, built to perform under real business pressure.</p></div><div className="mt-20 divide-y divide-foreground/20 border-y border-foreground/20">{projects.map((p,i) => <Reveal key={p.title} delay={i*.05}><article className="group grid gap-7 py-10 transition-all md:grid-cols-[80px_1fr_1fr_auto] md:items-center"><span className="font-mono text-xs text-muted-foreground">/{p.number}</span><div><p className="mb-2 font-mono text-[10px] uppercase text-accent">{p.type}</p><h3 className="font-display text-4xl uppercase transition-transform duration-300 group-hover:translate-x-2 md:text-6xl">{p.title}</h3></div><p className="max-w-md text-sm leading-6 text-muted-foreground">{p.copy}</p><div className="flex items-center gap-3"><div className="hidden flex-wrap gap-2 lg:flex">{p.tags.map(t=><span key={t} className="rounded-full border border-foreground/20 px-3 py-1 font-mono text-[9px] uppercase">{t}</span>)}</div><span className="grid size-12 place-items-center rounded-full border border-foreground/20 transition-colors group-hover:bg-accent"><ArrowRight className="size-4" /></span></div></article></Reveal>)}</div></div></section>;
}

function Services() {
  const data = [{n:"01", title:"Product Design", text:"Research, strategy, interaction design, and visual systems shaped around the people who use them.", tags:["Discovery","UX/UI","Design systems"]},{n:"02",title:"Engineering",text:"Fast, resilient digital products built with modern systems and uncompromising technical craft.",tags:["Web apps","Platforms","Cloud"]},{n:"03",title:"AI & Growth",text:"Intelligent automation and growth systems that create measurable leverage across your business.",tags:["AI products","Automation","Optimisation"]}];
  return <section id="services" className="bg-primary py-28 text-primary-foreground md:py-40"><div className="mx-auto max-w-[1400px] px-5 md:px-10"><Reveal><div className="flex items-end justify-between"><div><p className="font-mono text-xs uppercase text-accent">What we do</p><h2 className="mt-4 font-display text-6xl uppercase md:text-8xl">Full-Cycle Studio.</h2></div><Zap className="hidden size-16 text-accent md:block" /></div></Reveal><div className="mt-16 grid gap-4 lg:grid-cols-3">{data.map((s,i)=><Reveal key={s.n} delay={i*.08}><article className="group min-h-[420px] rounded-lg border border-primary-foreground/15 bg-panel p-8 transition-colors hover:border-accent md:p-10"><div className="flex justify-between font-mono text-xs text-muted-foreground"><span>/{s.n}</span><ArrowRight className="size-4 -rotate-45 transition-transform group-hover:rotate-0 group-hover:text-accent" /></div><h3 className="mt-20 font-display text-5xl uppercase">{s.title}</h3><p className="mt-5 leading-7 text-muted-foreground">{s.text}</p><div className="mt-10 flex flex-wrap gap-2">{s.tags.map(t=><span key={t} className="rounded-full border border-primary-foreground/15 px-3 py-1.5 font-mono text-[9px] uppercase">{t}</span>)}</div></article></Reveal>)}</div></div></section>;
}

function Pricing() {
  const plans = [{name:"Launch",price:"$4.8k",time:"2–4 weeks",features:["Focused product strategy","High-fidelity design","Production-ready build"]},{name:"Scale",price:"$9.5k",time:"5–8 weeks",popular:true,features:["End-to-end product team","Advanced integrations","Analytics and optimisation"]},{name:"Partner",price:"Custom",time:"Ongoing",features:["Dedicated monthly capacity","Priority delivery","Continuous product growth"]}];
  return <section id="pricing" className="bg-background py-28 md:py-40"><div className="mx-auto max-w-[1400px] px-5 md:px-10"><Reveal><p className="font-mono text-xs uppercase text-accent">Simple engagement models</p><h2 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none md:text-8xl">Choose Your Build Mode.</h2></Reveal><div className="mt-16 grid gap-4 lg:grid-cols-3">{plans.map((p,i)=><Reveal key={p.name} delay={i*.08}><article className={`relative flex min-h-[480px] flex-col rounded-lg border p-8 md:p-10 ${p.popular?"border-accent bg-primary text-primary-foreground":"border-foreground/20 bg-background"}`}>{p.popular&&<span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 font-mono text-[9px] uppercase text-accent-foreground">Most popular</span>}<p className="font-mono text-xs uppercase text-muted-foreground">{p.name}</p><div className="mt-16 font-display text-6xl uppercase">{p.price}</div><p className="mt-2 font-mono text-[10px] uppercase text-muted-foreground">Typical delivery / {p.time}</p><ul className="mt-10 space-y-4">{p.features.map(f=><li key={f} className="flex items-center gap-3 text-sm"><Check className="size-4 text-accent" />{f}</li>)}</ul><Button asChild variant={p.popular?"dock":"outline"} className="mt-auto"><a href="mailto:hello@jhdigitals.com?subject=Start a project">Start a project <ArrowRight className="size-4" /></a></Button></article></Reveal>)}</div></div></section>;
}

function Footer() {
  return <footer className="dark-grid bg-primary pb-36 pt-28 text-primary-foreground md:pt-40"><div className="mx-auto max-w-[1400px] px-5 md:px-10"><Reveal><p className="font-mono text-xs uppercase text-accent">Have a project in mind?</p><div className="mt-7 flex flex-col justify-between gap-10 border-b border-primary-foreground/15 pb-20 lg:flex-row lg:items-end"><h2 className="max-w-5xl font-display text-[clamp(4.5rem,11vw,10rem)] uppercase leading-[.82]">Let's Build Something.</h2><Button asChild variant="dock" size="lg"><a href="mailto:hello@jhdigitals.com">Start a conversation <ArrowRight className="size-4" /></a></Button></div></Reveal><div className="grid gap-10 pt-12 md:grid-cols-3"><Brand inverted /><div className="flex flex-wrap gap-6 font-mono text-[10px] uppercase text-muted-foreground">{nav.map(([l,h])=><a key={l} href={h} className="hover:text-accent">{l}</a>)}</div><div className="md:text-right"><a href="mailto:hello@jhdigitals.com" className="text-sm hover:text-accent">hello@jhdigitals.com</a><p className="mt-4 font-mono text-[9px] uppercase text-muted-foreground"><span className="mr-2 inline-block size-2 rounded-full bg-success" />Systems online · Kigali / Worldwide</p></div></div></div></footer>;
}

function Dock({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();
  return <AnimatePresence>{visible && <motion.div
    className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:bottom-6"
    initial={reduce ? false : { opacity: 0, y: 24, scale: .96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={reduce ? undefined : { opacity: 0, y: 24, scale: .96 }}
    transition={{ duration: .4, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="flex items-center gap-1.5 rounded-full border border-primary-foreground/10 bg-primary/95 p-1.5 pl-2.5 text-primary-foreground shadow-2xl backdrop-blur-xl sm:gap-2 sm:pl-3">
      <a href="#top" className="group flex shrink-0 items-center gap-2" aria-label="JH Digitals home">
        <span className="grid size-7 place-items-center border border-primary-foreground/50 font-mono text-[9px] font-bold leading-none transition-colors group-hover:border-accent group-hover:text-accent">JH</span>
        <span className="hidden font-display text-base uppercase leading-none tracking-wide sm:block">Digitals</span>
      </a>
      <span className="mx-0.5 hidden h-5 w-px bg-primary-foreground/15 sm:block" />
      <nav className="hidden items-center sm:flex">{nav.map(([l,h])=><a key={l} href={h} className="rounded-full px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase leading-none tracking-wide text-muted-foreground transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground">{l}</a>)}</nav>
      <Button asChild variant="dock" className="h-8 shrink-0 rounded-full px-4 font-mono text-[10px] font-semibold uppercase tracking-wide"><a href="mailto:hello@jhdigitals.com">Connect</a></Button>
      <a href="#top" aria-label="Back to top" className="grid size-8 shrink-0 place-items-center rounded-full border border-primary-foreground/15 text-muted-foreground transition-colors hover:border-accent hover:text-accent"><Plus className="size-3.5" /></a>
    </div>
  </motion.div>}</AnimatePresence>;
}

function TrustBand() {
  return <div className="relative z-10 mx-auto -mt-12 flex max-w-4xl items-center gap-4 rounded-2xl border border-primary-foreground/10 bg-panel px-5 py-5 text-primary-foreground shadow-2xl md:px-8"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-success-soft text-success"><ShieldCheck /></span><div><p className="text-sm font-semibold">99.99% Uptime Guarantee</p><p className="mt-1 text-xs text-muted-foreground">Enterprise SLA & real-time monitoring</p></div><span className="ml-auto hidden rounded-full bg-success-soft px-4 py-1.5 font-mono text-[9px] uppercase text-success sm:block">● Active</span></div>;
}

function HomePage() {
  const headerHidden = useHeaderVisibility();
  return <main><Header hidden={headerHidden} /><Hero /><TrustBand /><TechStack /><Work /><Services /><Pricing /><Footer /><Dock visible={headerHidden} /></main>;
}