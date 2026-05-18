import { useState, useRef, useEffect, useCallback } from "react";

const WALLPAPER = `radial-gradient(ellipse at 20% 50%, #0d2137 0%, transparent 60%),
radial-gradient(ellipse at 80% 20%, #0a3d2b 0%, transparent 55%),
radial-gradient(ellipse at 60% 80%, #1a0d2e 0%, transparent 50%),
linear-gradient(135deg, #0a0f1e 0%, #0d1f16 40%, #0f0a1a 100%)`;

const DOCK_APPS = [
  { id: "about", icon: "👤", label: "About" },
  { id: "projects", icon: "📁", label: "Projects" },
  { id: "skills", icon: "⚡", label: "Skills" },
  { id: "contact", icon: "✉️", label: "Contact" },
  { id: "terminal", icon: "🖥️", label: "Terminal" },
];

const PROJECTS = [
  { name: "Cameroon Homestay Agency", tech: ["React", "Vite", "TypeScript", "i18n"], desc: "Full bilingual EN/FR platform with translated URL slugs, WhatsApp booking deeplinks, and reusable component architecture.", color: "#1a6b4a", accent: "#34d399" },
  { name: "CADI — Central African Diving", tech: ["React", "Vite", "TypeScript", "SEO"], desc: "22-page, 35-component site with dark maritime aesthetic, full EN/FR i18n, JSON-LD structured data, and 7-phase build plan.", color: "#0c3d6b", accent: "#60a5fa" },
  { name: "Global Bush Travel", tech: ["React", "Vite", "Tailwind", "Blog"], desc: "13+ service pages, dynamic location/tour pages, AI blog writing agent, and bilingual EN/FR routing with fully translated slugs.", color: "#4a2a0a", accent: "#fb923c" },
  { name: "IELTS Prep App", tech: ["React Native", "Expo", "Supabase", "SQLCipher"], desc: "AI-powered mobile app with Supabase Edge Functions proxy, SQLCipher encryption, OWASP Mobile Top 10 security audit.", color: "#2a0a4a", accent: "#c084fc" },
];

const SKILLS = [
  { cat: "Frontend", items: ["React 18", "TypeScript", "Next.js", "Vite", "Tailwind CSS", "React Native"] },
  { cat: "i18n & SEO", items: ["react-i18next", "Translated URL slugs", "JSON-LD", "Structured Data", "Meta/OG tags"] },
  { cat: "Backend & DB", items: ["Supabase", "Edge Functions", "SQLCipher", "REST APIs"] },
  { cat: "Tools", items: ["Expo", "Lovable AI", "OpenCode", "Git", "Vite", "Webpack"] },
];

const TERMINAL_LINES = [
  { ps: true, cmd: "whoami" },
  { out: "KaptainCS3 — Full-stack Web Developer, Yaoundé, CM 🇨🇲" },
  { ps: true, cmd: "ls projects/" },
  { out: "CHA/  CADI/  GlobalBush/  IELTSPrep/" },
  { ps: true, cmd: "cat stack.json" },
  { out: '{ "primary": ["React","TypeScript","Next.js","Vite"], "specialty": "Multilingual travel websites" }' },
  { ps: true, cmd: "echo $HIRE_STATUS" },
  { out: "open_to_freelance=true  | EN/FR | remote_ok=true" },
  { ps: true, cmd: "_" },
];

const WINDOW_CONFIGS = {
  about: {
    title: "About.md",
    icon: "👤",
    w: 520,
    h: 400,
    content: "about",
  },
  projects: {
    title: "Projects — ~/portfolio",
    icon: "📁",
    w: 620,
    h: 480,
    content: "projects",
  },
  skills: {
    title: "Skills.json",
    icon: "⚡",
    w: 480,
    h: 420,
    content: "skills",
  },
  contact: {
    title: "Contact",
    icon: "✉️",
    w: 400,
    h: 340,
    content: "contact",
  },
  terminal: {
    title: "bash — kaptain@portfolio",
    icon: "🖥️",
    w: 540,
    h: 360,
    content: "terminal",
  },
};

function useTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function AboutContent() {
  return (
    <div className="p-6 h-full overflow-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <div className="flex items-start gap-5 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "linear-gradient(135deg, #0a3d2b, #1a6b4a)" }}>
          🧑‍💻
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">KaptainCS3</h2>
          <p style={{ color: "#34d399" }} className="text-sm">Full-stack Web Developer</p>
          <p className="text-xs mt-1" style={{ color: "#6b8fa0" }}>📍 Yaoundé, Cameroon</p>
        </div>
      </div>
      <div className="space-y-3 text-sm" style={{ color: "#a8c4d0" }}>
        <p>I build <span style={{ color: "#34d399" }}>multilingual travel & tourism websites</span> for Central African clients — fast, SEO-optimized, and conversion-focused.</p>
        <p>Speciality: <span style={{ color: "#60a5fa" }}>EN/FR bilingual routing</span> with fully translated URL slugs, WhatsApp deeplinks as primary booking CTAs, and reusable component architectures built for AI coding agents.</p>
        <p>Currently accepting <span style={{ color: "#fb923c" }}>freelance engagements</span> — remote-first, bilingual, payment via Wise or Payoneer.</p>
        <div className="pt-3 border-t" style={{ borderColor: "#1e3a4a" }}>
          <p className="text-xs" style={{ color: "#4a6b7a" }}># languages</p>
          <p>🇬🇧 English (fluent) · 🇫🇷 French (fluent)</p>
        </div>
      </div>
    </div>
  );
}

function ProjectsContent() {
  const [active, setActive] = useState(null);
  return (
    <div className="flex h-full" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <div className="w-48 border-r flex-shrink-0 overflow-auto py-2" style={{ borderColor: "#1e3a4a", background: "#060d14" }}>
        <p className="text-xs px-3 py-1 mb-1" style={{ color: "#4a6b7a" }}>PORTFOLIO /</p>
        {PROJECTS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="w-full text-left px-3 py-2 text-xs transition-all"
            style={{
              color: active === i ? "#fff" : "#6b8fa0",
              background: active === i ? p.color + "66" : "transparent",
              borderLeft: active === i ? `2px solid ${p.accent}` : "2px solid transparent",
            }}
          >
            📁 {p.name.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-5">
        {active === null ? (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: "#2a4a5a" }}>
            <p className="text-4xl mb-3">📁</p>
            <p className="text-sm">Select a project</p>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-bold mb-1" style={{ color: "#fff" }}>{PROJECTS[active].name}</h3>
            <div className="flex flex-wrap gap-1 mb-4">
              {PROJECTS[active].tech.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: PROJECTS[active].color, color: PROJECTS[active].accent }}>
                  {t}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#a8c4d0" }}>{PROJECTS[active].desc}</p>
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: PROJECTS[active].color + "33", borderLeft: `3px solid ${PROJECTS[active].accent}`, color: "#6b8fa0" }}>
              🇨🇲 Built for Cameroon & Central Africa market
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsContent() {
  return (
    <div className="p-5 h-full overflow-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <p className="text-xs mb-4" style={{ color: "#4a6b7a" }}>// skills.json — last updated 2025</p>
      <div className="space-y-4">
        {SKILLS.map((s) => (
          <div key={s.cat}>
            <p className="text-xs mb-2" style={{ color: "#34d399" }}>"{s.cat}": [</p>
            <div className="pl-4 flex flex-wrap gap-2">
              {s.items.map((item) => (
                <span key={item} className="text-xs px-2 py-1 rounded" style={{ background: "#0d1f16", color: "#a8c4d0", border: "0.5px solid #1e3a2a" }}>
                  {item}
                </span>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "#34d399" }}>],</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="p-6 h-full flex flex-col justify-center" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <p className="text-xs mb-4" style={{ color: "#4a6b7a" }}>// Let's build something</p>
      <div className="space-y-3">
        {[
          { icon: "✉️", label: "Email", value: "hello@kaptaincs3.dev", color: "#60a5fa" },
          { icon: "💼", label: "LinkedIn", value: "/in/kaptaincs3", color: "#34d399" },
          { icon: "🐙", label: "GitHub", value: "github.com/kaptaincs3", color: "#c084fc" },
          { icon: "💬", label: "WhatsApp", value: "+237 6XX XXX XXX", color: "#25d366" },
        ].map((c) => (
          <div key={c.label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#060d14", border: "0.5px solid #1e3a4a" }}>
            <span className="text-lg">{c.icon}</span>
            <div>
              <p className="text-xs" style={{ color: "#4a6b7a" }}>{c.label}</p>
              <p className="text-sm" style={{ color: c.color }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg text-center text-xs" style={{ background: "#0a3d2b33", border: "0.5px solid #1a6b4a", color: "#34d399" }}>
        🟢 Available for freelance · EN/FR · Remote
      </div>
    </div>
  );
}

function TerminalContent() {
  const [lines, setLines] = useState([TERMINAL_LINES[0]]);
  const [idx, setIdx] = useState(1);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (idx < TERMINAL_LINES.length - 1) {
      const t = setTimeout(() => {
        setLines((l) => [...l, TERMINAL_LINES[idx]]);
        setIdx((i) => i + 1);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [idx]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCmd = (e) => {
    if (e.key !== "Enter") return;
    const cmd = input.trim();
    setLines((l) => [...l, { ps: true, cmd }, { out: cmd === "clear" ? "" : cmd ? `bash: ${cmd}: command not found (try: whoami, ls, cat)` : "" }]);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "#0a0f14", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <div className="flex-1 overflow-auto p-4 text-sm space-y-0.5">
        {lines.map((l, i) =>
          l.ps ? (
            <div key={i} className="flex gap-2">
              <span style={{ color: "#34d399" }}>kaptain@portfolio</span>
              <span style={{ color: "#4a6b7a" }}>:~$</span>
              <span style={{ color: "#e2e8f0" }}>{l.cmd}</span>
            </div>
          ) : l.out ? (
            <div key={i} style={{ color: "#60a5fa" }} className="pl-4">{l.out}</div>
          ) : null
        )}
        <div className="flex gap-2 items-center">
          <span style={{ color: "#34d399" }}>kaptain@portfolio</span>
          <span style={{ color: "#4a6b7a" }}>:~$</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCmd}
            className="bg-transparent outline-none flex-1 text-sm"
            style={{ color: "#e2e8f0", caretColor: "#34d399" }}
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}

function WindowContent({ id }) {
  if (id === "about") return <AboutContent />;
  if (id === "projects") return <ProjectsContent />;
  if (id === "skills") return <SkillsContent />;
  if (id === "contact") return <ContactContent />;
  if (id === "terminal") return <TerminalContent />;
  return null;
}

function Window({ id, config, pos, zIndex, isMinimized, onClose, onMinimize, onFocus, desktopRef }) {
  const [position, setPosition] = useState(pos);
  const [size, setSize] = useState({ w: config.w, h: config.h });
  const [isMaximized, setIsMaximized] = useState(false);
  const dragRef = useRef(null);
  const windowRef = useRef(null);

  const onMouseDown = useCallback((e) => {
    if (isMaximized) return;
    onFocus();
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    const onMove = (me) => {
      const desktop = desktopRef.current;
      if (!desktop) return;
      const rect = desktop.getBoundingClientRect();
      const newX = Math.max(0, Math.min(me.clientX - startX, rect.width - size.w));
      const newY = Math.max(0, Math.min(me.clientY - startY, rect.height - 80));
      setPosition({ x: newX, y: newY });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [position, size, isMaximized, onFocus]);

  if (isMinimized) return null;

  const style = isMaximized
    ? { position: "absolute", top: 0, left: 0, width: "100%", height: "calc(100% - 72px)", zIndex }
    : { position: "absolute", top: position.y, left: position.x, width: size.w, height: size.h, zIndex };

  return (
    <div
      ref={windowRef}
      style={{
        ...style,
        borderRadius: isMaximized ? 0 : 12,
        overflow: "hidden",
        border: "0.5px solid #1e3a4a",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px #0a2030",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        style={{
          background: "#0d1f2d",
          borderBottom: "0.5px solid #1e3a4a",
          height: 36,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          cursor: "default",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 7, marginRight: 12 }}>
          <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", border: "none", cursor: "pointer", transition: "filter 0.15s" }}
            onMouseEnter={e => e.target.style.filter = "brightness(1.2)"}
            onMouseLeave={e => e.target.style.filter = "brightness(1)"}
          />
          <button onClick={onMinimize} style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", border: "none", cursor: "pointer" }} />
          <button onClick={() => setIsMaximized(m => !m)} style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", border: "none", cursor: "pointer" }} />
        </div>
        <span style={{ fontSize: 12, color: "#6b8fa0", flex: 1, textAlign: "center" }}>
          {config.icon} {config.title}
        </span>
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", background: "#0a1520" }}>
        <WindowContent id={id} />
      </div>
    </div>
  );
}

function DockItem({ app, isOpen, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {hovered && (
        <div style={{
          position: "absolute", bottom: 58, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap",
          border: "0.5px solid #1e3a4a", pointerEvents: "none",
        }}>
          {app.label}
        </div>
      )}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          border: "0.5px solid rgba(255,255,255,0.12)",
          fontSize: 24,
          cursor: "pointer",
          transition: "transform 0.15s ease, background 0.15s ease",
          transform: hovered ? "scale(1.3) translateY(-6px)" : "scale(1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {app.icon}
      </button>
      {isOpen && (
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#34d399", marginTop: 3 }} />
      )}
    </div>
  );
}

export default function PortfolioOS() {
  const time = useTime();
  const desktopRef = useRef(null);
  const [windows, setWindows] = useState({});
  const [zCounter, setZCounter] = useState(10);

  const openWindow = useCallback((id) => {
    setZCounter((z) => {
      const newZ = z + 1;
      setWindows((w) => {
        if (w[id]) {
          return { ...w, [id]: { ...w[id], minimized: false, z: newZ } };
        }
        const dw = desktopRef.current?.offsetWidth || 800;
        const dh = desktopRef.current?.offsetHeight || 600;
        const cfg = WINDOW_CONFIGS[id];
        return {
          ...w,
          [id]: {
            pos: {
              x: Math.max(20, Math.floor(dw / 2 - cfg.w / 2) + (Object.keys(w).length * 24)),
              y: Math.max(20, Math.floor(dh / 3 - cfg.h / 3) + (Object.keys(w).length * 24)),
            },
            minimized: false,
            z: newZ,
          },
        };
      });
      return newZ;
    });
  }, []);

  const closeWindow = (id) => {
    setWindows((w) => { const n = { ...w }; delete n[id]; return n; });
  };

  const minimizeWindow = (id) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], minimized: true } }));
  };

  const focusWindow = (id) => {
    setZCounter((z) => {
      const newZ = z + 1;
      setWindows((w) => ({ ...w, [id]: { ...w[id], z: newZ } }));
      return newZ;
    });
  };

  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        minHeight: 600,
        background: WALLPAPER,
        position: "relative",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      {/* Stars */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={`${(i * 37 + 11) % 100}%`} cy={`${(i * 53 + 7) % 100}%`}
            r={i % 5 === 0 ? 1.5 : 0.8} fill="white" opacity={0.1 + (i % 4) * 0.08}
          />
        ))}
      </svg>

      {/* Subtle glow orbs */}
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)", top: "10%", left: "15%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)", top: "20%", right: "20%", pointerEvents: "none" }} />

      {/* Menu bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 26,
        background: "rgba(5, 10, 18, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", zIndex: 9999,
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 14 }}>🖥️</span>
          {["File", "View", "Window", "Help"].map(m => (
            <span key={m} style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", cursor: "default" }}>{m}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>🇨🇲 Yaoundé</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{dateStr}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>{timeStr}</span>
        </div>
      </div>

      {/* Desktop icon area */}
      <div style={{ position: "absolute", top: 36, right: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {[{ icon: "🌍", label: "Cameroon.travel" }, { icon: "📄", label: "Resume.pdf" }].map(item => (
          <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "default" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Welcome text on desktop */}
      {Object.keys(windows).length === 0 && (
        <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Portfolio OS</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.08)", letterSpacing: "-0.02em" }}>KaptainCS3</p>
          <p style={{ fontSize: 12, color: "rgba(52,211,153,0.25)", marginTop: 8 }}>Click an app in the dock to get started</p>
        </div>
      )}

      {/* Desktop area for windows */}
      <div ref={desktopRef} style={{ position: "absolute", top: 26, left: 0, right: 0, bottom: 72 }}>
        {Object.entries(windows).map(([id, state]) => (
          <Window
            key={id}
            id={id}
            config={WINDOW_CONFIGS[id]}
            pos={state.pos}
            zIndex={state.z}
            isMinimized={state.minimized}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            onFocus={() => focusWindow(id)}
            desktopRef={desktopRef}
          />
        ))}
      </div>

      {/* Dock */}
      <div style={{
        position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        border: "0.5px solid rgba(255,255,255,0.12)",
        borderRadius: 18,
        padding: "8px 16px",
        display: "flex", alignItems: "flex-end", gap: 10,
        zIndex: 9999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}>
        {DOCK_APPS.map(app => (
          <DockItem
            key={app.id}
            app={app}
            isOpen={!!windows[app.id] && !windows[app.id].minimized}
            onClick={() => openWindow(app.id)}
          />
        ))}
        <div style={{ width: 0.5, height: 36, background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />
        <DockItem
          app={{ id: "github", icon: "🐙", label: "GitHub" }}
          isOpen={false}
          onClick={() => window.open("https://github.com/kaptaincs3", "_blank")}
        />
      </div>
    </div>
  );
}
