"use client";

/* ──────────────────────────────────────────────────────────────────────────
   kevinclear.me — "Mission Control"
   An immersive operations-console portfolio for Kevin Clear, presented as a
   high-uptime service. φ = 1.618 informs the type scale and spacing rhythm.
   Dark-first; tasteful motion with full prefers-reduced-motion support.
   ────────────────────────────────────────────────────────────────────────── */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowRight, ArrowUpRight, Mail, Download } from "lucide-react";

/* Sparing secondary luminous accent (jade is the primary signal). */
const CYAN = "#38e0ff";

/* ── Inline social glyphs (lucide dropped Github/Linkedin) ───────────────── */
function GithubGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.42.36.8 1.08.8 2.18v3.23c0 .31.21.68.8.56a11.53 11.53 0 0 0 7.85-10.94C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}
function LinkedinGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/* ── Reduced-motion hook ─────────────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ── Count-up metric (animates on mount; calm under reduced-motion) ───────── */
function useCountUp(target: number, reduced: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reduced) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, durationMs]);
  return value;
}

type Metric = {
  value: number;
  display: (n: number) => string;
  label: string;
  sub: string;
};

const METRICS: Metric[] = [
  { value: 10, display: (n) => `${Math.round(n)}+`, label: "YRS UPTIME", sub: "in production" },
  { value: 6000, display: (n) => `${Math.round(n).toLocaleString()}+`, label: "USERS ONBOARDED", sub: "provisioned" },
  { value: 96, display: (n) => `${Math.round(n)}%`, label: "CSAT", sub: "satisfaction" },
  { value: 500, display: (n) => `${Math.round(n)}+`, label: "TICKETS RESOLVED", sub: "closed" },
  { value: 20, display: (n) => `${Math.round(n)}+`, label: "RCAs AUTHORED", sub: "post-incident" },
];

/* A fixed "in-service since" epoch (IT career start) — reads like real uptime. */
const UPTIME_BOOT = new Date("2015-02-02T09:00:00Z").getTime();
function formatUptime(): string {
  const totalSec = Math.floor((Date.now() - UPTIME_BOOT) / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const p = (x: number, w = 2) => String(x).padStart(w, "0");
  return `${p(days, 4)}d ${p(h)}:${p(m)}:${p(s)}`;
}

function useUptime(reduced: boolean) {
  const [text, setText] = useState("0000d 00:00:00");
  useEffect(() => {
    const raf = requestAnimationFrame(() => setText(formatUptime()));
    if (reduced) return () => cancelAnimationFrame(raf);
    const id = setInterval(() => setText(formatUptime()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [reduced]);
  return text;
}

/* ── Ambient signal-field canvas: faint grid + scrolling uptime waveforms ──── */
function SignalCanvas({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const traces = [
      { color: "rgba(43,212,154,0.55)", amp: 0.5, freq: 1.7, speed: 0.55, baseline: 0.62, noise: 0.18 },
      { color: "rgba(56,224,255,0.34)", amp: 0.34, freq: 2.6, speed: 0.8, baseline: 0.5, noise: 0.26 },
      { color: "rgba(151,160,173,0.22)", amp: 0.22, freq: 3.8, speed: 0.38, baseline: 0.78, noise: 0.4 },
    ];

    const noiseAt = (x: number, seed: number) =>
      Math.sin(x * 12.9898 + seed) * 0.5 +
      Math.sin(x * 7.233 + seed * 2.1) * 0.3 +
      Math.sin(x * 21.7 + seed * 0.7) * 0.2;

    let raf = 0;
    let t = 0;

    const drawGrid = () => {
      const step = 46;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.beginPath();
      for (let x = (t * 14) % step; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    };

    const drawTrace = (tr: (typeof traces)[number]) => {
      const mid = height * tr.baseline;
      const a = height * tr.amp * 0.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const phase = (x / width) * Math.PI * 2 * tr.freq + t * tr.speed;
        const jitter = noiseAt(x / 90 + t * tr.noise * 0.4, tr.freq) * a * tr.noise;
        const y = mid - Math.sin(phase) * a + jitter;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = tr.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      for (const tr of traces) drawTrace(tr);
      t += 0.016;
      raf = requestAnimationFrame(render);
    };

    if (reduced) {
      t = 1.2;
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      for (const tr of traces) drawTrace(tr);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* ── Headshot slot: defaults to a designed KC monogram; swaps in /kevin.jpg
   only once it actually loads (preload avoids the broken-image alt flash and
   any pre-hydration onError miss). Drop a photo at public/kevin.jpg to enable. */
function Avatar() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth > 1) setSrc("/kevin.jpg");
    };
    img.src = "/kevin.jpg";
  }, []);
  return (
    <div className="mc-rise relative w-fit" style={{ animationDelay: "30ms" }}>
      <div
        className="relative h-[72px] w-[72px] overflow-hidden rounded-full border border-signal/40 bg-card/70 sm:h-[88px] sm:w-[88px]"
        style={{ boxShadow: "0 0 0 5px rgba(43,212,154,0.07), 0 10px 34px rgba(0,0,0,0.55)" }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Kevin Clear" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold tracking-tight text-signal sm:text-3xl"
            style={{ background: "radial-gradient(120% 120% at 30% 20%, rgba(43,212,154,0.12), transparent 60%)" }}
          >
            KC
          </div>
        )}
      </div>
      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-signal mc-pulse-dot" aria-hidden="true" />
    </div>
  );
}

/* ── Experience (accurate; most recent first) ────────────────────────────── */
const EXPERIENCE = [
  {
    org: "Apple",
    role: "Production Support Engineer",
    span: "2023 — present",
    note: "Keep live, business-critical applications reliable — incident triage, root-cause analysis, Splunk observability, and AI-assisted support workflows. Technical lead for an offshore team.",
  },
  {
    org: "Google",
    role: "Site Reliability Engineer",
    span: "2022 — 2023",
    note: "Disaster-resiliency and fault-injection testing in Go; security risk assessments and least-privilege access controls on backend systems.",
  },
  {
    org: "Google",
    role: "Cloud Technical Solutions Engineer",
    span: "2021 — 2022",
    note: "Technical go-to / SME for Workspace & Cloud customers; built playbooks and diagnosis tooling so Server Operations could self-resolve; global 24/7 support.",
  },
  {
    org: "Calico Life Sciences",
    role: "IT Generalist · an Alphabet company",
    span: "2020 — 2021",
    note: "HPC clusters and VMs (Proxmox + GCP) and Google Cloud security for a research org; company-wide macOS & Chrome rollouts across 400+ devices; deployed Snipe-IT on GCP.",
  },
  {
    org: "Google",
    role: "IT Resident",
    span: "2018 — 2020",
    note: "Techstop walk-up support and worldwide field hardware repair; part of the Noogler onboarding team; a Gmail SRE rotation shipped Go optimizations that improved reliability 20%.",
  },
  {
    org: "Best Buy — Geek Squad",
    role: "Advanced Repair Agent",
    span: "2015 — 2018",
    note: "Hands-on diagnosis and repair of Windows and Apple hardware — laptops, desktops, phones, tablets, TVs — plus OS reinstalls, data recovery, and customer-facing service.",
  },
];

const PROJECTS = [
  {
    name: "Plutus",
    tag: "PY · FINANCE TOOLKIT",
    desc: "A read-only personal-finance toolkit (Python, Docker, SQLite) — pulls accounts via APIs and reports net worth, cash flow, allocation, and tax-aware analysis.",
    href: "https://github.com/kevinjclear/plutus",
    external: true,
  },
  {
    name: "Homelab platform",
    tag: "KVM · PROXMOX · CI/CD",
    desc: "A multi-VM KVM/Proxmox platform — segmented networking, CI/CD, passkey auth, and sandboxed AI-agent VMs. Secure-by-default, end to end.",
    href: null,
    external: false,
  },
  {
    name: "kevinclear.me",
    tag: "THIS SITE",
    desc: "Statically exported and self-hosted on my own homelab — the portfolio runs on the infrastructure it describes.",
    href: "https://github.com/kevinjclear/kevinclear.me",
    external: true,
  },
];

/* ── Capabilities ─────────────────────────────────────────────────────────── */
const SKILLS = [
  { label: "Reliability & Incident", items: ["Root cause analysis", "Incident response", "Splunk / observability", "Fault injection", "Runbooks-as-code"] },
  { label: "Support & Operations", items: ["Production support", "SME / escalation", "SLAs", "SOPs & docs", "Technical writing"] },
  { label: "Cloud & Infrastructure", items: ["Google Cloud (GCP)", "KVM / Proxmox", "Docker", "Linux", "macOS", "Windows (support)"] },
  { label: "Automation & GenAI", items: ["Python", "Bash", "Go", "CI/CD", "GitOps", "AI-assisted workflows"] },
  { label: "Hardware & Field", items: ["Hardware repair", "Field operations", "Device lifecycle (Jamf)", "VLAN / nftables / DNS"] },
  { label: "Foundations", items: ["Bilingual EN / ES", "B.S. Information Technology", "Google Workspace Admin", "Jamf Certified"] },
];

export default function Home() {
  const reduced = usePrefersReducedMotion();
  const uptime = useUptime(reduced);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="dark relative min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <style jsx global>{`
        @keyframes mc-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(43, 212, 154, 0.55); }
          50% { opacity: 0.85; box-shadow: 0 0 0 7px rgba(43, 212, 154, 0); }
        }
        @keyframes mc-sweep {
          0% { transform: translateX(-30%); opacity: 0; }
          12% { opacity: 0.5; }
          88% { opacity: 0.5; }
          100% { transform: translateX(130%); opacity: 0; }
        }
        @keyframes mc-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mc-scroll-hint {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 1; }
        }
        .mc-pulse-dot { animation: mc-pulse 2.4s ease-in-out infinite; }
        .mc-sweep { animation: mc-sweep 7s ease-in-out infinite; }
        .mc-rise { animation: mc-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .mc-scroll-hint { animation: mc-scroll-hint 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mc-pulse-dot, .mc-sweep, .mc-rise, .mc-scroll-hint { animation: none !important; }
          .mc-rise { opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ════════════════════════ HERO — MISSION CONTROL ════════════════════ */}
      <section className="relative flex min-h-[100svh] flex-col">
        <div className="absolute inset-0">
          <SignalCanvas reduced={reduced} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 18% 8%, rgba(43,212,154,0.10), transparent 55%), radial-gradient(120% 90% at 100% 100%, rgba(56,224,255,0.07), transparent 50%), linear-gradient(180deg, rgba(14,16,19,0.35) 0%, rgba(14,16,19,0.78) 62%, #0e1013 100%)",
            }}
          />
          <div className="absolute inset-y-0 left-0 w-1/3 overflow-hidden opacity-70">
            <div
              className="mc-sweep absolute inset-y-0 w-24 blur-md"
              style={{ background: "linear-gradient(90deg, transparent, rgba(56,224,255,0.16), transparent)" }}
            />
          </div>
        </div>

        {/* Top console bar */}
        <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 pt-6 sm:px-8 sm:pt-7">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="text-foreground">kevinclear</span>
            <span className="hidden text-muted-foreground/60 sm:inline">/ status</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
            <span className="hidden sm:inline text-muted-foreground/70">UPTIME</span>
            <span className="tabular-nums text-foreground/90" suppressHydrationWarning>
              {uptime}
            </span>
          </div>
        </header>

        {/* Center stage */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-5 py-10 sm:px-8">
          <Avatar />

          <div
            className="mc-rise mt-6 inline-flex w-fit items-center gap-3 rounded-full border border-signal/30 bg-signal/[0.06] px-4 py-2 backdrop-blur-sm"
            style={{ animationDelay: "60ms" }}
          >
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="mc-pulse-dot absolute inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-signal">
              Operational
            </span>
            <span className="hidden font-mono text-[11px] tracking-[0.1em] text-muted-foreground sm:inline">
              · open to SRE / Support Engineering roles
            </span>
          </div>
          <span className="mc-rise mt-2 block font-mono text-[11px] tracking-[0.1em] text-muted-foreground sm:hidden" style={{ animationDelay: "80ms" }}>
            open to SRE / Support Engineering roles
          </span>

          <div className="mt-7 sm:mt-9">
            <div
              className="mc-rise font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground/70"
              style={{ animationDelay: "120ms" }}
            >
              SERVICE — KEVIN CLEAR
            </div>
            <h1
              className="mc-rise mt-3 font-display font-semibold leading-[0.92] tracking-[-0.03em] text-foreground"
              style={{ animationDelay: "180ms", fontSize: "clamp(2.9rem, 11.5vw, 9.1rem)" }}
            >
              KEVIN
              <br />
              CLEAR
              <span className="align-top" style={{ color: CYAN, fontSize: "0.34em", marginLeft: "0.12em" }}>
                ●
              </span>
            </h1>

            <p
              className="mc-rise mt-6 max-w-[38rem] font-mono text-[12px] uppercase tracking-[0.22em] text-signal/90 sm:text-[13px]"
              style={{ animationDelay: "240ms" }}
            >
              Site Reliability &amp; Support Engineer
            </p>
            <p
              className="mc-rise mt-3 max-w-[34rem] text-balance text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-[1.21rem]"
              style={{ animationDelay: "300ms" }}
            >
              10+ years keeping live, business-critical systems — and the people
              who depend on them — up and running.
            </p>
            <p
              className="mc-rise mt-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground/70"
              style={{ animationDelay: "320ms" }}
            >
              AUSTIN, TX · BILINGUAL EN/ES
            </p>
          </div>

          <div className="mc-rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "380ms" }}>
            <a
              href="/kevin-clear-resume.pdf"
              data-umami-event="resume-download"
              className="group inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-signal-foreground transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              <Download className="h-4 w-4" />
              Résumé
            </a>
            <a
              href="mailto:kevin@kevinclear.me"
              data-umami-event="contact-email"
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-card/40 px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-signal/50 hover:text-signal"
            >
              <Mail className="h-4 w-4" />
              Contact
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </a>
            <div className="ml-1 flex items-center gap-1">
              <a href="https://github.com/kevinjclear" target="_blank" rel="noreferrer" aria-label="GitHub" data-umami-event="github" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-signal/50 hover:text-foreground">
                <GithubGlyph className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/in/kevinjclear" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-umami-event="linkedin" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-signal/50 hover:text-foreground">
                <LinkedinGlyph className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero telemetry rail */}
        <div className="relative z-10 border-t border-border/70 bg-card/30 backdrop-blur-sm">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-px px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-5">
            {METRICS.map((m, i) => (
              <MetricReadout key={m.label} metric={m} reduced={reduced} index={i} live={mounted} />
            ))}
          </div>
        </div>

        <a
          href="#detail"
          className="absolute bottom-[7.5rem] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70 transition-colors hover:text-signal sm:flex"
        >
          <span>scroll · detail</span>
          <span className="mc-scroll-hint inline-block">↓</span>
        </a>
      </section>

      {/* ════════════════════════ DETAIL CONTENT ════════════════════════════ */}
      <main id="detail" className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        {/* Experience */}
        <section className="border-t border-border py-16 sm:py-24">
          <SectionLabel index="01" title="SERVICE HISTORY" caption="deploy log · most recent first" />
          <ol className="mt-10 space-y-px">
            {EXPERIENCE.map((e, i) => (
              <li
                key={e.org + e.role}
                className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 border-b border-border/60 py-5 transition-colors hover:bg-card/40 sm:grid-cols-[10rem_1fr_auto] sm:gap-x-8 sm:px-3"
              >
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground/80 sm:pt-1">
                  {e.span}
                </span>
                <div className="row-start-2 sm:row-start-auto">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {e.org}
                    </h3>
                    {i === 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/[0.07] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-signal">
                        <span className="h-1.5 w-1.5 rounded-full bg-signal mc-pulse-dot" />
                        live
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.14em] text-signal/80">
                    {e.role}
                  </p>
                  <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
                    {e.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Capabilities */}
        <section className="border-t border-border py-16 sm:py-24">
          <SectionLabel index="02" title="CAPABILITIES" caption="stack & strengths" />
          <div className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((g) => (
              <div key={g.label}>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal/80">
                  {g.label}
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-border bg-card/50 px-2.5 py-1 font-mono text-[11px] tracking-[0.03em] text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="border-t border-border py-16 sm:py-24">
          <SectionLabel index="03" title="DEPLOYED SERVICES" caption="selected builds" />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PROJECTS.map((p) => {
              const Wrapper = p.href ? "a" : "div";
              const wrapperProps = p.href
                ? { href: p.href, target: "_blank", rel: "noreferrer", "data-umami-event": "project-click", "data-umami-event-name": p.name }
                : {};
              return (
                <Wrapper
                  key={p.name}
                  {...wrapperProps}
                  className={`group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card/50 p-6 transition-all duration-200 ${
                    p.href ? "hover:-translate-y-1 hover:border-signal/50 motion-reduce:transform-none" : ""
                  }`}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(43,212,154,0.6), transparent)" }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    {p.tag}
                  </span>
                  <h3 className="mt-3 flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground">
                    {p.name}
                    {p.href && (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal motion-reduce:transform-none" />
                    )}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <div className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-signal/70">
                    {p.href ? "200 OK ↗" : "self-hosted"}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-border py-16 sm:py-24">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-8 sm:p-12">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl" style={{ background: "rgba(43,212,154,0.10)" }} />
            <div className="relative">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                <span className="h-2 w-2 rounded-full bg-signal mc-pulse-dot" />
                accepting requests
              </span>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                Page the on-call.
              </h2>
              <p className="mt-3 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
                If you need someone who keeps the lights on — and keeps the
                humans calm while doing it — let&rsquo;s talk.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="mailto:kevin@kevinclear.me"
                  data-umami-event="contact-email"
                  className="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-signal-foreground transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  <Mail className="h-4 w-4" />
                  kevin@kevinclear.me
                </a>
                <a
                  href="/kevin-clear-resume.pdf"
                  data-umami-event="resume-download"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-foreground transition-colors duration-200 hover:border-signal/50 hover:text-signal"
                >
                  <Download className="h-4 w-4" />
                  Résumé
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════ FOOTER ════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-4 px-5 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal mc-pulse-dot" />
            Self-hosted on my homelab · Austin, TX
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/kevinjclear" target="_blank" rel="noreferrer" data-umami-event="github" className="transition-colors hover:text-foreground">
              GitHub
            </a>
            <a href="https://linkedin.com/in/kevinjclear" target="_blank" rel="noreferrer" data-umami-event="linkedin" className="transition-colors hover:text-foreground">
              LinkedIn
            </a>
            <a href="mailto:kevin@kevinclear.me" data-umami-event="contact-email" className="transition-colors hover:text-foreground">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function MetricReadout({
  metric,
  reduced,
  index,
  live,
}: {
  metric: Metric;
  reduced: boolean;
  index: number;
  live: boolean;
}) {
  const target = live ? metric.value : 0;
  const n = useCountUp(target, reduced || !live);
  const style: CSSProperties = { animationDelay: `${440 + index * 70}ms` };
  return (
    <div className="mc-rise px-2 py-5 sm:px-4 sm:py-6" style={style}>
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
        {metric.label}
      </div>
      <div className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">
        {metric.display(n)}
      </div>
      <div className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-signal/60">
        {metric.sub}
      </div>
    </div>
  );
}

function SectionLabel({
  index,
  title,
  caption,
}: {
  index: string;
  title: string;
  caption: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[11px] tracking-[0.2em] text-signal/70">{index}</span>
      <div className="h-px flex-1 bg-border" />
      <div className="flex items-baseline gap-3">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.24em] text-foreground">
          {title}
        </h2>
        <span className="hidden font-mono text-[10px] tracking-[0.14em] text-muted-foreground/60 sm:inline">
          {caption}
        </span>
      </div>
    </div>
  );
}
