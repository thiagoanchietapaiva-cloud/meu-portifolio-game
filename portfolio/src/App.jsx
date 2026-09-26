
import { useEffect, useRef, useState } from "react";
import fotoThiago from "./IMG_4436.jpg";

const ISLANDS = [
  { id: "sobre", label: "SOBRE", x: 0.12, y: 0.20, w: 0.18, h: 0.18, size: 92, color: "#8b5cf6", floatSpeed: 0.0007, floatOffset: 0 },
  { id: "projetos", label: "PROJETOS", x: 0.45, y: 0.62, w: 0.22, h: 0.22, size: 108, color: "#06ffa5", floatSpeed: 0.001, floatOffset: 2.5 },
  { id: "skills", label: "SKILLS", x: 0.78, y: 0.15, w: 0.16, h: 0.16, size: 76, color: "#f472b6", floatSpeed: 0.0008, floatOffset: 5 },
  { id: "contato", label: "CONTATO", x: 0.80, y: 0.60, w: 0.14, h: 0.14, size: 66, color: "#fbbf24", floatSpeed: 0.0011, floatOffset: 1.2 },
];

const SKILLS = [
  { name: "JavaScript", level: 75, color: "#facc15", icon: "JS" },
  { name: "React", level: 82, color: "#22d3ee", icon: "⚛" },
  { name: "Node.js", level: 68, color: "#06ffa5", icon: "⬢" },
  { name: "TypeScript", level: 75, color: "#3b82f6", icon: "TS" },
  { name: "Python", level: 60, color: "#60a5fa", icon: "Py" },
  { name: "Git", level: 80, color: "#f05032", icon: "⎇" },
  { name: "Tailwind", level: 78, color: "#06b6d4", icon: "≋" },
  { name: "SQL", level: 70, color: "#8b5cf6", icon: "◫" },
];

const PROJECTS = [
  { id: "01", title: "Landing Page - MeowCafé", desc: "Landing page responsiva feita com HTML5 e CSS3 puro. Layout moderno com foco em conversão.", stack: ["HTML5", "CSS3"], color: "#8b5cf6", github: "https://github.com/thiagoanchietapaiva-cloud/html-css-landing-page", demo: "https://meow-t5cd.onrender.com" },
  { id: "02", title: "Landing Page - ANIMEWEAR", desc: "Landing page fictícia de loja de camisas de anime. Foco em conversão e público geek.", stack: ["HTML5", "CSS3"], color: "#06ffa5", github: "https://github.com/thiagoanchietapaiva-cloud/LojaGeek.git", demo: "https://lojageek.onrender.com" },
  { id: "03", title: "Linktree Responsivo", desc: "Página de links pessoal inspirada no Linktree, com design minimalista.", stack: ["HTML5", "CSS3"], color: "#f472b6", github: "https://github.com/thiagoanchietapaiva-cloud/html-css-linktree.git", demo: "https://html-css-linktree-0d7k.onrender.com" },
];

export default function App() {
  const gameRef = useRef(null);
  const player = useRef({ x: 0.52, y: 0.5, vx: 0, vy: 0 });
  const starsRef = useRef([]);
  const keys = useRef({});
  const [near, setNear] = useState(null);
  const [bio, setBio] = useState("Sou Thiago Anchieta, dev Fullstack focado em criar interfaces que as pessoas realmente gostam de usar. Transformo ideias em produtos funcionais com Java, JavaScript, HTML, CSS, React, TypeScript e Tailwind.");
  const [editingBio, setEditingBio] = useState(false);
  const lastScrolledRef = useRef(null);
  const [formData, setFormData] = useState({ nome: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [touchDir, setTouchDir] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const canvas = gameRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const box = canvas.parentElement;
    const resize = () => {
      const r = box.getBoundingClientRect();
      canvas.width = r.width * window.devicePixelRatio;
      canvas.height = r.height * window.devicePixelRatio;
      canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }; resize(); window.addEventListener("resize", resize);
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 120 }, () => ({
        x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.2,
        opacity: Math.random() * 0.8 + 0.2, twinkle: Math.random() * 0.002 + 0.0005,
        color: Math.random() > 0.85 ? ["#8b5cf6", "#06ffa5", "#fbbf24"][Math.floor(Math.random() * 3)] : "#ffffff"
      }));
    }
    const kd = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key.toLowerCase() === "e" && near) document.getElementById(near.id)?.scrollIntoView({ behavior: "smooth" });
    };
    const ku = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const drawAstronaut = (x, y, dir) => {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(2, 14, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      if (Math.abs(player.current.vx) > 0.2 || Math.abs(player.current.vy) > 0.2) {
        ctx.fillStyle = Math.random() > 0.5 ? "#06ffa5" : "#8b5cf6";
        ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(-14, 10); ctx.lineTo(-8, 12); ctx.fill();
      }
      ctx.fillStyle = "#e5e7eb"; ctx.fillRect(-8, -6, 16, 14);
      ctx.fillStyle = "#0a0a0f"; ctx.fillRect(-6, -2, 12, 3);
      ctx.fillStyle = "#8b5cf6"; ctx.fillRect(-8, -8, 16, 6);
      ctx.fillStyle = "#e5e7eb"; ctx.fillRect(dir >= 0 ? 8 : -14, -2, 6, 8); ctx.fillRect(dir >= 0 ? -14 : 8, -2, 6, 8);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, -10, 10, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#8b5cf6"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#06ffa5"; ctx.beginPath(); ctx.arc(2, -10, 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };
    let raf; const loop = () => {
      const W = box.clientWidth, H = box.clientHeight;
      ctx.fillStyle = "#080810"; ctx.fillRect(0, 0, W, H);
      const time = Date.now();
      starsRef.current.forEach(s => {
        const twinkle = Math.sin(time * s.twinkle) * 0.3 + 0.7;
        ctx.globalAlpha = s.opacity * twinkle; ctx.fillStyle = s.color; ctx.beginPath();
        if (s.r > 1) { ctx.shadowColor = s.color; ctx.shadowBlur = 6; }
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
      let mx = touchDir.x; let my = touchDir.y;
      if (keys.current["w"] || keys.current["arrowup"]) my = -1;
      if (keys.current["s"] || keys.current["arrowdown"]) my = 1;
      if (keys.current["a"] || keys.current["arrowleft"]) mx = -1;
      if (keys.current["d"] || keys.current["arrowright"]) mx = 1;
      if (mx && my) { mx *= 0.707; my *= 0.707; }
      player.current.vx += (mx * 1.2 - player.current.vx) * 0.10;
      player.current.vy += (my * 1.2 - player.current.vy) * 0.10;
      player.current.x += player.current.vx * 0.016; player.current.y += player.current.vy * 0.016;
      player.current.x = Math.max(0.05, Math.min(0.95, player.current.x));
      player.current.y = Math.max(0.08, Math.min(0.92, player.current.y));
      let nearIsland = null;
      ISLANDS.forEach(is => {
        const floatX = Math.sin(time * is.floatSpeed + is.floatOffset) * 7;
        const floatY = Math.cos(time * is.floatSpeed * 0.85 + is.floatOffset) * 10;
        const size = isMobile ? is.size * 0.65 : is.size;
        const ix = is.x * W + floatX; const iy = is.y * H + floatY; const iw = size, ih = size;
        const dist = Math.hypot(player.current.x - (is.x + is.w / 2), player.current.y - (is.y + is.h / 2));
        if (dist < 0.18) nearIsland = is;
        ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.roundRect(ix + 2, iy + ih + 6, iw, 6, 3); ctx.fill();
        ctx.fillStyle = "#15151f"; ctx.strokeStyle = is.color; ctx.lineWidth = nearIsland?.id === is.id ? 2.5 : 1.5;
        if (nearIsland?.id === is.id) { ctx.shadowColor = is.color; ctx.shadowBlur = 18; }
        ctx.beginPath(); ctx.roundRect(ix, iy, iw, ih, 8); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff"; ctx.font = `900 ${nearIsland?.id === is.id ? (isMobile ? 10 : 14) : (isMobile ? 8 : 12)}px JetBrains Mono`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(is.label, ix + iw / 2, iy + ih / 2 + 2);
      });
      setNear(prev => (prev?.id !== nearIsland?.id ? nearIsland : prev));
      drawAstronaut(player.current.x * W, player.current.y * H, player.current.vx >= 0 ? 1 : -1);
      raf = requestAnimationFrame(loop);
    }; loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [near, touchDir, isMobile]);

  useEffect(() => {
    if (near && lastScrolledRef.current !== near.id) {
      document.getElementById(near.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      lastScrolledRef.current = near.id;
    }
    if (!near) {
      const t = setTimeout(() => { lastScrolledRef.current = null; }, 800);
      return () => clearTimeout(t);
    }
  }, [near]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#0a0a0f;color:#fff;font-family:'JetBrains Mono',monospace;overflow-x:hidden}
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.08);border-radius:16px}
        .hero{max-width:1200px;margin:0 auto;padding:56px 24px;display:grid;grid-template-columns:1.15fr 0.85fr;gap:32px;align-items:start}
        .sobre-wrap{max-width:1200px;margin:0 auto;padding:32px 24px}
        .sobre{ display:grid;grid-template-columns:340px 1fr;gap:20px}
        .projetos-wrap{max-width:1200px;margin:0 auto;padding:32px 24px}
        .projetos{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .skills-wrap{max-width:1200px;margin:0 auto;padding:32px 24px}
        .skills{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .contato-wrap{max-width:1200px;margin:0 auto;padding:32px 24px 80px}
        .contato{display:grid;grid-template-columns:1.2fr 0.8fr;gap:20px}
        .header-nav{display:flex;gap:24px;align-items:center}
        .mobile-menu-btn{display:none}
        .joystick{display:none}
        @media(max-width:1024px){
          .projetos{grid-template-columns:repeat(2,1fr)}
          .skills{grid-template-columns:repeat(3,1fr)}
        }
        @media(max-width:900px){
          .hero{grid-template-columns:1fr; padding:28px 16px; gap:24px}
          .sobre-wrap{padding:20px 16px}
          .sobre{grid-template-columns:1fr}
          .projetos-wrap{padding:20px 16px}
          .projetos{grid-template-columns:1fr}
          .skills-wrap{padding:20px 16px}
          .skills{grid-template-columns:repeat(2,1fr)}
          .contato-wrap{padding:20px 16px 40px}
          .contato{grid-template-columns:1fr}
          .header-nav{display:none}
          .mobile-menu-btn{display:grid}
          .joystick{display:flex}
        }
        @media(max-width:480px){
          .skills{grid-template-columns:1fr}
        }
      `}</style>

      <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"sticky", top:0, background:"rgba(10,10,15,0.9)", backdropFilter:"blur(12px)", zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#8b5cf6,#06ffa5)", display:"grid", placeItems:"center", fontWeight:800, color:"#000", fontSize:14 }}>TA</div><b>THIAGO.DEV</b></div>
        <nav className="header-nav">
          <a href="#sobre" style={{color:"#fff", textDecoration:"none", fontSize:13}}>SOBRE</a>
          <a href="#projetos" style={{color:"#fff", textDecoration:"none", fontSize:13}}>PROJETOS</a>
          <a href="#skills" style={{color:"#fff", textDecoration:"none", fontSize:13}}>SKILLS</a>
          <a href="#contato" style={{color:"#fff", textDecoration:"none", fontSize:13}}>CONTATO</a>
          <button onClick={()=>document.getElementById("jogo")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"6px 14px", borderRadius:20, background:"#fff", color:"#000", fontWeight:700, border:"none", cursor:"pointer" }}>🎮 JOGAR</button>
        </nav>
        <button className="mobile-menu-btn" onClick={()=>setMobileMenu(!mobileMenu)} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff" }}>{mobileMenu ? "✕" : "☰"}</button>
      </header>

      {mobileMenu && (
        <div style={{ position:"fixed", top:60, left:0, right:0, background:"rgba(10,10,15,0.98)", zIndex:49, padding:16, display:"flex", flexDirection:"column", gap:10, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <a href="#sobre" onClick={()=>setMobileMenu(false)} style={{ padding:"12px", background:"rgba(255,255,255,0.05)", borderRadius:10, color:"#fff", textDecoration:"none" }}>SOBRE</a>
          <a href="#projetos" onClick={()=>setMobileMenu(false)} style={{ padding:"12px", background:"rgba(255,255,255,0.05)", borderRadius:10, color:"#fff", textDecoration:"none" }}>PROJETOS</a>
          <a href="#skills" onClick={()=>setMobileMenu(false)} style={{ padding:"12px", background:"rgba(255,255,255,0.05)", borderRadius:10, color:"#fff", textDecoration:"none" }}>SKILLS</a>
          <a href="#contato" onClick={()=>setMobileMenu(false)} style={{ padding:"12px", background:"rgba(255,255,255,0.05)", borderRadius:10, color:"#fff", textDecoration:"none" }}>CONTATO</a>
        </div>
      )}

      <section className="hero">
        <div>
          <h1 style={{ fontSize:"clamp(32px,6vw,72px)", lineHeight:0.9, fontWeight:800 }}>THIAGO<br/><span style={{ background:"linear-gradient(90deg,#8b5cf6,#06ffa5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ANCHIETA</span></h1>
          <p style={{ opacity:0.7, marginTop:16, lineHeight:1.6, fontSize:14 }}>Portfolio que você navega jogando. No celular use o joystick abaixo do jogo. Pouse nas ilhas para explorar.</p>
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button onClick={()=>document.getElementById("projetos")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"12px 18px", borderRadius:12, background:"#fff", color:"#000", fontWeight:700, border:"none", cursor:"pointer" }}>Ver projetos ↗</button>
            <button onClick={()=>document.getElementById("sobre")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"12px 18px", borderRadius:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", cursor:"pointer" }}>Sobre mim</button>
          </div>
        </div>
        <div id="jogo" style={{ borderRadius:20, overflow:"hidden", background:"rgba(12,12,18,0.96)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ height: isMobile ? 300 : 360, position:"relative" }}>
            <canvas ref={gameRef} style={{ width:"100%", height:"100%", display:"block" }} />
            <div style={{ position:"absolute", left:10, top:10, fontSize:10, padding:"6px 10px", borderRadius:20, background:"rgba(0,0,0,0.6)", border:"1px solid rgba(255,255,255,0.1)" }}>
              {isMobile ? "🕹️ Joystick" : "WASD / Setas • E"}
            </div>
            {near && (
              <div style={{ position:"absolute", left:"50%", bottom:70, transform:"translateX(-50%)", padding:"8px 14px", borderRadius:20, background:near.color, color:"#000", fontWeight:800, fontSize:11, whiteSpace:"nowrap" }}>
                {near.label}
              </div>
            )}
            <div className="joystick" style={{ position:"absolute", bottom:8, left:8, right:8, justifyContent:"space-between", pointerEvents:"none" }}>
              <div style={{ display:"grid", gridTemplateColumns:"36px 36px 36px", gridTemplateRows:"36px 36px", gap:4, pointerEvents:"auto" }}>
                <div></div><button onTouchStart={()=>setTouchDir({x:0,y:-1})} onTouchEnd={()=>setTouchDir({x:0,y:0})} onMouseDown={()=>setTouchDir({x:0,y:-1})} onMouseUp={()=>setTouchDir({x:0,y:0})} style={{ width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff" }}>↑</button><div></div>
                <button onTouchStart={()=>setTouchDir({x:-1,y:0})} onTouchEnd={()=>setTouchDir({x:0,y:0})} onMouseDown={()=>setTouchDir({x:-1,y:0})} onMouseUp={()=>setTouchDir({x:0,y:0})} style={{ width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff" }}>←</button>
                <button onTouchStart={()=>setTouchDir({x:0,y:1})} onTouchEnd={()=>setTouchDir({x:0,y:0})} onMouseDown={()=>setTouchDir({x:0,y:1})} onMouseUp={()=>setTouchDir({x:0,y:0})} style={{ width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff" }}>↓</button>
                <button onTouchStart={()=>setTouchDir({x:1,y:0})} onTouchEnd={()=>setTouchDir({x:0,y:0})} onMouseDown={()=>setTouchDir({x:1,y:0})} onMouseUp={()=>setTouchDir({x:0,y:0})} style={{ width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff" }}>→</button>
              </div>
              <button onClick={()=>{ if(near) document.getElementById(near.id)?.scrollIntoView({behavior:"smooth"}) }} style={{ width:52, height:52, borderRadius:"50%", background: near ? near.color : "rgba(255,255,255,0.2)", border:"2px solid rgba(255,255,255,0.3)", color: near ? "#000" : "#fff", fontWeight:800, pointerEvents:"auto" }}>E</button>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="sobre-wrap">
        <h2 style={{ fontSize:20, fontWeight:800, marginBottom:12 }}>SOBRE_MIM</h2>
        <div className="sobre">
          <div className="glass" style={{ padding:16, textAlign:"center" }}>
            <img src={fotoThiago} alt="Thiago" style={{ width:100, height:100, borderRadius:"50%", objectFit:"cover", margin:"0 auto", display:"block", border:"2px solid #8b5cf6" }} />
            <div style={{ fontWeight:700, marginTop:8 }}>Thiago Anchieta</div><div style={{ fontSize:11, opacity:0.6 }}>Fullstack • Junior • ADS</div>
          </div>
          <div className="glass" style={{ padding:16 }}>
            <p style={{ fontSize:13, lineHeight:1.6, opacity:0.85 }}>{bio}</p>
          </div>
        </div>
      </section>

      <section id="projetos" className="projetos-wrap">
        <h2 style={{ fontSize:20, fontWeight:800, marginBottom:12 }}>PROJETOS</h2>
        <div className="projetos">
          {PROJECTS.map(p=>(
            <div key={p.id} className="glass" style={{ padding:16 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:p.color, display:"grid", placeItems:"center", fontWeight:800, color:"#000", fontSize:12 }}>{p.id}</div>
              <div style={{ fontWeight:700, marginTop:10 }}>{p.title}</div>
              <div style={{ fontSize:11, opacity:0.6, marginTop:6 }}>{p.desc}</div>
              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                <a href={p.github} target="_blank" style={{ fontSize:11, padding:"6px 10px", borderRadius:10, background:"rgba(255,255,255,0.08)", color:"#fff", textDecoration:"none" }}>GitHub</a>
                <a href={p.demo} target="_blank" style={{ fontSize:11, padding:"6px 10px", borderRadius:10, background:p.color, color:"#000", textDecoration:"none", fontWeight:700 }}>Demo ↗</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="skills" className="skills-wrap">
        <h2 style={{ fontSize:20, fontWeight:800, marginBottom:12 }}>SKILLS</h2>
        <div className="glass" style={{ padding:12 }}>
          <div className="skills" style={{ padding:0, maxWidth:"none" }}>
            {SKILLS.map(s=>(
              <div key={s.name} className="glass" style={{ padding:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ fontSize:12, fontWeight:700 }}>{s.name}</span><span style={{ fontSize:10, opacity:0.6 }}>{s.level}%</span></div>
                <div style={{ marginTop:8, height:4, background:"rgba(255,255,255,0.1)", borderRadius:10 }}><div style={{ width:`${s.level}%`, height:"100%", background:s.color, borderRadius:10 }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="contato-wrap">
        <h2 style={{ fontSize:20, fontWeight:800, marginBottom:12 }}>CONTATO</h2>
        <div className="contato">
          <div className="glass" style={{ padding:16 }}>
            <input placeholder="Seu nome" value={formData.nome} onChange={e=>setFormData({...formData, nome:e.target.value})} style={{ width:"100%", padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", marginBottom:8 }} />
            <input placeholder="Seu email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} style={{ width:"100%", padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", marginBottom:8 }} />
            <textarea placeholder="Mensagem" value={formData.msg} onChange={e=>setFormData({...formData, msg:e.target.value})} style={{ width:"100%", height:90, padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff" }} />
            <button onClick={()=>{ if(!formData.nome||!formData.msg){alert("Preencha");return;} const url=`https://wa.me/5585994062045?text=${encodeURIComponent(`Olá sou ${formData.nome} (${formData.email})\n\n${formData.msg}`)}`; window.open(url,"_blank"); setSent(true); setTimeout(()=>setSent(false),3000); }} style={{ width:"100%", marginTop:10, padding:"12px", borderRadius:10, background: sent ? "#06ffa5" : "#fff", color:"#000", fontWeight:700, border:"none", cursor:"pointer" }}>{sent ? "✅ Enviado" : "WhatsApp ✨"}</button>
          </div>
          <div className="glass" style={{ padding:16 }}>
            <div style={{ display:"grid", gap:8 }}>
              <a href="https://github.com/thiagoanchietapaiva-cloud?tab=repositories" target="_blank" style={{ padding:"10px 12px", background:"rgba(255,255,255,0.06)", borderRadius:10, color:"#fff", textDecoration:"none", fontSize:12 }}>GitHub ↗</a>
              <a href="https://wa.me/5585994062045" target="_blank" style={{ padding:"10px 12px", background:"rgba(37,211,102,0.15)", borderRadius:10, color:"#25D366", textDecoration:"none", fontSize:12, fontWeight:700 }}>WhatsApp ↗</a>
              <a href="mailto:thiagoanchietapaiva@gmail.com" style={{ padding:"10px 12px", background:"rgba(255,255,255,0.06)", borderRadius:10, color:"#fff", textDecoration:"none", fontSize:12 }}>Email ↗</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
