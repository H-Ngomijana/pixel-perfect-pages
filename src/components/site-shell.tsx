import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Studio", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <div className="min-h-screen bg-primary text-primary-foreground">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-primary-foreground/10 bg-primary/90 backdrop-blur-xl">
      <div className="mx-auto grid h-18 max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:flex md:px-10">
        <Link to="/" className="flex min-w-0 items-center gap-3 md:mr-auto"><span className="grid size-8 shrink-0 place-items-center border border-accent font-mono text-[10px] font-bold text-accent">JH</span><span className="truncate font-display text-base font-bold uppercase">Digitals</span></Link>
        <nav className="hidden items-center gap-7 md:flex">{links.map((item) => <Link key={item.to} to={item.to} className={`font-mono text-[10px] font-semibold uppercase transition-colors ${pathname === item.to ? "text-accent" : "text-muted-foreground hover:text-primary-foreground"}`}>{item.label}</Link>)}</nav>
        <Button asChild variant="dock" className="ml-auto hidden h-9 px-5 font-mono text-[10px] uppercase md:inline-flex"><Link to="/start-project">Start project <ArrowUpRight className="size-3.5" /></Link></Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button>
      </div>
    </header>
    <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[70] bg-primary p-6" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}}><div className="flex items-center justify-between"><span className="font-display uppercase">JH Digitals</span><Button variant="ghost" size="icon" className="text-primary-foreground" onClick={() => setOpen(false)} aria-label="Close menu"><X /></Button></div><nav className="mt-20 flex flex-col">{links.map((item)=><Link key={item.to} to={item.to} onClick={()=>setOpen(false)} className="border-b border-primary-foreground/10 py-5 font-display text-3xl uppercase">{item.label}</Link>)}<Link to="/start-project" onClick={()=>setOpen(false)} className="mt-8 text-accent">Start a project →</Link></nav></motion.div>}</AnimatePresence>
    {children}
  </div>;
}

export function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="dark-grid border-b border-primary-foreground/10 px-5 pb-20 pt-36 md:px-10 md:pb-28"><div className="mx-auto max-w-[1360px]"><motion.p className="font-mono text-[10px] font-semibold uppercase text-accent" initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}}>{eyebrow}</motion.p><motion.h1 className="mt-5 max-w-5xl font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.08}}>{title}</motion.h1><motion.p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}>{copy}</motion.p></div></section>;
}

export function SiteFooter() {
  return <footer className="border-t border-primary-foreground/10 bg-primary px-5 py-14 md:px-10"><div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-3"><div><p className="font-display text-xl uppercase">JH Digitals</p><p className="mt-2 text-sm text-muted-foreground">Kigali, Rwanda · Worldwide</p></div><div className="font-mono text-[10px] uppercase text-muted-foreground">Strategy · Design · Engineering</div><div className="md:text-right"><a className="text-sm hover:text-accent" href="mailto:jhdigitals1@gmail.com">jhdigitals1@gmail.com</a></div></div></footer>;
}