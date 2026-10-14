import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../siteConfig.js';
import { 
  BarChart3, Database, Cpu, Globe, Brain, Award, 
  FileText, ArrowDown, Mail, Eye, Layers, Github, 
  Linkedin, Copy, MapPin, Send, CheckCircle2, 
  X, Printer, Menu, Code, FileSpreadsheet, Check,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Constellation Interactive Canvas (Particle field connected by lines - 10% reduced, medium visible)
function ConstellationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const rgb = [178, 58, 72]; // highlights #B23A48
    const isMobile = window.innerWidth < 768;
    // Reduced 10% of particles (110 -> 99, 45 -> 40)
    const count = isMobile ? 40 : 99;
    const mouse = { x: -9999, y: -9999, active: false };
    const maxLineDist = isMobile ? 115 : 160;
    const mouseRadius = 210;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (width || window.innerWidth),
      y: Math.random() * (height || window.innerHeight),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: 1.5 + Math.random() * 2.0,
      baseVx: (Math.random() - 0.5) * 0.45,
      baseVy: (Math.random() - 0.5) * 0.45,
    }));

    let moveTimeout = null;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        mouse.active = false;
      }, 120);
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }

    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (!ctx || !width || !height) return;
      ctx.clearRect(0, 0, width, height);

      // Calculate character position to ensure particles never overlap the character
      const imgRatio = 1280 / 720;
      const canvasRatio = width / height;
      let drawW, drawH, drawX, drawY;
      if (canvasRatio > imgRatio) {
        drawW = width;
        drawH = width / imgRatio;
        drawX = 0;
        drawY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgRatio;
        drawX = (width - drawW) / 2;
        drawY = 0;
      }
      const charCenterX = drawX + (860 / 1280) * drawW;
      const charCenterY = drawY + (380 / 720) * drawH;
      const charRadiusX = (340 / 1280) * drawW;
      const charRadiusY = (370 / 720) * drawH;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius && dist > 0) {
            const force = (mouseRadius - dist) / mouseRadius;
            p.vx += (dx / dist) * force * 0.25;
            p.vy += (dy / dist) * force * 0.25;
          }
        }

        // Repel particles softly away from character body & face
        const cdx = p.x - charCenterX;
        const cdy = (p.y - charCenterY) * (charRadiusX / charRadiusY);
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < charRadiusX && cdist > 0) {
          p.vx += (cdx / cdist) * 0.45;
          p.vy += (cdy / cdist) * 0.45;
        }

        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle with medium visibility
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.52)`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.65)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLineDist) {
            // Medium visible connecting lines
            const alpha = (1 - dist / maxLineDist) * 0.30;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Non-overlapping mask: softly exclude character silhouette so lines & particles never overlap character
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      const maskGrad = ctx.createRadialGradient(
        charCenterX, charCenterY, Math.min(charRadiusX, charRadiusY) * 0.45,
        charCenterX, charCenterY, Math.max(charRadiusX, charRadiusY)
      );
      maskGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      maskGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.95)');
      maskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = maskGrad;
      ctx.beginPath();
      ctx.ellipse(charCenterX, charCenterY, charRadiusX, charRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(moveTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />;
}

// Award-winning Zero-Ghosting Zero-Lag Character Cursor-Tracking Canvas
function CharacterHeroCanvas({ mousePos }) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const centerImgRef = useRef(null);
  const currentAngleRef = useRef(-Math.PI / 2); // Default looking up/neutral

  useEffect(() => {
    // Preload center neutral frame (direct eye contact)
    const center = new Image();
    center.src = '/frames/center.webp';
    center.onerror = () => { center.src = 'frames/center.webp'; };
    centerImgRef.current = center;

    // Preload 64 360-degree trajectory WebP frames
    const frames = [];
    for (let i = 0; i < 64; i++) {
      const img = new Image();
      const idxStr = i.toString().padStart(2, '0');
      img.src = `/frames/frame_${idxStr}.webp`;
      img.onerror = () => { img.src = `frames/frame_${idxStr}.webp`; };
      frames.push(img);
    }
    framesRef.current = frames;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animId;

    // Shortest-path circular angular lerp
    const lerpAngle = (current, target, factor) => {
      let diff = (target - current) % (2 * Math.PI);
      if (diff < -Math.PI) diff += 2 * Math.PI;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      return current + diff * factor;
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!canvas.parentElement) return;
      const W = canvas.width = canvas.parentElement.clientWidth;
      const H = canvas.height = canvas.parentElement.clientHeight;

      // Theme Background #120609
      ctx.fillStyle = '#120609';
      ctx.fillRect(0, 0, W, H);

      // Object-fit: cover calculation for 1280x720 video frames
      const imgW = 1280;
      const imgH = 720;
      const imgRatio = imgW / imgH;
      const canvasRatio = W / H;
      let drawW, drawH, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawW = W;
        drawH = W / imgRatio;
        drawX = 0;
        drawY = (H - drawH) / 2;
      } else {
        drawH = H;
        drawW = H * imgRatio;
        drawX = (W - drawW) / 2;
        drawY = 0;
      }

      // Character face center in canvas coordinates (face is at (850, 190) in 1280x720)
      const faceScreenX = drawX + (850 / 1280) * drawW;
      const faceScreenY = drawY + (190 / 720) * drawH;

      const curX = mousePos.current.x;
      const curY = mousePos.current.y;
      const dx = curX - faceScreenX;
      const dy = curY - faceScreenY;
      const dist = Math.hypot(dx, dy);
      const deadzone = Math.min(W, H) * 0.12; // ~12% screen radius

      let imgToDraw = null;

      if (dist < deadzone) {
        // Center Eye Contact Deadzone: looks directly into the user's eyes
        if (centerImgRef.current && centerImgRef.current.complete) {
          imgToDraw = centerImgRef.current;
        }
      } else {
        const targetAngle = Math.atan2(dy, dx);
        // Shortest-path angular lerp with fast response factor ~0.26 (tracks in ~35ms with zero lag)
        currentAngleRef.current = lerpAngle(currentAngleRef.current, targetAngle, 0.26);

        // Map smoothed angle to nearest frame index (0..63)
        let norm = (currentAngleRef.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        let frameIndex = Math.round((norm / (2 * Math.PI)) * 64) % 64;

        const frameImg = framesRef.current[frameIndex];
        if (frameImg && frameImg.complete) {
          imgToDraw = frameImg;
        } else if (centerImgRef.current && centerImgRef.current.complete) {
          imgToDraw = centerImgRef.current;
        }
      }

      if (imgToDraw) {
        // Draw EXACTLY ONE crisp frame at 100% opacity. NO alpha blending!
        ctx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);

        // Seamless feathered integration into theme background #120609
        // 1. Left side feathering: pure solid #120609 under typography, fading softly toward the character
        const leftFade = ctx.createLinearGradient(0, 0, drawX + drawW * 0.54, 0);
        leftFade.addColorStop(0, '#120609');
        leftFade.addColorStop(0.55, '#120609');
        leftFade.addColorStop(0.85, 'rgba(18, 6, 9, 0.82)');
        leftFade.addColorStop(1, 'rgba(18, 6, 9, 0)');
        ctx.fillStyle = leftFade;
        ctx.fillRect(0, 0, W, H);

        // 2. Bottom edge fade into #120609
        const bottomFade = ctx.createLinearGradient(0, H * 0.8, 0, H);
        bottomFade.addColorStop(0, 'rgba(18, 6, 9, 0)');
        bottomFade.addColorStop(1, '#120609');
        ctx.fillStyle = bottomFade;
        ctx.fillRect(0, 0, W, H);

        // 3. Top edge fade into #120609 behind top-centered nav
        const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.22);
        topFade.addColorStop(0, 'rgba(18, 6, 9, 0.92)');
        topFade.addColorStop(1, 'rgba(18, 6, 9, 0)');
        ctx.fillStyle = topFade;
        ctx.fillRect(0, 0, W, H);

        // 4. Subtle outer radial vignette keeping character face vibrant and edges deep #120609
        const radialFade = ctx.createRadialGradient(faceScreenX, faceScreenY, Math.min(drawW, drawH) * 0.35, faceScreenX, faceScreenY, Math.max(drawW, drawH) * 0.85);
        radialFade.addColorStop(0, 'rgba(18, 6, 9, 0)');
        radialFade.addColorStop(0.65, 'rgba(18, 6, 9, 0.35)');
        radialFade.addColorStop(1, '#120609');
        ctx.fillStyle = radialFade;
        ctx.fillRect(0, 0, W, H);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ zIndex: 1 }}
    />
  );
}

// Hero Interactive Button Component (Expanding Ripple Wave on Hover)
function HeroButton({ children, onClick, primary = false, href = null, className = "" }) {
  const [isPushed, setIsPushed] = useState(false);

  const handleClick = (e) => {
    setIsPushed(true);
    setTimeout(() => setIsPushed(false), 700);
    if (onClick) onClick(e);
  };

  const baseClasses = "group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-xs sm:text-sm tracking-wide cursor-pointer select-none overflow-hidden transition-all duration-500";
  const variantClasses = primary 
    ? "bg-brand-coral text-white hover:shadow-[0_0_35px_rgba(230,57,70,0.5)] border border-brand-coral" 
    : "bg-transparent border border-white/20 text-white/80 hover:border-brand-coral/60 hover:text-white";

  const contentClasses = primary
    ? "relative z-10 flex items-center gap-2.5 font-semibold"
    : "relative z-10 flex items-center gap-2.5 font-semibold transition-colors duration-[400ms] delay-[500ms] group-hover:text-white";

  const content = (
    <>
      {primary && (
        <span 
          className="absolute inset-0 z-[1] -translate-x-full skew-x-[-20deg] opacity-0 group-hover:translate-x-[200%] group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
            width: "40%",
            borderRadius: "inherit"
          }}
        />
      )}
      {!primary && (
        <span 
          className="absolute top-1/2 left-[15%] z-[1] w-[380%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full scale-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-100 bg-gradient-to-r from-brand-primary via-brand-crimson to-brand-coral"
        />
      )}
      <span className={contentClasses}>{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={`${baseClasses} ${variantClasses} ${isPushed ? "animate-push" : ""} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={handleClick} className={`${baseClasses} ${variantClasses} ${isPushed ? "animate-push" : ""} ${className}`}>
      {content}
    </button>
  );
}

// Interactive Circular Photo Avatar with Sparkle Animation for About Me
// Minimal & Chic Interactive Portrait Card for About Me
function InteractivePhotoAvatar({ setShowResumeModal }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Cap tilt at max 3 degrees
    const rotateX = Math.max(-3, Math.min(3, ((centerY - y) / centerY) * 3));
    const rotateY = Math.max(-3, Math.min(3, ((x - centerX) / centerX) * 3));
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="about-portrait-card group relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 w-full max-w-sm"
      style={{
        background: 'rgba(26, 8, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(178, 58, 72, 0.28)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out, border-color 0.3s, box-shadow 0.3s' : 'border-color 0.3s, box-shadow 0.3s',
        willChange: 'transform'
      }}
    >
      {/* Subtle Ambient Radial Highlight inside card */}
      <div 
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none opacity-20 blur-2xl group-hover:opacity-35 transition-opacity duration-700"
        style={{ background: 'radial-gradient(circle, #B23A48 0%, transparent 70%)' }}
      />

      {/* Circular Portrait with Gradient Ring & Subtle Hover Glow */}
      <div className="relative mb-5 group/avatar select-none">
        {/* Gentle Crimson-to-Rose Gradient Ring */}
        <div 
          className="relative w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full p-[3px] transition-all duration-500 shadow-[0_0_20px_rgba(120,0,0,0.35)] group-hover/avatar:shadow-[0_0_30px_rgba(244,63,94,0.35)]"
          style={{
            background: 'linear-gradient(135deg, #780000 0%, #B23A48 50%, #FDA4AF 100%)'
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-[#16070A] relative border border-white/10">
            <img
              src="public/sharnitha.png"
              onError={(e) => { e.currentTarget.src = "sharnitha.png"; }}
              alt="Sharnitha T"
              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover/avatar:scale-[1.03]"
            />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(18,6,9,0.3)] pointer-events-none" />
          </div>
        </div>

        {/* Small Elegant "MORE ABOUT ME ↗" Indicator */}
        <a
          href="resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#1A080E]/95 border border-[#B23A48]/50 shadow-[0_4px_14px_rgba(0,0,0,0.5)] text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[#FECDD3] hover:text-white hover:border-[#F43F5E]/70 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#F43F5E]"
          title="View Complete Resume & Details"
        >
          <span>More About Me</span>
          <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-xs text-[#F43F5E]">
            ↗
          </span>
        </a>
      </div>

      {/* Name & Role Label */}
      <div className="pt-2">
        <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Sharnitha T
        </h4>
        <p className="text-xs sm:text-sm font-medium text-[#FDA4AF]/90 tracking-wide mt-1">
          Aspiring Data Analyst
        </p>
      </div>
    </div>
  );
}

// Kokonut UI Social Button Component (@kokonutui/social-button inspired)
function KokonutSocialButton({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { name: "Email", icon: Mail, href: "mailto:sharnithat@gmail.com", tooltip: "sharnithat@gmail.com", bgHover: "hover:bg-[#B23A48]" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/sharnitharaj/", target: "_blank", tooltip: "LinkedIn", bgHover: "hover:bg-[#0077b5]" },
    { name: "GitHub", icon: Github, href: "https://github.com/Sharnitharaj", target: "_blank", tooltip: "GitHub", bgHover: "hover:bg-[#24292e]" },
    { name: "Chat", icon: Send, href: "#contact", tooltip: "Direct Message", bgHover: "hover:bg-[#C7B5FF] hover:text-[#120609]" }
  ];

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        className={`flex items-center rounded-full bg-white/10 border backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'border-[#B23A48]/80 pr-2 bg-black/45 shadow-[0_0_25px_rgba(178,58,72,0.4)]' : 'border-white/35 hover:border-white/60 hover:bg-white/20'
        }`}
      >
        {/* Primary Action Button */}
        <a 
          href="#contact"
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-colors whitespace-nowrap group/talk"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B23A48] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7B5FF]"></span>
          </span>
          <span>Let's Talk</span>
          <svg 
            className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#C7B5FF]' : 'group-hover/talk:translate-x-0.5'}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* Expanding Social Media Row */}
        <div 
          className={`flex items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? 'max-w-[260px] opacity-100 pl-1.5' : 'max-w-0 opacity-0 overflow-hidden pointer-events-none'
          }`}
        >
          <div className="w-[1px] h-4 bg-white/25 mx-0.5 shrink-0" />
          {items.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                target={item.target}
                rel={item.target ? "noopener noreferrer" : undefined}
                title={item.tooltip}
                aria-label={item.name}
                className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 text-white transition-all duration-200 hover:scale-115 active:scale-95 ${item.bgHover}`}
                style={{
                  transitionDelay: isOpen ? `${idx * 35}ms` : '0ms'
                }}
              >
                <IconComp className="w-3.5 h-3.5" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Minimal & Chic About Me Section with Scroll Reveal & Viewport Observer
function AboutSection({ setShowResumeModal }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative pt-6 pb-20 px-6 max-w-7xl mx-auto w-full">
      {/* Subtle Ambient Radial Crimson Glow (8-12s slow opacity cycle) */}
      <div 
        className="about-ambient-glow absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(178,58,72,0.22) 0%, rgba(120,0,0,0.08) 50%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      {/* Section Heading: Centered Biography, No Horizontal Side Lines */}
      <div className={`about-reveal flex flex-col items-center justify-center text-center mb-12 select-none transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[10px] font-mono tracking-[0.35em] uppercase font-semibold text-[#FECDD3]/80">
          Biography
        </span>
        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '-0.01em'
          }}
        >
          About Me
        </h2>
        {/* Short animated crimson-to-rose underline with tiny glowing rose accent dot */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <div 
            className={`h-[1.5px] rounded-full transition-all duration-700 ease-out delay-200 ${isRevealed ? 'w-10 opacity-80' : 'w-0 opacity-0'}`} 
            style={{ background: 'linear-gradient(90deg, transparent, #B23A48, #FDA4AF)' }} 
          />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDA4AF] shadow-[0_0_8px_rgba(253,164,175,0.9)]" />
          <div 
            className={`h-[1.5px] rounded-full transition-all duration-700 ease-out delay-200 ${isRevealed ? 'w-10 opacity-80' : 'w-0 opacity-0'}`} 
            style={{ background: 'linear-gradient(90deg, #FDA4AF, #B23A48, transparent)' }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        {/* Left Column: Portrait Card */}
        <div className={`lg:col-span-5 flex flex-col items-center justify-center about-reveal transition-all duration-700 ease-out delay-200 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <InteractivePhotoAvatar setShowResumeModal={setShowResumeModal} />
        </div>

        {/* Right Column: Minimal & Chic Narrative */}
        <div className={`lg:col-span-7 flex flex-col justify-center space-y-5 about-reveal transition-all duration-700 ease-out delay-300 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Heading: Curious About Data. Driven by Insights. */}
          <h3 className="group/title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FBF5F6] leading-snug tracking-tight">
            Curious About Data.{' '}
            <span className="bg-gradient-to-r from-[#FFE4E6] via-[#FDA4AF] to-[#F43F5E] bg-clip-text text-transparent group-hover/title:from-white group-hover/title:to-[#FB7185] transition-all duration-300">
              Driven by Insights.
            </span>
          </h3>

          {/* Concise Introduction: Maximum two short paragraphs */}
          <div className="space-y-3 text-sm sm:text-base text-[#D8C7CA]/90 leading-relaxed font-normal">
            <p>
              With a background in Computer Science, I love discovering the patterns hidden inside data and turning them into stories people can understand.
            </p>
            <p>
              I'm building my analytical toolkit one project at a time, combining curiosity, structured thinking, and a growing passion for data-driven decisions.
            </p>
          </div>

          {/* Location & Learning-Status Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm text-[#D8C7CA]/85">
            <div className="group/loc flex items-center gap-1.5 cursor-default">
              <span className="text-[#FDA4AF]/75 group-hover/loc:text-[#F43F5E] transition-colors duration-200 text-sm">⌖</span>
              <span>Based in Tamil Nadu, India</span>
            </div>

            <span className="hidden sm:inline text-white/20 select-none">•</span>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#260B13]/85 border border-[#B23A48]/35 text-[11px] sm:text-xs text-[#F4E2E6] shadow-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.7)] shrink-0" />
              <span>Currently exploring data analytics</span>
            </div>
          </div>

          {/* Three Compact Focus Tags */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {['Analysis', 'Visualization', 'Insights'].map((tag) => (
              <span
                key={tag}
                className="about-focus-tag px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#F4E2E6] bg-[#260B13] border border-[#B23A48]/30 cursor-default select-none"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Subtle Projects Link */}
          <div className="pt-3">
            <a
              href="#projects"
              className="about-projects-link group inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#FDA4AF] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#F43F5E] focus:ring-offset-2 focus:ring-offset-[#120609] rounded py-1 relative"
            >
              <span className="relative">
                Explore My Projects
                <span className="about-link-line absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-gradient-to-r from-[#B23A48] to-[#F43F5E] transition-all duration-300 group-hover:w-full" />
              </span>
              <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 text-sm text-[#F43F5E]">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ✦ Curated Project Tech Stack Data ✦
const TECH_STACK_DATA = [
  // Frontend
  { id: 'html5', name: 'HTML5', category: ['Frontend'], level: 'ADVANCED', desc: 'Semantic Structure & Modern Web Standards' },
  { id: 'css3', name: 'CSS3', category: ['Frontend'], level: 'ADVANCED', desc: 'Modern Styling, Flexbox/Grid & Responsive Layouts' },
  { id: 'javascript', name: 'JavaScript', category: ['Frontend'], level: 'ADVANCED', desc: 'Modern ES6+ Syntax, Async/Await & Web APIs' },
  { id: 'react', name: 'React', category: ['Frontend'], level: 'ADVANCED', desc: 'Component-Driven UIs, Hooks & Modern Single Page Apps' },

  // Backend
  { id: 'python', name: 'Python', category: ['Backend', 'Analysis'], level: 'ADVANCED', desc: 'Scripting, Data Science, Automation & Analytics' },
  { id: 'nodejs', name: 'Node.js', category: ['Backend'], level: 'INTERMEDIATE', desc: 'Server-Side JavaScript & Scalable Event-Driven Services' },
  { id: 'express', name: 'Express.js', category: ['Backend'], level: 'INTERMEDIATE', desc: 'RESTful API Routing, Middleware & Controller Architectures' },
  { id: 'restapis', name: 'REST APIs', category: ['Backend'], level: 'INTERMEDIATE', desc: 'Endpoint Architecture, CRUD Protocols & Status Codes' },
  { id: 'mongodb', name: 'MongoDB', category: ['Backend'], level: 'INTERMEDIATE', desc: 'NoSQL Collections, Document Storage & JSON Schemas' },

  // Tools
  { id: 'git', name: 'Git', category: ['Tools'], level: 'ADVANCED', desc: 'Distributed Version Control & Branch Management' },
  { id: 'github', name: 'GitHub', category: ['Tools'], level: 'ADVANCED', desc: 'Repository Hosting, Collaboration & Project Workflows' },
  { id: 'vscode', name: 'VS Code', category: ['Tools'], level: 'ADVANCED', desc: 'Code Editing, Extensions, Debugging & Linting' },
  { id: 'jupyter', name: 'Jupyter Notebook', category: ['Tools', 'Analysis'], level: 'ADVANCED', desc: 'Exploratory Data Analysis, Prototyping & Visualizations' },

  // Analysis
  { id: 'excel', name: 'Microsoft Excel', category: ['Analysis'], level: 'ADVANCED', desc: 'PivotTables, Data Modeling, Lookup & Advanced Formulas' },
  { id: 'powerquery', name: 'Power Query', category: ['Analysis'], level: 'ADVANCED', desc: 'ETL Pipelines, Data Cleansing & Schema Transformation' },
  { id: 'powerbi', name: 'Power BI', category: ['Analysis'], level: 'ADVANCED', desc: 'Executive Dashboards, DAX Modeling & KPI Tracking' },
  { id: 'sql', name: 'SQL', category: ['Analysis', 'Backend'], level: 'ADVANCED', desc: 'Complex Queries, Relational Joins & Data Aggregations' },
  { id: 'mysql', name: 'MySQL', category: ['Analysis', 'Backend'], level: 'ADVANCED', desc: 'Relational Database Management & Schema Normalization' },
  { id: 'pandas', name: 'Pandas', category: ['Analysis'], level: 'INTERMEDIATE', desc: 'DataFrames, Data Wrangling, Cleaning & Manipulation' },
  { id: 'numpy', name: 'NumPy', category: ['Analysis'], level: 'INTERMEDIATE', desc: 'Numerical Array Operations, Matrix Math & Vectorization' },
  { id: 'matplotlib', name: 'Matplotlib', category: ['Analysis'], level: 'INTERMEDIATE', desc: 'Statistical Plotting, Trend Visualization & Charts' },
  { id: 'seaborn', name: 'Seaborn', category: ['Analysis'], level: 'INTERMEDIATE', desc: 'Statistical Graphics, Correlation Matrices & Heatmaps' }
];

// Dedicated High-Fidelity Vector Tech Logos
function TechIcon({ name, className = "w-6 h-6" }) {
  switch (name) {
    case 'html5':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 3l1.8 17.5L12 22l6.2-1.5L20 3H4z" fill="#E44D26"/>
          <path d="M12 4.5v15.8l4.8-1.2L18.2 4.5H12z" fill="#F16529"/>
          <path d="M12 8.5H8.3l.3 3h3.4v-3zm0 5.5H9.9l.2 2 1.9.5v-2.5z" fill="#EBEBEB"/>
          <path d="M12 8.5h3.7l-.4 4.2h-3.3v-3zm0 5.5v2.5l1.9-.5.3-2h-2.2z" fill="#FFFFFF"/>
        </svg>
      );
    case 'css3':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 3l1.8 17.5L12 22l6.2-1.5L20 3H4z" fill="#1572B6"/>
          <path d="M12 4.5v15.8l4.8-1.2L18.2 4.5H12z" fill="#33A9DC"/>
          <path d="M12 8.5H8.3l.3 3h3.4v-3zm0 5.5H9.9l.2 2 1.9.5v-2.5z" fill="#EBEBEB"/>
          <path d="M12 8.5h3.7l-.4 4.2h-3.3v-3zm0 5.5v2.5l1.9-.5.3-2h-2.2z" fill="#FFFFFF"/>
        </svg>
      );
    case 'javascript':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
          <path d="M7 17.5c.8.5 1.7.8 2.5.8 1.4 0 2.2-.7 2.2-1.8v-6.3H9.7v6.2c0 .6-.3.9-.9.9-.4 0-.8-.1-1.2-.3l-.6 1.5zm8.1.1c1.2 0 2.2-.5 2.8-1.3l-1.3-1c-.4.5-.9.8-1.5.8-.7 0-1.2-.4-1.2-.9 0-.6.5-.9 1.6-1.3 1.8-.7 2.6-1.5 2.6-2.8 0-1.6-1.3-2.6-3.1-2.6-1.2 0-2.2.4-2.8 1.1l1.2 1.1c.4-.4.9-.7 1.6-.7.7 0 1.1.4 1.1.9 0 .5-.4.8-1.4 1.2-1.8.7-2.8 1.4-2.8 2.9 0 1.6 1.3 2.6 3.2 2.6z" fill="#000000"/>
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.4"/>
          <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)" stroke="#61DAFB" strokeWidth="1.4"/>
          <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)" stroke="#61DAFB" strokeWidth="1.4"/>
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB"/>
        </svg>
      );
    case 'python':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M11.9 2c-3.1 0-2.9 1.3-2.9 1.3v1.4h3v.4H7.8S6 4.9 6 8.2c0 3.3 1.6 3.2 1.6 3.2h1v-1.4s-.1-1.6 1.6-1.6h2.7s1.5 0 1.5-1.5V4.4S14.8 2 11.9 2zm-.9 1.2a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z" fill="#387EB8"/>
          <path d="M12.1 22c3.1 0 2.9-1.3 2.9-1.3v-1.4h-3v-.4h4.2s1.8.2 1.8-3.1c0-3.3-1.6-3.2-1.6-3.2h-1v1.4s.1 1.6-1.6 1.6h-2.7s-1.5 0-1.5 1.5v2.7s-.4 2.3 2.5 2.3zm.9-1.2a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4z" fill="#FFE873"/>
        </svg>
      );
    case 'nodejs':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2z" fill="#539E43"/>
          <path d="M12 4.2l7.1 4.1v8.2L12 20.6 4.9 16.5V8.3L12 4.2z" fill="#333333"/>
          <path d="M8.5 15.5V9.5l3.5 6 3.5-6v6" stroke="#83CD29" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'express':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#1C1C1E"/>
          <text x="12" y="16" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="bold">ex</text>
        </svg>
      );
    case 'restapis':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5" cy="12" r="3" fill="#B23A48" fillOpacity="0.3"/>
          <circle cx="19" cy="6" r="3" fill="#B23A48" fillOpacity="0.3"/>
          <circle cx="19" cy="18" r="3" fill="#B23A48" fillOpacity="0.3"/>
          <path d="M8 12h5m0 0l3-5m-3 5l3 5"/>
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M12 2c-.3 0-6.5 5.8-6.5 12.2 0 4.3 3.3 7.8 6.5 7.8s6.5-3.5 6.5-7.8C18.5 7.8 12.3 2 12 2z" fill="#47A248"/>
          <path d="M12 2v20c.3 0 6.5-3.5 6.5-7.8C18.5 7.8 12.3 2 12 2z" fill="#499D4A"/>
          <path d="M12 3v18c-.3-.2-1.2-1.5-1.2-3.5 0-3 1.2-6.5 1.2-8.5V3z" fill="#FFFFFF" fillOpacity="0.35"/>
        </svg>
      );
    case 'git':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="3" y="3" width="18" height="18" rx="4" transform="rotate(45 12 12)" fill="#F05032"/>
          <circle cx="9" cy="12" r="1.6" fill="#FFF"/>
          <circle cx="15" cy="8.5" r="1.6" fill="#FFF"/>
          <circle cx="15" cy="15.5" r="1.6" fill="#FFF"/>
          <path d="M9 12h3.5m0 0l2.5-3.5m-2.5 3.5l2.5 3.5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#FFFFFF">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      );
    case 'vscode':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M17.5 2.5L7.2 10.4 4 7.8 2 9.2v5.6l2 1.4 3.2-2.6L17.5 21.5 22 19.3V4.7l-4.5-2.2z" fill="#007ACC"/>
          <path d="M17.5 2.5L7.2 10.4l3.5 2.7L17.5 2.5z" fill="#1F9CF0"/>
          <path d="M17.5 21.5L7.2 13.6l3.5-2.7 6.8 10.6z" fill="#0065A9"/>
        </svg>
      );
    case 'jupyter':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <circle cx="12" cy="12" r="5" fill="#F37626"/>
          <path d="M6 7c1.5-2.5 4-3.5 6-3.5s4.5 1 6 3.5" stroke="#767677" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 17c1.5 2.5 4 3.5 6 3.5s4.5-1 6-3.5" stroke="#767677" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="18" cy="7" r="1.3" fill="#767677"/>
          <circle cx="6" cy="17" r="1.3" fill="#F37626"/>
        </svg>
      );
    case 'excel':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="2" y="3" width="20" height="18" rx="3" fill="#107C41"/>
          <path d="M7 7h10v10H7V7z" fill="#FFF" fillOpacity="0.2"/>
          <path d="M8 8.5l3.2 3.5L8 15.5h2.2l2-2.3 2 2.3h2.2L13.2 12l3.2-3.5h-2.2l-2 2.3-2-2.3H8z" fill="#FFFFFF"/>
        </svg>
      );
    case 'powerquery':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" fill="#0E6B38"/>
          <path d="M4 6h16l-6 7v6l-4-2v-4L4 6z" fill="#F2C811"/>
          <circle cx="17" cy="17" r="3.5" fill="#F2C811" stroke="#0E6B38" strokeWidth="1"/>
          <path d="M15.5 17h3M17 15.5v3" stroke="#0E6B38" strokeWidth="1.2"/>
        </svg>
      );
    case 'powerbi':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" fill="#242424"/>
          <rect x="5" y="13" width="3.5" height="7" rx="1" fill="#F2C811" fillOpacity="0.6"/>
          <rect x="10.2" y="9" width="3.5" height="11" rx="1" fill="#F2C811" fillOpacity="0.85"/>
          <rect x="15.5" y="5" width="3.5" height="15" rx="1" fill="#F2C811"/>
        </svg>
      );
    case 'sql':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <ellipse cx="12" cy="5" rx="8" ry="3" fill="#00758F"/>
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" stroke="#00758F" strokeWidth="1.5"/>
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="#00758F" strokeWidth="1.5"/>
          <text x="12" y="14" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontSize="6.5" fontWeight="900">SQL</text>
        </svg>
      );
    case 'mysql':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 3.3 1.6 6.2 4 8v-3c0-3.9 3.1-7 7-7s7 3.1 7 7v3c2.4-1.8 4-4.7 4-8 0-5.5-4.5-10-10-10z" fill="#00758F"/>
          <path d="M12 12c-2.8 0-5 2.2-5 5v5h10v-5c0-2.8-2.2-5-5-5z" fill="#F29111"/>
        </svg>
      );
    case 'pandas':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" fill="#130754"/>
          <rect x="5" y="5" width="3" height="14" rx="1.5" fill="#150458"/>
          <rect x="10.5" y="7" width="3" height="10" rx="1.5" fill="#FFD43B"/>
          <rect x="16" y="9" width="3" height="10" rx="1.5" fill="#E70488"/>
        </svg>
      );
    case 'numpy':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" fill="#4DABCF"/>
          <path d="M12 2l8.5 5-8.5 5-8.5-5L12 2z" fill="#013243" fillOpacity="0.4"/>
          <path d="M12 12v10l8.5-5V7L12 12z" fill="#013243" fillOpacity="0.2"/>
          <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7" fontWeight="900">NP</text>
        </svg>
      );
    case 'matplotlib':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" fill="#112233"/>
          <path d="M4 18h16M5 19V5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M5 15l4-6 4 4 6-8" stroke="#11557C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M5 15l4-6 4 4 6-8" stroke="#FF7F0E" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="9" cy="9" r="1.3" fill="#FF7F0E"/>
          <circle cx="13" cy="13" r="1.3" fill="#FF7F0E"/>
          <circle cx="19" cy="5" r="1.3" fill="#FF7F0E"/>
        </svg>
      );
    case 'seaborn':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" fill="#0F172A"/>
          <path d="M3 17c3-8 5-11 9-11s6 9 9 11" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 19c4-5 6-7 9-7s5 4 9 7" stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M3 13c2-4 5-6 9-6s7 3 9 6" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2"/>
        </svg>
      );
    default:
      return (
        <div className={`rounded-full bg-[#B23A48]/30 flex items-center justify-center font-bold text-xs text-white ${className}`}>
          {name.charAt(0).toUpperCase()}
        </div>
      );
  }
}

// ✦ Interactive Glassmorphism Tech Stack Section with Floating Tool Bubbles ✦
function TechStackSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState(null);
  const [hoveredToolId, setHoveredToolId] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  const categories = ['All', 'Frontend', 'Backend', 'Tools', 'Analysis'];

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleContainerMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleContainerMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    // If selected tool is not in new category, reset to prompt
    if (selectedTool && cat !== 'All' && !selectedTool.category.includes(cat)) {
      setSelectedTool(null);
    }
  };

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
  };

  const filteredTools = activeCategory === 'All'
    ? TECH_STACK_DATA
    : TECH_STACK_DATA.filter(t => t.category.includes(activeCategory));

  return (
    <section id="skills" ref={sectionRef} className="scroll-mt-24 py-24 px-6 max-w-7xl mx-auto w-full relative">
      {/* 1. SECTION HEADING */}
      <div className={`flex flex-col items-center justify-center text-center mb-12 select-none transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-[10px] font-mono tracking-[0.35em] uppercase font-semibold text-[#FECDD3]/80">
          TECHNICAL STACK
        </span>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1 text-white"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.01em' }}
        >
          Tools of My Trade
        </h2>
        {/* Short, glowing rose/crimson underline */}
        <div className="flex items-center justify-center gap-1.5 pt-2 mb-3">
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #B23A48, #FDA4AF)' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDA4AF] shadow-[0_0_8px_rgba(253,164,175,0.9)]" />
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #FDA4AF, #B23A48, transparent)' }} />
        </div>
        <p className="text-sm sm:text-base text-[#D8C7CA]/90 max-w-2xl mx-auto font-normal">
          The technologies I use to explore data, build solutions, and bring ideas to life.
        </p>
      </div>

      {/* 2. ONE LARGE GLASSMORPHISM CONTAINER */}
      <div
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className={`tech-glass-container relative overflow-hidden rounded-3xl border border-[#B23A48]/30 shadow-[0_20px_60px_rgba(0,0,0,0.65)] transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{
          background: 'rgba(26, 8, 14, 0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Subtle Cursor-Following Radial Glow (Clipped inside container, pointer-events-none) */}
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(178, 58, 72, 0.18), rgba(244, 63, 94, 0.05) 45%, transparent 70%)`
          }}
        />

        {/* 3. FUNCTIONAL CATEGORY FILTERS AT TOP OF CONTAINER */}
        <div className="relative pt-6 sm:pt-8 pb-4 px-4 sm:px-6 flex justify-center border-b border-[#B23A48]/15 z-10">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-full bg-[#120609]/60 border border-[#B23A48]/25 backdrop-blur-md">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F43F5E] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#780000]/70 via-[#B23A48]/60 to-[#F43F5E]/50 text-white border border-[#F43F5E]/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'text-[#D8C7CA]/70 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. SELECTED-TOOL DISPLAY AREA (Below filters, above bubbles) */}
        <div className="relative py-6 sm:py-8 border-b border-[#B23A48]/15 flex flex-col items-center justify-center text-center px-4 transition-all duration-300 z-10 min-h-[110px]">
          {selectedTool ? (
            <div key={selectedTool.id} className="animate-fadeIn flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#260B13] border border-[#F43F5E]/40 flex items-center justify-center shadow-[0_0_18px_rgba(244,63,94,0.35)] p-1.5 shrink-0">
                  <TechIcon name={selectedTool.id} className="w-full h-full" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    background: 'linear-gradient(135deg, #FFFFFF 20%, #FFE4E6 60%, #FDA4AF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {selectedTool.name}
                </h3>
                {selectedTool.level && (
                  <span
                    className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border transition-all duration-300 ${
                      selectedTool.level === 'ADVANCED'
                        ? 'bg-gradient-to-r from-[#780000]/70 to-[#B23A48]/60 border-[#F43F5E]/60 text-[#FFE4E6] shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'bg-[#260B13]/80 border-[#B23A48]/50 text-[#FDA4AF] shadow-[0_0_8px_rgba(178,58,72,0.2)]'
                    }`}
                  >
                    {selectedTool.level}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTool(null);
                  }}
                  aria-label="Deselect selected technology"
                  title="Deselect selected technology"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A080E]/90 hover:bg-[#780000]/70 border border-[#B23A48]/40 hover:border-[#F43F5E]/80 text-[#FDA4AF] hover:text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_8px_rgba(178,58,72,0.25)] hover:shadow-[0_0_14px_rgba(244,63,94,0.45)] focus:outline-none focus:ring-2 focus:ring-[#F43F5E] ml-0.5 group"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              {selectedTool.desc && (
                <p className="text-xs sm:text-sm text-[#F4E2E6]/90 mt-2 font-medium max-w-md px-2">
                  {selectedTool.desc}
                </p>
              )}
              <div className="h-[2px] w-16 sm:w-24 rounded-full mt-2.5 bg-gradient-to-r from-transparent via-[#F43F5E] to-transparent shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
            </div>
          ) : (
            <div className="flex flex-col items-center select-none">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] font-semibold text-[#FDA4AF]/80">
                SELECT A TECHNOLOGY
              </span>
              <p className="text-xs text-[#D8C7CA]/65 mt-1.5 font-normal">
                Hover to explore. Click a tool to highlight it.
              </p>
              <div className="h-[1.5px] w-12 rounded-full mt-2.5 bg-gradient-to-r from-transparent via-[#B23A48]/50 to-transparent" />
            </div>
          )}
        </div>

        {/* 4. INTERACTIVE FLOATING TOOL BUBBLES */}
        <div className="relative p-6 sm:p-10 lg:p-12 z-10">
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4.5 max-w-5xl mx-auto">
            {filteredTools.map((tool, idx) => {
              const isSelected = selectedTool?.id === tool.id;
              const isHovered = hoveredToolId === tool.id;
              
              // Staggered durations (3.6s to 5.4s) and delays (0s to 2.4s)
              const floatDuration = `${3.6 + (idx % 5) * 0.45}s`;
              const floatDelay = `${(idx % 7) * 0.35}s`;

              return (
                <div key={tool.id} className="relative inline-block">
                  {/* 5. Tooltip on Hover / Focus */}
                  {isHovered && (
                    <div
                      className="tech-tooltip absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#120609]/95 border border-[#F43F5E]/60 text-white text-xs font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.6)] pointer-events-none whitespace-nowrap z-30"
                    >
                      <span>{tool.name}</span>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#120609] border-r border-b border-[#F43F5E]/60 transform rotate-45" />
                    </div>
                  )}

                  {/* Floating Bubble Button */}
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={tool.name}
                    onClick={() => handleToolClick(tool)}
                    onMouseEnter={() => setHoveredToolId(tool.id)}
                    onMouseLeave={() => setHoveredToolId(null)}
                    onFocus={() => setHoveredToolId(tool.id)}
                    onBlur={() => setHoveredToolId(null)}
                    style={{
                      '--float-duration': floatDuration,
                      '--float-delay': floatDelay
                    }}
                    className={`tech-bubble-float tech-bubble-btn group relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#F43F5E] focus:ring-offset-2 focus:ring-offset-[#120609] ${
                      isSelected ? 'is-selected' : 'border border-[#B23A48]/30 bg-[#260B13]/75 backdrop-blur-md'
                    }`}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <TechIcon name={tool.id} className="w-full h-full" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold tracking-tight text-white/95 group-hover:text-white transition-colors whitespace-nowrap">
                      {tool.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
// ✦ PROJECTS & WORK: Folding Carousel Project Data ✦
const PROJECTS_DATA = [
  {
    id: "flight-booking-analytics",
    title: "Flight Booking and Travel Data Analysis",
    category: "analytics",
    categoryName: "Data Analytics & BI",
    date: "Aug 2026",
    featured: true,
    githubUrl: "https://github.com/sharnitha-t/flight-booking-analysis",
    shortDescription: "An end-to-end travel data analysis project exploring flight booking patterns, ticket pricing, customer preferences, and demand trends to uncover useful insights from travel data.",
    expandedDescription: "This project explores flight booking and travel data to understand how ticket prices, booking behaviour, customer preferences, and demand patterns vary across the available dataset. The workflow can include data cleaning, exploratory analysis, comparisons, and visualizations that make travel-related trends easier to interpret. The goal is to transform raw booking data into clear, useful insights that can support data-driven decision-making.",
    highlights: [
      "Analyzed multi-dimensional flight booking records to uncover airline performance trends, booking demand peaks, and pricing patterns.",
      "Cleaned and transformed 1,200 records using Microsoft Excel and Power Query, performing robust data modeling with DAX.",
      "Built an interactive Power BI executive dashboard presenting actionable insights and key trends to support business strategy."
    ],
    metrics: [
      { label: "Records Cleaned", value: "1,200" },
      { label: "Core Tool", value: "Power BI" },
      { label: "Focus", value: "Demand & Pricing" }
    ],
    tags: ["Excel", "SQL", "Python", "Power BI", "Data Cleaning", "Data Visualization"]
  },
  {
    id: "smart-city-bike-sharing",
    title: "Smart City Bike Sharing Analytics",
    category: "analytics",
    categoryName: "Data Analytics & BI",
    date: "Jul 2026",
    featured: false,
    githubUrl: null,
    shortDescription: "A Power BI analytics project exploring bike-sharing station data, data relationships, and urban mobility patterns through interactive visualizations.",
    expandedDescription: "This project uses a dataset containing 2,856 station records to explore bike-sharing station information and urban mobility data. It includes a structured star-schema data model, DAX measures, and an interactive Power BI dashboard designed to present key information clearly. The project demonstrates how data preparation, modeling, and visualization can turn raw station records into an accessible analytical experience.",
    highlights: [
      "Analyzed urban mobility dataset comprising 2,856 bike-sharing station records across geographic zones.",
      "Engineered a relational star-schema data model linking station dimensions, temporal factors, and trip metrics.",
      "Authored custom DAX calculations and developed an interactive Power BI dashboard visualizing station density and mobility trends."
    ],
    metrics: [
      { label: "Station Records", value: "2,856" },
      { label: "Architecture", value: "Star Schema" },
      { label: "Tool", value: "Power BI" }
    ],
    tags: ["Power BI", "DAX", "Data Modeling", "Data Visualization"]
  },
  {
    id: "fingerprint-blood-detection",
    title: "Fingerprint-Based Blood Group Detection",
    category: "ml",
    categoryName: "AI & Machine Learning",
    date: "Jan 2026 – Apr 2026",
    featured: false,
    githubUrl: "https://github.com/sharnitha-t/fingerprint-blood-group-detection",
    shortDescription: "An experimental computer-vision project exploring fingerprint image classification for blood-group prediction.",
    expandedDescription: "This project investigates an experimental approach to fingerprint image classification using computer-vision and machine-learning techniques. It focuses on exploring image inputs, classification workflows, and the challenges of developing a model that attempts to predict blood-group categories from fingerprint patterns. The project is presented as an exploratory technical implementation, not a clinically validated diagnostic system.",
    highlights: [
      "Investigated experimental computer-vision classification workflow predicting blood groups from biometric fingerprint images.",
      "Applied OpenCV image preprocessing routines including contrast adjustment, ridge filtering, and binarization.",
      "Trained machine learning classification algorithms and validated model performance across sample image datasets."
    ],
    metrics: [
      { label: "Workflow", value: "Experimental ML" },
      { label: "Processing", value: "OpenCV" },
      { label: "Language", value: "Python" }
    ],
    tags: ["Python", "Computer Vision", "Image Processing", "Machine Learning"]
  },
  {
    id: "crime-pattern-detection",
    title: "Crime Pattern Detection",
    category: "ml",
    categoryName: "AI & Machine Learning",
    date: "May 2026",
    featured: false,
    githubUrl: null,
    shortDescription: "A data-driven project exploring crime records to identify patterns, examine trends, and make complex information easier to investigate.",
    expandedDescription: "This project focuses on exploring crime-related data through structured data preparation, analysis, and visualization. Depending on the available dataset and implemented functionality, it can help examine patterns across recorded incidents and present trends in a more accessible format. The objective is to demonstrate how analytical techniques can support the exploration and interpretation of complex datasets.",
    highlights: [
      "Organized and analyzed multidimensional crime datasets to identify historical trends, temporal distributions, and spatial clusters.",
      "Implemented SQL queries and Pandas data-wrangling pipelines to aggregate records by category and frequency.",
      "Created structured statistical visualizations and clustering models to assist analytical interpretation."
    ],
    metrics: [
      { label: "Technique", value: "Clustering & EDA" },
      { label: "Data Stack", value: "SQL & Pandas" },
      { label: "Output", value: "Pattern Insights" }
    ],
    tags: ["Python", "Pandas", "SQL", "Data Visualization", "Machine Learning"]
  },
  {
    id: "my-portfolio",
    title: "My Portfolio",
    category: "web",
    categoryName: "Full Stack",
    date: "Oct 2026",
    featured: false,
    githubUrl: null,
    shortDescription: "A personal portfolio website showcasing my background, technical skills, projects, and development journey through an interactive visual experience.",
    expandedDescription: "This portfolio brings together my technical background, projects, skills, and learning journey in one place. It uses a consistent deep-maroon visual identity, interactive sections, animated visual elements, and responsive layouts to present my work. The project demonstrates my approach to interface design, web development, and building a cohesive personal brand.",
    highlights: [
      "Designed and implemented an executive deep-maroon glassmorphism interface with custom atmospheric lighting effects.",
      "Engineered interactive components including a constellation canvas, floating tech bubbles, and an interactive 3D folding carousel.",
      "Ensured responsive cross-device layouts, semantic HTML5 structure, and full accessibility support."
    ],
    metrics: [
      { label: "Framework", value: "React & Vanilla CSS" },
      { label: "Theme", value: "Deep Maroon Glass" },
      { label: "Layout", value: "Folding Carousel" }
    ],
    tags: ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "UI Animation"]
  },
  {
    id: "ecommerce-sales-performance",
    title: "Ecommerce Sales Performance",
    category: "analytics",
    categoryName: "Data Analytics & BI",
    date: "Jun 2026",
    featured: false,
    githubUrl: null,
    shortDescription: "A sales analytics project exploring ecommerce transactions, product performance, customer purchasing patterns, and revenue trends.",
    expandedDescription: "This project examines ecommerce sales data to explore transaction patterns, product categories, customer purchasing behaviour, and sales performance across the available records. The analysis can include data cleaning, aggregation, comparisons, and visualizations that make business information easier to understand. Its goal is to demonstrate a structured approach to preparing data and communicating analytical findings.",
    highlights: [
      "Analyzed transactional sales datasets to identify top product categories, regional demand distributions, and repeat purchase trends.",
      "Conducted ETL data transformation using Excel, SQL, and Python to clean customer records and order histories.",
      "Built executive Power BI summary dashboards with interactive filters for category benchmarking and revenue insights."
    ],
    metrics: [
      { label: "Focus", value: "Sales & Revenue" },
      { label: "Tools", value: "Excel • SQL • Power BI" },
      { label: "Workflow", value: "ETL & Analytics" }
    ],
    tags: ["Microsoft Excel", "SQL", "Python", "Power BI", "Data Cleaning", "Data Visualization"]
  }
];

function FlightPreview() {
  return (
    <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-[#1A060C] border border-[#B21F35]/20 flex items-center justify-center select-none group-hover:border-[#E05A75]/40 transition-colors">
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="flightGridApp" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E05A75" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#flightGridApp)" />
      </svg>
      <svg viewBox="0 0 420 180" className="w-full h-full relative z-10" fill="none">
        <circle cx="210" cy="90" r="75" stroke="rgba(224,90,117,0.12)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="210" cy="90" r="45" stroke="rgba(224,90,117,0.18)" strokeWidth="1" />
        <path d="M 40 130 Q 140 30 260 70" stroke="url(#flightGrad1App)" strokeWidth="2.5" className="flight-track-dash" />
        <path d="M 120 145 Q 260 40 380 95" stroke="url(#flightGrad2App)" strokeWidth="2.5" className="flight-track-dash" />
        <g transform="translate(40, 130)">
          <circle r="4" fill="#E05A75" />
          <circle r="8" fill="none" stroke="#E05A75" strokeWidth="1" opacity="0.6" />
          <text x="-12" y="18" fill="#F8F3F4" fontSize="9" fontFamily="monospace" fontWeight="bold">JFK</text>
        </g>
        <g transform="translate(260, 70)">
          <circle r="5" fill="#FECDD3" />
          <circle r="10" fill="none" stroke="#E05A75" strokeWidth="1" opacity="0.8" />
          <text x="8" y="4" fill="#F8F3F4" fontSize="9" fontFamily="monospace" fontWeight="bold">LHR</text>
        </g>
        <g transform="translate(120, 145)">
          <circle r="4" fill="#E05A75" />
          <text x="-10" y="16" fill="#F8F3F4" fontSize="9" fontFamily="monospace" fontWeight="bold">DXB</text>
        </g>
        <g transform="translate(380, 95)">
          <circle r="4.5" fill="#FECDD3" />
          <circle r="9" fill="none" stroke="#E05A75" strokeWidth="1" opacity="0.7" />
          <text x="-8" y="18" fill="#F8F3F4" fontSize="9" fontFamily="monospace" fontWeight="bold">SIN</text>
        </g>
        <g transform="translate(160, 52) rotate(18)">
          <path d="M0 -7 L4 3 L-4 3 Z" fill="#FFFFFF" />
          <circle r="10" fill="none" stroke="#FECDD3" strokeWidth="0.8" opacity="0.5" />
        </g>
        <path d="M 60 160 L 110 155 L 160 148 L 210 152 L 260 138 L 310 142 L 360 130" stroke="#E05A75" strokeWidth="1.8" />
        <path d="M 60 160 L 110 155 L 160 148 L 210 152 L 260 138 L 310 142 L 360 130 L 360 175 L 60 175 Z" fill="url(#sparkGradApp)" opacity="0.25" />
        <defs>
          <linearGradient id="flightGrad1App" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B21F35" />
            <stop offset="100%" stopColor="#E05A75" />
          </linearGradient>
          <linearGradient id="flightGrad2App" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#780000" />
            <stop offset="100%" stopColor="#FECDD3" />
          </linearGradient>
          <linearGradient id="sparkGradApp" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E05A75" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
        <span className="px-2.5 py-0.5 rounded-full bg-[#160508]/90 border border-[#B21F35]/40 text-[10px] font-mono text-[#FECDD3] tracking-wide">
          ✈ Route Profitability Analysis
        </span>
      </div>
      <div className="absolute bottom-3 right-3 z-20">
        <span className="px-2.5 py-0.5 rounded-full bg-[#160508]/90 border border-[#E05A75]/50 text-[10px] font-mono font-semibold text-white tracking-wide shadow-sm">
          1,200 Records Cleaned
        </span>
      </div>
    </div>
  );
}

function BikeSharingPreview() {
  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#1A060C] border border-[#B21F35]/20 flex items-center justify-center select-none group-hover:border-[#E05A75]/40 transition-colors">
      <svg viewBox="0 0 320 160" className="w-full h-full relative z-10" fill="none">
        <path d="M 20 40 L 300 40 M 20 80 L 300 80 M 20 120 L 300 120" stroke="rgba(224,90,117,0.12)" strokeWidth="0.8" />
        <path d="M 60 10 L 60 150 M 160 10 L 160 150 M 260 10 L 260 150" stroke="rgba(224,90,117,0.12)" strokeWidth="0.8" />
        <line x1="60" y1="80" x2="160" y2="40" stroke="#E05A75" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <line x1="160" y1="40" x2="260" y2="80" stroke="#E05A75" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <line x1="160" y1="40" x2="160" y2="120" stroke="#B21F35" strokeWidth="1.5" opacity="0.8" />
        <line x1="60" y1="80" x2="160" y2="120" stroke="#B21F35" strokeWidth="1.5" opacity="0.7" />
        <line x1="160" y1="120" x2="260" y2="80" stroke="#E05A75" strokeWidth="1.5" opacity="0.7" />
        <circle cx="160" cy="40" r="14" fill="rgba(224,90,117,0.15)" stroke="#E05A75" strokeWidth="1.2" />
        <circle cx="160" cy="40" r="6" fill="#FECDD3" />
        <circle cx="60" cy="80" r="5" fill="#E05A75" />
        <circle cx="260" cy="80" r="5" fill="#E05A75" />
        <circle cx="160" cy="120" r="6" fill="#B21F35" stroke="#E05A75" strokeWidth="1" />
        <circle cx="100" cy="40" r="3.5" fill="#FECDD3" opacity="0.8" />
        <circle cx="220" cy="120" r="3.5" fill="#FECDD3" opacity="0.8" />
      </svg>
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#B21F35]/40 text-[9px] font-mono text-[#FECDD3]">
          🚲 Urban Station Network
        </span>
      </div>
      <div className="absolute bottom-2.5 right-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#E05A75]/50 text-[9px] font-mono font-semibold text-white">
          2,856 Stations • Star Schema
        </span>
      </div>
    </div>
  );
}

function BloodDetectionPreview() {
  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#1A060C] border border-[#B21F35]/20 flex items-center justify-center select-none group-hover:border-[#E05A75]/40 transition-colors">
      <div className="scan-laser-line z-20 pointer-events-none" />
      <svg viewBox="0 0 320 160" className="w-full h-full relative z-10" fill="none">
        <path d="M 85 35 L 75 35 L 75 45 M 235 35 L 245 35 L 245 45 M 75 115 L 75 125 L 85 125 M 245 115 L 245 125 L 235 125" stroke="#E05A75" strokeWidth="1.8" />
        <ellipse cx="160" cy="80" rx="60" ry="42" stroke="rgba(224,90,117,0.3)" strokeWidth="1.2" strokeDasharray="8 4" />
        <ellipse cx="160" cy="80" rx="46" ry="32" stroke="rgba(224,90,117,0.5)" strokeWidth="1.4" />
        <ellipse cx="160" cy="80" rx="34" ry="24" stroke="rgba(254,205,211,0.7)" strokeWidth="1.4" strokeDasharray="14 3" />
        <ellipse cx="160" cy="80" rx="22" ry="16" stroke="#E05A75" strokeWidth="1.6" />
        <ellipse cx="160" cy="80" rx="10" ry="8" stroke="#FECDD3" strokeWidth="1.8" />
        <circle cx="138" cy="70" r="3.5" fill="#E05A75" />
        <circle cx="182" cy="88" r="3.5" fill="#FECDD3" />
        <circle cx="160" cy="58" r="2.5" fill="#E05A75" />
      </svg>
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#B21F35]/40 text-[9px] font-mono text-[#FECDD3]">
          🔬 Biometric CV Scan
        </span>
      </div>
      <div className="absolute bottom-2.5 right-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#E05A75]/50 text-[9px] font-mono font-semibold text-white">
          Experimental ML Workflow
        </span>
      </div>
    </div>
  );
}

function CrimePatternPreview() {
  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#1A060C] border border-[#B21F35]/20 flex items-center justify-center select-none group-hover:border-[#E05A75]/40 transition-colors">
      <svg viewBox="0 0 320 160" className="w-full h-full relative z-10" fill="none">
        <g stroke="rgba(224,90,117,0.12)" strokeWidth="0.8">
          <line x1="30" y1="20" x2="30" y2="140" />
          <line x1="90" y1="20" x2="90" y2="140" />
          <line x1="150" y1="20" x2="150" y2="140" />
          <line x1="210" y1="20" x2="210" y2="140" />
          <line x1="270" y1="20" x2="270" y2="140" />
        </g>
        <circle cx="110" cy="70" r="26" fill="rgba(178,31,53,0.2)" stroke="#B21F35" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="110" cy="70" r="14" fill="rgba(224,90,117,0.3)" />
        <circle cx="110" cy="70" r="4" fill="#FECDD3" />
        <circle cx="210" cy="85" r="32" fill="rgba(178,31,53,0.18)" stroke="#E05A75" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="210" cy="85" r="16" fill="rgba(224,90,117,0.35)" />
        <circle cx="210" cy="85" r="5" fill="#FFFFFF" />
        <path d="M 40 120 Q 120 40 280 80" stroke="#E05A75" strokeWidth="1.8" />
        <circle cx="280" cy="80" r="3" fill="#E05A75" />
        <circle cx="40" cy="120" r="3" fill="#E05A75" />
      </svg>
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#B21F35]/40 text-[9px] font-mono text-[#FECDD3]">
          📊 Spatial Cluster Grid
        </span>
      </div>
      <div className="absolute bottom-2.5 right-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#E05A75]/50 text-[9px] font-mono font-semibold text-white">
          Pattern Analysis &amp; Trends
        </span>
      </div>
    </div>
  );
}

function PortfolioPreview() {
  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#1A060C] border border-[#B21F35]/20 flex items-center justify-center select-none group-hover:border-[#E05A75]/40 transition-colors">
      <div className="w-[88%] h-[82%] rounded-xl bg-[#120609] border border-[#B21F35]/40 p-2.5 flex flex-col justify-between shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#B21F35]/25">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E05A75]" />
            <span className="w-2 h-2 rounded-full bg-[#B21F35]" />
            <span className="w-2 h-2 rounded-full bg-[#780000]" />
          </div>
          <span className="text-[8px] font-mono text-[#BBA6AC]">sharnitha.portfolio</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-2 space-y-1.5">
          <div className="h-1.5 w-16 rounded-full bg-[#FECDD3]/70" />
          <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-[#B21F35] to-[#E05A75]" />
          <div className="flex gap-1.5 pt-1">
            <div className="h-4 w-12 rounded-md bg-[#2A0812] border border-[#B21F35]/30" />
            <div className="h-4 w-12 rounded-md bg-[#2A0812] border border-[#B21F35]/30" />
            <div className="h-4 w-12 rounded-md bg-[#2A0812] border border-[#B21F35]/30" />
          </div>
        </div>
      </div>
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#B21F35]/40 text-[9px] font-mono text-[#FECDD3]">
          💻 Developer Showcase
        </span>
      </div>
      <div className="absolute bottom-2.5 right-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#E05A75]/50 text-[9px] font-mono font-semibold text-white">
          React &amp; Glassmorphism
        </span>
      </div>
    </div>
  );
}

function EcommercePreview() {
  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#1A060C] border border-[#B21F35]/20 flex items-center justify-center select-none group-hover:border-[#E05A75]/40 transition-colors">
      <svg viewBox="0 0 320 160" className="w-full h-full relative z-10" fill="none">
        <line x1="30" y1="125" x2="290" y2="125" stroke="rgba(224,90,117,0.2)" strokeWidth="1" />
        <line x1="30" y1="85" x2="290" y2="85" stroke="rgba(224,90,117,0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="30" y1="45" x2="290" y2="45" stroke="rgba(224,90,117,0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
        <rect x="50" y="70" width="18" height="55" rx="3" fill="url(#barGrad1App)" />
        <rect x="85" y="50" width="18" height="75" rx="3" fill="url(#barGrad2App)" />
        <rect x="120" y="80" width="18" height="45" rx="3" fill="url(#barGrad1App)" />
        <rect x="155" y="40" width="18" height="85" rx="3" fill="url(#barGrad2App)" />
        <rect x="190" y="60" width="18" height="65" rx="3" fill="url(#barGrad1App)" />
        <rect x="225" y="35" width="18" height="90" rx="3" fill="url(#barGrad2App)" />
        <rect x="260" y="55" width="18" height="70" rx="3" fill="url(#barGrad1App)" />
        <path d="M 59 65 L 94 45 L 129 75 L 164 35 L 199 55 L 234 30 L 269 50" stroke="#FECDD3" strokeWidth="2" />
        <circle cx="234" cy="30" r="3.5" fill="#FFFFFF" stroke="#E05A75" strokeWidth="1" />
        <defs>
          <linearGradient id="barGrad1App" x1="0%" y1="0%" x2="0%" y2="1">
            <stop offset="0%" stopColor="#E05A75" />
            <stop offset="100%" stopColor="#780000" />
          </linearGradient>
          <linearGradient id="barGrad2App" x1="0%" y1="0%" x2="0%" y2="1">
            <stop offset="0%" stopColor="#FECDD3" />
            <stop offset="100%" stopColor="#B21F35" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#B21F35]/40 text-[9px] font-mono text-[#FECDD3]">
          📈 Revenue Distribution
        </span>
      </div>
      <div className="absolute bottom-2.5 right-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full bg-[#160508]/90 border border-[#E05A75]/50 text-[9px] font-mono font-semibold text-white">
          Sales Performance Analytics
        </span>
      </div>
    </div>
  );
}

function ProjectsSection({ setSelectedProject }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const containerRef = useRef(null);
  const slatRefs = useRef([]);
  const foldRef = useRef({ p: 0, v: 0, target: 0, anchor: 0 });
  const dragRef = useRef({ on: false, x: 0, t: 0, vel: 0, moved: 0 });
  const n = PROJECTS_DATA.length;

  useEffect(() => {
    let rafId;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const foldS = foldRef.current;
      const dragging = dragRef.current.on;

      if (!dragging) {
        const Kf = 170 * 0.55;
        const Cf = 17 * 0.6;
        const sub = 1 / 240;
        const steps = dt > sub ? Math.ceil(dt / sub) : 1;
        const h = dt / steps;
        for (let s = 0; s < steps; s++) {
          foldS.v += (Kf * (foldS.target - foldS.p) - Cf * foldS.v) * h;
          foldS.p += foldS.v * h;
        }
        if (Math.abs(foldS.target - foldS.p) < 0.0005 && Math.abs(foldS.v) < 0.005) {
          foldS.p = foldS.target;
          foldS.v = 0;
        }
      }

      const curIdx = ((Math.round(foldS.p) % n) + n) % n;
      setActiveIndex((prev) => (prev !== curIdx ? curIdx : prev));

      const rootW = containerRef.current ? containerRef.current.clientWidth : 900;
      const isMobile = rootW < 640;
      const foldW = isMobile ? Math.min(rootW - 48, 360) : Math.max(300, Math.min(540, rootW * 0.44));
      const foldH = isMobile ? 540 : 580;

      for (let i = 0; i < n; i++) {
        const el = slatRefs.current[i];
        if (!el) continue;

        let fd = ((i - foldS.p) % n + n) % n;
        if (fd > n / 2) fd -= n;
        const ad = Math.abs(fd);
        const sd2 = fd < 0 ? -1 : 1;

        const wing = (q) => ({
          x: foldW / 2 + (foldW * (0.12 + 0.075 * Math.min(q, 4)) + 6 * Math.min(q, 4)) + 8,
          rot: 62 + Math.min(q, 2) * 8,
          sc: 0.66 - Math.min(q, 3) * 0.035,
          z: -(60 + Math.min(q, 4) * 30)
        });

        let x, rot, sc, z;
        if (ad < 1) {
          const w0 = wing(0);
          x = w0.x * ad;
          rot = w0.rot * ad;
          sc = 1 + (w0.sc - 1) * ad;
          z = w0.z * ad;
        } else {
          const q = Math.floor(ad - 1);
          const f = ad - 1 - q;
          const a0 = wing(q);
          const a1 = wing(q + 1);
          x = a0.x + (a1.x - a0.x) * f;
          rot = a0.rot + (a1.rot - a0.rot) * f;
          sc = a0.sc + (a1.sc - a0.sc) * f;
          z = a0.z + (a1.z - a0.z) * f;
        }

        const op = Math.max(0, Math.min(1, 3.4 - ad));
        el.style.width = foldW.toFixed(0) + 'px';
        el.style.height = foldH.toFixed(0) + 'px';
        el.style.transform = 'translate(-50%, -50%) translateX(' + (sd2 * x).toFixed(1) + 'px) translateZ(' + z.toFixed(1) + 'px) rotateY(' + (-sd2 * rot).toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
        el.style.zIndex = String(40 - Math.round(ad * 2));
        el.style.opacity = op.toFixed(3);
        el.style.pointerEvents = op > 0.1 ? 'auto' : 'none';

        // Fold shading & dimming
        const dimOverlay = el.querySelector('.blind-fold-dim-overlay');
        if (dimOverlay) {
          dimOverlay.style.opacity = (Math.min(ad, 1.2) * 0.45).toFixed(2);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [n]);

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('button, a, input')) return;
    const d = dragRef.current;
    d.on = true;
    d.x = e.clientX;
    d.t = performance.now();
    d.vel = 0;
    d.moved = 0;
    const f = foldRef.current;
    f.anchor = Math.round(f.p);
    f.v = 0;
    if (containerRef.current && containerRef.current.setPointerCapture) {
      try { containerRef.current.setPointerCapture(e.pointerId); } catch(err){}
    }
  };

  const handlePointerMove = (e) => {
    const d = dragRef.current;
    if (!d.on) return;
    const dx = e.clientX - d.x;
    d.moved += Math.abs(dx);
    const now = performance.now();
    const dt = Math.max(1, now - d.t);
    d.vel = (dx / dt) * 1000;
    d.x = e.clientX;
    d.t = now;

    const rootW = containerRef.current ? containerRef.current.clientWidth : 900;
    const foldW = rootW < 640 ? Math.min(rootW - 48, 360) : Math.max(300, Math.min(540, rootW * 0.44));
    const f = foldRef.current;
    f.p = Math.max(f.anchor - 3.2, Math.min(f.anchor + 3.2, f.p - dx / (foldW * 0.9)));
  };

  const handlePointerUp = () => {
    const d = dragRef.current;
    if (!d.on) return;
    d.on = false;
    const rootW = containerRef.current ? containerRef.current.clientWidth : 900;
    const foldW = rootW < 640 ? Math.min(rootW - 48, 360) : Math.max(300, Math.min(540, rootW * 0.44));
    const f = foldRef.current;
    const vu = Math.max(-6, Math.min(6, -d.vel / (foldW * 0.9)));
    const delta = Math.max(-3, Math.min(3, f.p + vu * 0.18 - f.anchor));
    f.target = f.anchor + Math.round(delta);
    f.v = vu;
  };

  const handleSlatClick = (i) => {
    if (dragRef.current.moved > 8) return;
    const f = foldRef.current;
    const base = Math.round(f.p);
    let off = ((i - base) % n + n) % n;
    if (off > n / 2) off -= n;
    if (off !== 0) {
      f.target = base + off;
    }
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    const f = foldRef.current;
    f.target = Math.round(f.target) - 1;
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    const f = foldRef.current;
    f.target = Math.round(f.target) + 1;
  };

  const handleDotClick = (i, e) => {
    if (e) e.stopPropagation();
    const f = foldRef.current;
    const base = Math.round(f.p);
    let off = ((i - base) % n + n) % n;
    if (off > n / 2) off -= n;
    f.target = base + off;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const renderCover = (projectId) => {
    switch (projectId) {
      case 'flight-booking-analytics':
        return <FlightPreview />;
      case 'smart-city-bike-sharing':
        return <BikeSharingPreview />;
      case 'fingerprint-blood-detection':
        return <BloodDetectionPreview />;
      case 'crime-pattern-detection':
        return <CrimePatternPreview />;
      case 'my-portfolio':
        return <PortfolioPreview />;
      case 'ecommerce-sales-performance':
        return <EcommercePreview />;
      default:
        return <FlightPreview />;
    }
  };

  return (
    <section
      id="projects"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="scroll-mt-24 pt-20 pb-8 sm:pb-10 px-4 sm:px-6 max-w-7xl mx-auto w-full relative focus:outline-none overflow-x-clip"
    >
      {/* Section Heading & Intro */}
      <div className="flex flex-col items-center justify-center text-center mb-10 select-none">
        <span className="text-[10px] font-mono tracking-[0.35em] uppercase font-semibold text-[#FECDD3]/80">
          PORTFOLIO
        </span>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1 text-white"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.01em' }}
        >
          Projects &amp; Work
        </h2>
        <div className="flex items-center justify-center gap-1.5 pt-2 mb-3">
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #B21F35, #E05A75)' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A75] shadow-[0_0_8px_rgba(224,90,117,0.9)]" />
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #E05A75, #B21F35, transparent)' }} />
        </div>
        <p className="text-sm sm:text-base text-[#BBA6AC] max-w-2xl mx-auto font-normal">
          Explore my projects across data analytics, machine learning, computer vision, and web development. Each project reflects my interest in turning data, ideas, and technology into practical solutions.
        </p>
      </div>

      {/* Feral UI Blinds - Fold Viewport (https://feralui.dev/blinds?v=fold) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="bld bld--fold relative w-full h-[620px] sm:h-[640px] select-none"
      >
        <div className="bld-track">
          {PROJECTS_DATA.map((proj, idx) => {
            const isCurrent = activeIndex === idx;
            const isExpanded = expandedId === proj.id;

            return (
              <article
                key={proj.id}
                ref={(el) => (slatRefs.current[idx] = el)}
                onClick={() => handleSlatClick(idx)}
                className={`bld-slat group ${isCurrent ? 'is-active cursor-default' : 'cursor-pointer'} transition-colors`}
                tabIndex={isCurrent ? 0 : -1}
                aria-expanded={isCurrent}
              >
                {/* Fold Dimming Overlay for realistic 3D depth */}
                <div className="blind-fold-dim-overlay bg-black pointer-events-none" />

                {/* Dedicated Cover Image at Top */}
                <div className="relative w-full h-36 sm:h-40 overflow-hidden rounded-t-[1.5rem] border-b border-[#B21F35]/25 bg-[#1A060C] flex-shrink-0">
                  <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                    {renderCover(proj.id)}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#160508]/90 to-transparent pointer-events-none" />
                </div>

                {/* Project Card Content */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 overflow-hidden">
                  <div className="space-y-2.5">
                    {/* Category & Slide Tag */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#160508]/90 text-[#FECDD3] border border-[#B21F35]/40 text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-wider uppercase">
                        {proj.categoryName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#780000]/30 border border-[#B21F35]/35 text-[9.5px] font-mono text-[#FDA4AF] font-semibold">
                        0{idx + 1} / 0{n}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base sm:text-lg font-bold text-white group-hover:text-[#FECDD3] transition-colors leading-snug tracking-tight line-clamp-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {proj.title}
                    </h3>

                    {/* Description with Expand toggle */}
                    <div className="space-y-2">
                      <p className="text-xs sm:text-[13px] text-[#C6B2B8] leading-relaxed line-clamp-2">
                        {isExpanded ? proj.expandedDescription : proj.shortDescription}
                      </p>

                      {isExpanded && (
                        <div className="max-h-28 overflow-y-auto space-y-2 pr-1 pt-1 border-t border-[#B21F35]/20 animate-fadeIn text-xs">
                          {proj.highlights && proj.highlights.length > 0 && (
                            <ul className="space-y-1 text-[#E5D7DA]/90">
                              {proj.highlights.map((h, hIdx) => (
                                <li key={hIdx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                                  <span className="text-[#E05A75] font-bold">›</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : proj.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FDA4AF] hover:text-white transition-colors focus:outline-none"
                      >
                        <span>{isExpanded ? 'SHOW LESS' : 'READ MORE'}</span>
                        <span className="text-[10px] transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ↓
                        </span>
                      </button>
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {proj.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9.5px] px-2 py-0.5 rounded-md bg-[#160508]/90 border border-[#B21F35]/30 text-[#FECDD3] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                      {proj.tags.length > 4 && (
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-[#160508]/60 text-[#BBA6AC] font-mono">
                          +{proj.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions: Verified GitHub ONLY */}
                  <div className="pt-2.5 mt-2 border-t border-[#B21F35]/20 flex items-center justify-between">
                    {proj.githubUrl ? (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${proj.title} on GitHub`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2A0812] hover:bg-[#780000] border border-[#B21F35]/50 hover:border-[#E05A75] text-[#F8F1F3] text-[11px] font-semibold tracking-wider transition-all shadow-[0_0_10px_rgba(178,31,53,0.25)] hover:shadow-[0_0_15px_rgba(224,90,117,0.45)] group/btn"
                      >
                        <Github className="w-3.5 h-3.5 text-[#E05A75] group-hover/btn:text-white transition-colors" />
                        <span>VIEW ON GITHUB</span>
                        <span className="text-[10px] group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <div className="text-[10px] font-mono text-[#BBA6AC]/60 italic flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B21F35]/40" />
                        <span>Project Showcase</span>
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-[#BBA6AC]/70">
                      Project {idx + 1} of {n}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Prev Button */}
        <button
          type="button"
          className="bld-nav bld-nav--prev"
          aria-label="Previous card"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handlePrev}
        >
          <ChevronLeft className="w-5 h-5 text-[#FECDD3]" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          className="bld-nav bld-nav--next"
          aria-label="Next card"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleNext}
        >
          <ChevronRight className="w-5 h-5 text-[#FECDD3]" />
        </button>

        {/* Pagination Dots (Feral UI Blinds Stretching Pill) */}
        <div className="bld-dots" role="group" aria-label="Projects pagination">
          {PROJECTS_DATA.map((proj, i) => (
            <button
              key={proj.id}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              className={`bld-dot ${i === activeIndex ? 'is-on' : ''}`}
              aria-label={`Go to ${proj.title}`}
              onClick={(e) => handleDotClick(i, e)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="scroll-mt-24 pt-6 sm:pt-8 pb-8 sm:pb-10 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
      {/* SVG Displacement Filter definition for subtle Liquid Glass distortion */}
      <svg className="hidden pointer-events-none absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
        <defs>
          <filter id="liquid-glass-displacement" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Section Heading matching refined heading language */}
      <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-12 select-none">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] uppercase font-semibold text-[#FECDD3]/80">
          CAREER / EXPERIENCE
        </span>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1.5 text-white"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.01em' }}
        >
          Where I&apos;ve Gained Experience.
        </h2>
        {/* Subtle crimson-to-rose gradient divider with single glowing rose accent dot */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #B21F35, #E05A75)' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A75] shadow-[0_0_8px_rgba(224,90,117,0.9)]" />
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #E05A75, #B21F35, transparent)' }} />
        </div>
        <p className="text-xs sm:text-sm text-[#FECDD3]/80 max-w-xl mx-auto mt-2 font-medium">
          Learning by building. Growing through experience.
        </p>
      </div>

      {/* Two side-by-side Liquid Glass cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
        {siteConfig.experience.map((exp) => {
          const isExpanded = expandedId === exp.id;
          return (
            <article
              key={exp.id}
              className="liquid-glass-card rounded-3xl p-6 sm:p-8 md:p-9 relative flex flex-col justify-between transition-all duration-300"
            >
              {/* Internal Sheen Reflection */}
              <div className="liquid-glass-reflection" />

              {/* Restrained specular light spots near edges */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-52 h-52 bg-gradient-to-br from-[#E05A75]/20 to-transparent rounded-full blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 w-52 h-52 bg-gradient-to-tr from-[#780000]/30 to-transparent rounded-full blur-2xl" />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Top Row: Internship Badge & Numbered Label (01 / 02) */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#780000]/60 border border-[#E05A75]/40 text-[#FECDD3] shadow-[0_0_12px_rgba(224,90,117,0.25)]">
                    {exp.type || 'INTERNSHIP'}
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#FECDD3]/80 bg-black/40 border border-[#E05A75]/30 px-3 py-0.5 rounded-full shadow-inner">
                    {exp.number}
                  </span>
                </div>

                {/* Company Logo, Name & Role Header */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Logo Container: object-fit contain, subtle dark translucent container */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/55 border border-[#E05A75]/35 p-2 flex items-center justify-center shrink-0 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)] overflow-hidden">
                    <img
                      src={exp.logo}
                      alt={`${exp.company} Logo`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        if (exp.remoteLogo && e.currentTarget.src !== exp.remoteLogo) {
                          e.currentTarget.src = exp.remoteLogo;
                        } else {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement.querySelector('.logo-fallback');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                    <div className="logo-fallback hidden w-full h-full items-center justify-center text-xs font-bold font-mono text-[#FECDD3]">
                      {exp.company.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-[#FECDD3]/90 tracking-wide truncate">
                      {exp.company}
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight mt-0.5 leading-snug">
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] sm:text-xs text-brand-textDim font-medium">
                      <span className="inline-flex items-center gap-1.5 text-[#FECDD3]/80">
                        <svg className="w-3.5 h-3.5 text-[#E05A75]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                          <line x1="16" x2="16" y1="2" y2="6"/>
                          <line x1="8" x2="8" y1="2" y2="6"/>
                          <line x1="3" x2="21" y1="10" y2="10"/>
                        </svg>
                        {exp.period}
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="inline-flex items-center gap-1 text-brand-textDim">
                        <svg className="w-3.5 h-3.5 text-[#E05A75]/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {exp.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Responsibilities */}
                <div className="mb-5 flex-1">
                  <ul className="space-y-2.5 text-xs sm:text-[13px] text-brand-textMuted leading-relaxed">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2.5">
                        <span className="text-[#E05A75] mt-1 shrink-0 font-bold select-none text-xs">✦</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verified Skill Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                  {exp.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-black/40 border border-[#E05A75]/25 text-[#FECDD3]/90 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Expandable Key Deliverables */}
                {isExpanded && (
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-black/50 border border-[#E05A75]/35 space-y-2.5 transition-all">
                    <div className="text-[11px] font-mono tracking-wider uppercase font-semibold text-[#FECDD3] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E05A75] shadow-[0_0_8px_rgba(224,90,117,0.8)]" />
                      Key Technical Deliverables &amp; Competencies
                    </div>
                    <ul className="space-y-2 text-xs sm:text-[13px] text-brand-textDim leading-relaxed pt-1">
                      {exp.id === 'decodelabs' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#E05A75] font-bold">›</span>
                            <span>Exploratory analysis of structured data pipelines and business metrics.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#E05A75] font-bold">›</span>
                            <span>Pattern recognition, anomaly detection, and cross-functional reporting.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#E05A75] font-bold">›</span>
                            <span>Translation of raw statistical findings into actionable analytical summaries.</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-[#E05A75] font-bold">›</span>
                            <span>End-to-end RESTful API architectures with Node.js, Express, and structured JSON payloads.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#E05A75] font-bold">›</span>
                            <span>Database modeling, schema design, and queries across MongoDB and MySQL.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#E05A75] font-bold">›</span>
                            <span>Responsive user interface components aligned with Agile team delivery.</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}

                {/* Footer with Liquid Glass CTA button */}
                <div className="pt-4 border-t border-[#E05A75]/20 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(exp.id)}
                    aria-expanded={isExpanded}
                    className="liquid-glass-btn group px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider text-white inline-flex items-center gap-2 select-none"
                  >
                    <span>{isExpanded ? 'COLLAPSE DETAILS' : 'EXPLORE EXPERIENCE'}</span>
                    <span className={`transition-transform duration-300 font-mono ${isExpanded ? '-rotate-45' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}>
                      ↗
                    </span>
                  </button>
                  <span className="text-[11px] font-mono text-[#FECDD3]/60 hidden sm:inline-block">
                    {isExpanded ? 'Showing detailed highlights' : 'Verified industry experience'}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EducationSection() {
  const [entriExpanded, setEntriExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const winHeight = window.innerHeight;
      // Start tracking when top of timeline reaches middle of viewport
      const start = winHeight * 0.55;
      const current = start - rect.top;
      const total = rect.height;
      if (total > 0) {
        let progress = current / total;
        progress = Math.max(0, Math.min(1, progress));
        setScrollProgress(progress);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="education" className="scroll-mt-24 pt-6 sm:pt-8 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
      {/* Subtle cosmic background ambient glow */}
      <div 
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(178,31,53,0.18) 0%, rgba(120,0,0,0.08) 50%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />

      {/* Main Section Heading: Centered Academic Background */}
      <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-14 select-none">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] uppercase font-semibold text-[#FECDD3]/80">
          ACADEMIC PATHWAY
        </span>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1.5 text-white"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.01em' }}
        >
          Academic Background
        </h2>
        {/* Subtle crimson-to-rose gradient divider with single glowing rose accent dot */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #B21F35, #E05A75)' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A75] shadow-[0_0_8px_rgba(224,90,117,0.9)]" />
          <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #E05A75, #B21F35, transparent)' }} />
        </div>
        <p className="text-xs sm:text-sm text-[#FECDD3]/80 max-w-xl mx-auto mt-2 font-medium">
          Foundations in computing, analytical reasoning, and specialized data engineering.
        </p>
      </div>

      {/* Single, Centered Academic Background Timeline */}
      <div className="max-w-3xl sm:max-w-4xl mx-auto w-full relative z-10">
        <div 
          ref={timelineRef}
          className="relative pl-10 sm:pl-16 space-y-7 sm:space-y-8"
        >
          {/* Thin, elegant crimson vertical timeline line */}
          <div 
            className="absolute left-3.5 sm:left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#E05A75]/60 via-[#B21F35]/40 to-[#780000]/20 shadow-[0_0_8px_rgba(224,90,117,0.3)] pointer-events-none" 
          />

          {/* Single glowing red accent dot that moves vertically along the timeline as user scrolls */}
          <div
            className="absolute left-3.5 sm:left-5 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E05A75] shadow-[0_0_14px_rgba(224,90,117,1),0_0_22px_rgba(224,90,117,0.6)] border border-white/80 pointer-events-none z-20 transition-all duration-75"
            style={{ 
              top: `${Math.max(4, Math.min(scrollProgress * 100, 96))}%`
            }}
          >
            <span className="absolute inset-0.5 rounded-full bg-white/90 animate-pulse" />
          </div>

          {/* ========================================================
              CARD 1: AI-Driven Data Analytics | Entri Elevate
              ======================================================== */}
          <div className="relative group">
            <div 
              tabIndex={0}
              role="button"
              aria-expanded={entriExpanded}
              onClick={() => setEntriExpanded(!entriExpanded)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setEntriExpanded(!entriExpanded);
                }
              }}
              className="liquid-glass-card p-6 sm:p-7 rounded-2xl relative transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E05A75]/60"
            >
              <div className="liquid-glass-reflection" />
              <div className="relative z-10 space-y-4">
                
                {/* Header: Status badge (GREEN) & Date */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    IN PROGRESS
                  </span>
                  <span className="text-xs sm:text-sm text-brand-textDim font-medium font-mono">
                    Jul 2026 – Dec 2026
                  </span>
                </div>

                {/* Main Identity: Circular Entri Logo, Institution & Program */}
                <div className="flex items-center gap-4 pt-1">
                  {/* Circular Logo Container */}
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-black/60 border border-[#E05A75]/35 p-2 flex items-center justify-center shrink-0 backdrop-blur-md shadow-md overflow-hidden">
                    <img
                      src="assets/entri-elevate-logo.png"
                      alt="Entri Elevate Logo"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const remote = "https://media.licdn.com/dms/image/v2/D560BAQEzU6Cqt9-_VA/company-logo_200_200/B56ZoLMnzcJYAI-/0/1761124450201/entri_elevate_logo?e=2147483647&v=beta&t=S7TVBeT3JBOfiVZ6x553W31vOq7UqABppOgfpxGjOX0";
                        if (e.currentTarget.src !== remote) {
                          e.currentTarget.src = remote;
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-[#FECDD3]/80">
                      Entri Elevate
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                      AI-Driven Data Analytics
                    </h3>
                  </div>
                  {/* Rotating Chevron for Expand/Collapse (No text instruction) */}
                  <div className="shrink-0 pl-2">
                    <span 
                      className={`inline-block text-[#E05A75] text-lg font-mono transition-transform duration-300 ${entriExpanded ? 'rotate-180' : 'rotate-0'}`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* Interactive Downward Expansion: What I'm Learning */}
                {entriExpanded && (
                  <div className="pt-3 border-t border-[#E05A75]/20 space-y-3 transition-all animate-fadeIn">
                    <div className="text-xs font-bold text-[#FECDD3] tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E05A75]" />
                      <span>What I&apos;m Learning</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-brand-textDim leading-relaxed">
                      Developing practical data analysis, reporting, and visualization skills through hands-on predictive workflows, database querying, and executive KPI dashboard creation.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Excel", "Power BI", "SQL", "Python", "Power Query", "Data Modeling"].map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-black/40 border border-[#E05A75]/25 text-[#FECDD3]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 2: Bachelor of Computer Science (BSc CS)
              ======================================================== */}
          <div className="relative group">
            <div className="liquid-glass-card p-6 sm:p-7 rounded-2xl relative transition-all duration-300">
              <div className="liquid-glass-reflection" />
              <div className="relative z-10 space-y-4">
                
                {/* Header: Completed badge in distinct color (Sky/Cyan) & Dates */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-sky-950/50 border border-sky-400/40 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.25)]">
                      COMPLETED
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-brand-textDim font-medium font-mono">
                    Jun 2023 – May 2026
                  </span>
                </div>

                {/* Main Identity: Circular PSG Logo, Institution, Degree & CGPA */}
                <div className="flex items-start gap-4 pt-1">
                  {/* Circular Logo Container */}
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-black/60 border border-[#E05A75]/35 p-2 flex items-center justify-center shrink-0 backdrop-blur-md shadow-md overflow-hidden">
                    <img
                      src="assets/psg-logo.png"
                      alt="PSG College of Arts and Science Logo"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const remote = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu4jJIN6rskrfqPVUf0-AfpIOoX3wzUZxlMaKR79CX6XVuFxTmVgIwh4sL&s=10";
                        if (e.currentTarget.src !== remote) {
                          e.currentTarget.src = remote;
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-[#FECDD3]/80">
                      PSG College of Arts and Science
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                      Bachelor of Computer Science (BSc CS)
                    </h3>

                    {/* Prominently Highlighted Verified CGPA */}
                    <div className="mt-2.5">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#780000]/40 border border-[#E05A75]/40 text-[#FECDD3] font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(224,90,117,0.25)]">
                        <span className="w-2 h-2 rounded-full bg-[#E05A75] shadow-[0_0_6px_#E05A75]" />
                        <span>CGPA: 8.0 / 10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Highlights & Curriculum */}
                <div className="pt-2 border-t border-[#E05A75]/15 space-y-2">
                  <p className="text-xs sm:text-[13px] text-brand-textDim leading-relaxed">
                    Rigorous computer science curriculum emphasizing Database Management Systems (DBMS), Data Structures, Algorithms, Software Engineering, and Object-Oriented Programming.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["DBMS", "Data Structures", "Algorithms", "Software Engineering", "OOP"].map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-black/35 border border-[#E05A75]/20 text-[#FECDD3]/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 3: Higher Studies | Vidya Mandir
              ======================================================== */}
          <div className="relative group">
            <div className="liquid-glass-card p-6 sm:p-7 rounded-2xl relative transition-all duration-300">
              <div className="liquid-glass-reflection" />
              <div className="relative z-10 space-y-4">
                
                {/* Header: Completed badge in distinct color (Sky/Cyan) & Dates */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-sky-950/50 border border-sky-400/40 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.25)]">
                      COMPLETED
                    </span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-brand-textDim px-2.5 py-0.5 rounded-md bg-black/30 border border-white/10">
                      Higher Secondary
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-brand-textDim font-medium font-mono">
                    Jun 2022 – Mar 2023
                  </span>
                </div>

                {/* Main Identity: Circular Vidya Mandhir Logo, Institution, Program & 82% */}
                <div className="flex items-start gap-4 pt-1">
                  {/* Circular Logo Container */}
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-black/60 border border-[#E05A75]/35 p-2 flex items-center justify-center shrink-0 backdrop-blur-md shadow-md overflow-hidden">
                    <img
                      src="assets/vidyamandhir-logo.png"
                      alt="Vidya Mandhir Logo"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const remote = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbKWO4OtSgNQ4gIRCBNh8xpZWt9r6u0DOOMuZ9G1bJEXLxfJ1R-CsmmGb&s=10";
                        if (e.currentTarget.src !== remote) {
                          e.currentTarget.src = remote;
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-[#FECDD3]/80">
                      Vidya Mandir Matriculation Higher Secondary School
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                      Higher Studies
                    </h3>

                    {/* Prominently Highlighted Confirmed 82% */}
                    <div className="mt-2.5">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#780000]/40 border border-[#E05A75]/40 text-[#FECDD3] font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(224,90,117,0.25)]">
                        <span className="w-2 h-2 rounded-full bg-[#E05A75] shadow-[0_0_6px_#E05A75]" />
                        <span>Score: 82%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Highlights & Coursework */}
                <div className="pt-2 border-t border-[#E05A75]/15 space-y-2">
                  <p className="text-xs sm:text-[13px] text-brand-textDim leading-relaxed">
                    Foundational coursework in Computer Science, Mathematics, and Physics with strong analytical foundation.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Computer Science", "Mathematics", "Physics", "Analytical Foundation"].map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-black/35 border border-[#E05A75]/20 text-[#FECDD3]/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ========================================================
// Scroll-Driven Horizontal Certificate Gallery & Preview Modal
// ========================================================
function CertificatesSection() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [containerHeight, setContainerHeight] = useState('280vh');
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const certificates = siteConfig.certificates || [];

  // Dynamic calculations for horizontal travel distance and scroll duration
  const updateLayout = () => {
    if (!trackRef.current || !containerRef.current) return;
    const trackWidth = trackRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const maxScroll = Math.max(0, trackWidth - viewportWidth);

    if (maxScroll <= 0) {
      setContainerHeight('auto');
    } else {
      // Set container height so vertical scroll length maps smoothly to horizontal track travel
      // 1.25 multiplier ensures comfortable pace across desktop, tablet, and mobile
      const scrollRange = Math.round(maxScroll * 1.25);
      setContainerHeight(`${window.innerHeight + scrollRange}px`);
    }
  };

  // Synchronize vertical scroll position to horizontal translation
  const updateScrollProgress = () => {
    if (!containerRef.current || !trackRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDist = rect.height - windowH;

    if (totalDist <= 0) {
      trackRef.current.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    // Amount scrolled through the pinned container
    const current = -rect.top;
    const progress = Math.min(Math.max(current / totalDist, 0), 1);

    const trackWidth = trackRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const maxScroll = Math.max(0, trackWidth - viewportWidth);

    const x = progress * maxScroll;
    trackRef.current.style.transform = `translate3d(-${x}px, 0, 0)`;
  };

  useEffect(() => {
    updateLayout();
    updateScrollProgress();

    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    const onResize = () => {
      updateLayout();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      ro = new ResizeObserver(() => {
        updateLayout();
        updateScrollProgress();
      });
      ro.observe(trackRef.current);
    }

    // Safety checks for layout stabilization
    const t1 = setTimeout(() => { updateLayout(); updateScrollProgress(); }, 120);
    const t2 = setTimeout(() => { updateLayout(); updateScrollProgress(); }, 600);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Keyboard accessibility for modal preview (Escape to close)
  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  return (
    <section
      id="certificates"
      ref={containerRef}
      style={{ height: containerHeight }}
      className="relative w-full"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Subtle cosmic background ambient glow */}
        <div 
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(178,31,53,0.12) 0%, rgba(120,0,0,0.05) 50%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Section Heading: Centered Certificates */}
        <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 md:mb-10 select-none px-4 shrink-0">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white"
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.01em' }}
          >
            Certificates
          </h2>
          {/* Subtle crimson-to-rose gradient divider with single glowing rose accent dot */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #B21F35, #E05A75)' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E05A75] shadow-[0_0_8px_rgba(224,90,117,0.9)]" />
            <div className="h-[1.5px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #E05A75, #B21F35, transparent)' }} />
          </div>
        </div>

        {/* Horizontal Track Viewport */}
        <div className="w-full overflow-hidden">
          <div
            ref={trackRef}
            style={{ willChange: 'transform' }}
            className="flex items-center gap-6 sm:gap-8 md:gap-10 px-6 sm:px-12 md:px-20 w-max select-none"
          >
            {certificates.map((cert) => (
              <div
                key={cert.id}
                tabIndex={0}
                role="button"
                aria-label={`View ${cert.title || 'Certificate'}`}
                onClick={() => setSelectedCert(cert)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCert(cert);
                  }
                }}
                className="shrink-0 focus:outline-none focus:ring-2 focus:ring-[#E05A75]/60 rounded-xl cursor-pointer group"
              >
                <img
                  src={cert.image}
                  alt={cert.title || 'Certificate'}
                  loading="eager"
                  onLoad={() => {
                    updateLayout();
                    updateScrollProgress();
                  }}
                  className="h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px] max-h-[52vh] w-auto max-w-none shrink-0 object-contain rounded-xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-300 pointer-events-auto"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('public/')) {
                      e.currentTarget.src = 'public/' + cert.image;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Click-to-Open Large Preview Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview"
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] max-w-[94vw] flex items-center justify-center"
          >
            {/* Minimal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              aria-label="Close certificate preview"
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-white/20 text-white/90 hover:text-white hover:border-white/50 hover:bg-[#780000]/80 flex items-center justify-center text-lg transition-all shadow-xl z-10 cursor-pointer"
            >
              ✕
            </button>

            {/* Original Certificate Image */}
            <img
              src={selectedCert.image}
              alt={selectedCert.title || 'Certificate'}
              className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                if (!e.currentTarget.src.includes('public/')) {
                  e.currentTarget.src = 'public/' + selectedCert.image;
                }
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [activeNav, setActiveNav] = useState('#hero');

  // Mouse tracking ref for zero-lag character head rotation & magnetic cursor
  const mousePos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sections = ['#hero', '#about', '#skills', '#projects', '#experience', '#education', '#certificates', '#contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 220;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.querySelector(sections[i]);
        if (sec && sec.offsetTop <= scrollY) {
          setActiveNav(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Magnetic & Butterfly Cursor Effects (buscodes.tech inspired)
  useEffect(() => {
    const dot = document.getElementById('magnetic-cursor-dot');
    const aura = document.getElementById('magnetic-cursor-aura');
    const butterfly = document.getElementById('butterfly-cursor-container');
    const rotator = document.getElementById('butterfly-cursor-rotator');
    const dustCanvas = document.getElementById('fairy-dust-canvas');
    if (!dot || !aura || !butterfly) return;

    let dustCtx = null;
    if (dustCanvas) {
      dustCanvas.width = window.innerWidth;
      dustCanvas.height = window.innerHeight;
      dustCtx = dustCanvas.getContext('2d');
    }

    const handleResize = () => {
      if (dustCanvas) {
        dustCanvas.width = window.innerWidth;
        dustCanvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let auraX = targetX, auraY = targetY;
    let bX = targetX, bY = targetY;
    let prevBX = targetX, prevBY = targetY;
    let currentHeading = 0;
    let particles = [];
    let raf;

    const colors = ['#FFFFFF', '#C7B5FF', '#B23A48', '#FFD6E0', '#E5DCFF'];

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      mousePos.current.x = targetX;
      mousePos.current.y = targetY;

      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target && target.closest && target.closest('a, button, input, textarea, select, [role="button"], .social-wave-btn, .group');
      if (isInteractive) {
        aura.classList.add('hovering');
        if (rotator) rotator.classList.add('butterfly-hovered');
      } else {
        aura.classList.remove('hovering');
        if (rotator) rotator.classList.remove('butterfly-hovered');
      }
    };

    const renderCursor = () => {
      // Instant dot
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

      // Trailing aura ring
      auraX += (targetX - auraX) * 0.22;
      auraY += (targetY - auraY) * 0.22;
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;

      // Smooth gliding butterfly
      bX += (targetX - bX) * 0.16;
      bY += (targetY - bY) * 0.16;
      butterfly.style.transform = `translate3d(${bX}px, ${bY}px, 0) translate(-50%, -50%)`;

      // Movement vector & dynamic wing flap speed
      const vx = bX - prevBX;
      const vy = bY - prevBY;
      const speed = Math.hypot(vx, vy);
      prevBX = bX;
      prevBY = bY;

      // Bank / rotate into direction of travel
      if (speed > 0.8) {
        const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;
        let diff = (targetAngle - currentHeading) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        currentHeading += diff * 0.2;
        if (rotator) rotator.style.transform = `rotate(${currentHeading}deg)`;
        butterfly.style.setProperty('--flap-duration', `${Math.max(0.16, 0.45 - speed * 0.03)}s`);

        // Spawn fairy dust particles on move
        if (particles.length < 90) {
          for (let i = 0; i < 2; i++) {
            particles.push({
              x: bX + (Math.random() - 0.5) * 12,
              y: bY + 14 + Math.random() * 8,
              vx: (Math.random() - 0.5) * 1.2 - vx * 0.15,
              vy: (Math.random() * 1.5 + 0.5) - vy * 0.15,
              size: 1.5 + Math.random() * 2.5,
              color: colors[Math.floor(Math.random() * colors.length)],
              life: 1.0,
              decay: 0.025 + Math.random() * 0.02
            });
          }
        }
      } else {
        // Idle gentle flutter
        butterfly.style.setProperty('--flap-duration', '0.55s');
      }

      // Render fairy dust trail
      if (dustCtx && dustCanvas) {
        dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          dustCtx.save();
          dustCtx.globalAlpha = p.life * 0.85;
          dustCtx.fillStyle = p.color;
          dustCtx.shadowColor = p.color;
          dustCtx.shadowBlur = 6;
          dustCtx.beginPath();
          dustCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          dustCtx.fill();
          dustCtx.restore();
        }
      }

      raf = requestAnimationFrame(renderCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    raf = requestAnimationFrame(renderCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, [selectedProject, showResumeModal]);

  const heroFade = (delay = 0) => ({
    opacity: isHeroLoaded ? 1 : 0,
    transform: isHeroLoaded ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.22,0.61,0.36,1) ${delay}ms`
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} copied to clipboard!`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      triggerToast("Message prepared! Opening your mail client...");
      const mailto = `mailto:${siteConfig.personal.email}?subject=${encodeURIComponent(contactForm.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Sharnitha,\n\nFrom: ${contactForm.name} (${contactForm.email})\n\n${contactForm.message}`)}`;
      window.location.href = mailto;
    }, 800);
  };

  const filteredProjects = activeTab === 'all' 
    ? siteConfig.projects 
    : siteConfig.projects.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-textLight font-montserrat antialiased relative overflow-x-clip flex flex-col justify-between">
      
      {/* Fairy Dust Sparkle Trail Canvas */}
      <canvas id="fairy-dust-canvas" className="fixed inset-0 pointer-events-none z-[99997]" />

      {/* Glowing White Custom Magnetic Dot Cursor */}
      <div id="magnetic-cursor-dot" />

      {/* Smooth Trailing Magnetic Aura Ring */}
      <div id="magnetic-cursor-aura" />

      {/* Realistic 3D Flapping Butterfly Cursor (buscodes.tech inspired) */}
      <div id="butterfly-cursor-container" aria-hidden="true">
        <div id="butterfly-cursor-rotator">
          <svg className="butterfly-svg" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="wingGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C7B5FF" />
                <stop offset="40%" stopColor="#B23A48" />
                <stop offset="100%" stopColor="#780000" />
              </linearGradient>
              <linearGradient id="wingGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C7B5FF" />
                <stop offset="40%" stopColor="#B23A48" />
                <stop offset="100%" stopColor="#780000" />
              </linearGradient>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B23A48" />
                <stop offset="50%" stopColor="#3B0A18" />
                <stop offset="100%" stopColor="#120609" />
              </linearGradient>
              <filter id="butterflyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Left Wing Assembly */}
            <g className="wing-left">
              <path d="M32 32 C26 18, 10 10, 4 18 C-1 24, 6 36, 32 32 Z" fill="url(#wingGradLeft)" fillOpacity="0.9" />
              <path d="M32 32 C22 20, 10 14, 6 20" stroke="#FFF" strokeOpacity="0.5" strokeWidth="0.8" fill="none"/>
              <path d="M32 32 C18 26, 10 28, 6 30" stroke="#FFF" strokeOpacity="0.35" strokeWidth="0.6" fill="none"/>
              <path d="M32 32 C24 38, 12 40, 8 48 C5 54, 18 56, 32 32 Z" fill="url(#wingGradLeft)" fillOpacity="0.8" />
              <path d="M32 32 C20 40, 14 46, 12 50" stroke="#FFF" strokeOpacity="0.4" strokeWidth="0.6" fill="none"/>
              <circle cx="5" cy="20" r="1" fill="#FFF" fillOpacity="0.8" />
              <circle cx="8" cy="28" r="0.8" fill="#FFF" fillOpacity="0.8" />
              <circle cx="10" cy="49" r="0.8" fill="#FFF" fillOpacity="0.8" />
            </g>

            {/* Right Wing Assembly */}
            <g className="wing-right">
              <path d="M32 32 C38 18, 54 10, 60 18 C65 24, 58 36, 32 32 Z" fill="url(#wingGradRight)" fillOpacity="0.9" />
              <path d="M32 32 C42 20, 54 14, 58 20" stroke="#FFF" strokeOpacity="0.5" strokeWidth="0.8" fill="none"/>
              <path d="M32 32 C46 26, 54 28, 58 30" stroke="#FFF" strokeOpacity="0.35" strokeWidth="0.6" fill="none"/>
              <path d="M32 32 C40 38, 52 40, 56 48 C59 54, 46 56, 32 32 Z" fill="url(#wingGradRight)" fillOpacity="0.8" />
              <path d="M32 32 C44 40, 50 46, 52 50" stroke="#FFF" strokeOpacity="0.4" strokeWidth="0.6" fill="none"/>
              <circle cx="59" cy="20" r="1" fill="#FFF" fillOpacity="0.8" />
              <circle cx="56" cy="28" r="0.8" fill="#FFF" fillOpacity="0.8" />
              <circle cx="54" cy="49" r="0.8" fill="#FFF" fillOpacity="0.8" />
            </g>

            {/* Body & Antennae */}
            <g filter="url(#butterflyGlow)">
              <path d="M31 23 Q24 12, 18 8" stroke="#C7B5FF" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <circle cx="18" cy="8" r="1.5" fill="#FFFFFF" />
              <path d="M33 23 Q40 12, 46 8" stroke="#C7B5FF" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <circle cx="46" cy="8" r="1.5" fill="#FFFFFF" />
              <circle cx="32" cy="23" r="2.2" fill="#B23A48"/>
              <ellipse cx="32" cy="33" rx="2" ry="11" fill="url(#bodyGrad)" stroke="#B23A48" strokeWidth="0.6"/>
            </g>
          </svg>
        </div>
      </div>

      {/* Ambient Glow Lights with Theme Palette (#780000, #3B0A18, #B23A48, #C7B5FF) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-[#780000] to-[#B23A48] opacity-25 rounded-full blur-[140px] animate-pulse-slow"></div>
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[#780000] via-[#3B0A18] to-transparent opacity-25 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-[#780000] opacity-20 rounded-full blur-[130px] animate-float"></div>
        <div className="absolute inset-0 grid-bg opacity-35"></div>
      </div>

      <div className="relative z-10">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-surface border border-brand-coral/40 px-5 py-3.5 rounded-xl shadow-[0_0_30px_rgba(230,57,70,0.35)] text-brand-textLight text-sm font-medium transition-all animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-brand-coral" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top-Centered Direct Navigation Links directly over Background */}
        <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 pointer-events-none flex justify-center items-center px-4">
          <nav 
            className="pointer-events-auto flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3.5 md:gap-x-4 gap-y-1.5 py-0.5 max-w-full"
            aria-label="Main Navigation"
          >
            {[
              { name: 'Home', href: '#hero' },
              { name: 'About', href: '#about' },
              { name: 'Skills', href: '#skills' },
              { name: 'Work', href: '#projects' },
              { name: 'Experience', href: '#experience' },
              { name: 'Education', href: '#education' },
              { name: 'Certificates', href: '#certificates' },
              { name: 'Contact', href: '#contact' },
            ].map((link, idx, arr) => {
              const isActive = activeNav === link.href;
              return (
                <React.Fragment key={link.name}>
                  <a 
                    href={link.href}
                    onClick={() => setActiveNav(link.href)}
                    className={`group relative text-[10.5px] sm:text-[11.5px] md:text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 px-1.5 sm:px-2 py-0.5 select-none ${
                      isActive 
                        ? 'text-white drop-shadow-[0_0_12px_rgba(178,58,72,0.95)]' 
                        : 'text-white/80 hover:text-white hover:drop-shadow-[0_0_8px_rgba(199,181,255,0.7)]'
                    }`}
                    style={{
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.85)"
                    }}
                  >
                    <span>{link.name}</span>
                    {/* Subtle red glow thin underline indicator without any enclosing container */}
                    <span 
                      className={`absolute -bottom-0.5 left-1 right-1 h-[2px] bg-gradient-to-r from-transparent via-[#B23A48] to-transparent transition-all duration-300 ${
                        isActive 
                          ? 'opacity-100 scale-x-100 shadow-[0_0_8px_#B23A48]' 
                          : 'opacity-0 scale-x-0 group-hover:opacity-75 group-hover:scale-x-75'
                      }`} 
                    />
                  </a>
                  {idx < arr.length - 1 && (
                    <span 
                      className="w-1 h-1 rounded-full bg-[#B23A48] shadow-[0_0_6px_#B23A48] opacity-75 shrink-0" 
                      aria-hidden="true" 
                    />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </header>

        {/* Luxury Full-Screen Hero Section with Zero-Ghosting Zero-Lag Character Tracking */}
        <section 
          id="hero" 
          className="relative w-full overflow-hidden flex flex-col justify-between"
          style={{
            height: "100vh",
            minHeight: "650px",
            backgroundColor: "#120609"
          }}
        >
          {/* Layer 1: Cursor-Tracking Character Animation Canvas (60FPS Zero-Ghosting Zero-Lag) */}
          <CharacterHeroCanvas mousePos={mousePos} />

          {/* Layer 2: Constellation Interactive Particle Canvas (Medium Visible, 10% Reduced Particles, Zero Overlap on Character) */}
          <ConstellationCanvas />

          {/* Layer 3: Hero Typography (Down Left) */}
          <div className="relative z-10 w-full pl-6 sm:pl-10 lg:pl-14 pr-4 pb-2 sm:pb-3 mt-auto">
            <div className="max-w-[440px] flex flex-col items-start text-left pointer-events-auto">
              
              {/* Modern Sans-Serif Greeting */}
              <div style={heroFade(0)}>
                <p className="text-xs sm:text-sm font-sans tracking-[0.35em] uppercase text-white/75 font-semibold mb-1.5">
                  Hi, I'm
                </p>
              </div>

              {/* Elegant Cursive Script Name in Dancing Script */}
              <div style={heroFade(100)}>
                <h1 
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-bold tracking-tight mb-2 sm:mb-3 select-none"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    textShadow: "0 6px 28px rgba(0, 0, 0, 0.7)",
                    lineHeight: 1.05
                  }}
                >
                  Sharnitha
                </h1>
              </div>

              {/* Updated Compact 3-line Bio about Data Analytics */}
              <div style={heroFade(250)}>
                <p 
                  className="text-xs sm:text-sm text-white/90 leading-relaxed mb-4 sm:mb-5 font-normal"
                  style={{ maxWidth: "360px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  Aspiring Data Analyst bridging database architecture, predictive modeling, and executive-ready Power BI dashboards.
                </p>
              </div>

              {/* Three Stylish Pill Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-0.5 transform scale-95 origin-bottom-left" style={heroFade(380)}>
                <a 
                  href="#projects"
                  className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-[#120609] font-bold text-xs sm:text-sm tracking-wider uppercase border border-transparent shadow-[0_4px_25px_rgba(255,255,255,0.3)] hover:scale-105 hover:bg-[#FBF5F6] transition-all duration-300"
                >
                  <span>View Projects</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>

                <a 
                  href="resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/15 border border-white/50 text-white font-bold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md hover:bg-white hover:text-[#120609] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <span>Resume</span>
                </a>

                <KokonutSocialButton />
              </div>

            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="relative z-10 flex justify-center pb-2 pt-1">
            <a 
              href="#metrics" 
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
              aria-label="Scroll down"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors duration-300">
                Scroll
              </span>
              <div className="w-5 h-9 rounded-full border border-white/40 group-hover:border-white/80 flex justify-center pt-1.5 transition-colors duration-300">
                <div className="w-1 h-1 rounded-full bg-white animate-[scrollDot_1.8s_ease-in-out_infinite]" />
              </div>
            </a>
          </div>

          {/* Bottom Infinite Marquee Skills Ribbon */}
          <div className="relative z-10 border-t border-white/15 overflow-hidden bg-black/35 backdrop-blur-sm py-2.5" aria-hidden="true">
            <div className="flex gap-12 whitespace-nowrap animate-marquee will-change-transform">
              {[
                "POWER BI", "EXCEL & POWER QUERY", "SQL & MYSQL", "PYTHON DATA SCIENCE", "MACHINE LEARNING",
                "SCIKIT-LEARN", "OPENCV", "NODE.JS & EXPRESS", "MONGODB", "DAX FORMULAS", "DATA MODELING", "REACT"
              ].concat([
                "POWER BI", "EXCEL & POWER QUERY", "SQL & MYSQL", "PYTHON DATA SCIENCE", "MACHINE LEARNING",
                "SCIKIT-LEARN", "OPENCV", "NODE.JS & EXPRESS", "MONGODB", "DAX FORMULAS", "DATA MODELING", "REACT"
              ]).map((item, idx) => (
                <span key={idx} className="flex items-center gap-12 text-sm sm:text-base font-black tracking-tight text-white/30 hover:text-white transition-colors duration-500">
                  <span>{item}</span>
                  <span className="text-white/40">✦</span>
                </span>
              ))}
            </div>
          </div>

        </section>

        {/* ✦ At a Glance — Refined Deep-Maroon Visual Identity ✦ */}
        <div id="metrics" className="w-full max-w-7xl mx-auto px-6 pt-10 pb-6 relative z-10">

          {/* Section Heading: At a Glance (Crimson-to-Rose Accent) */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(178,58,72,0.45), rgba(244,63,94,0.2))' }} />
            <div className="flex flex-col items-center gap-1 select-none">
              <span className="text-[9px] font-mono tracking-[0.35em] uppercase font-semibold text-[#FECDD3]/80">Overview</span>
              <h3
                className="text-lg sm:text-xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  background: 'linear-gradient(135deg, #FFFFFF 30%, #FFE4E6 70%, #FDA4AF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.01em'
                }}
              >At a Glance</h3>
              <div className="flex items-center gap-1.5 pt-1">
                <div className="w-3 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(178,58,72,0.6))' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shadow-[0_0_8px_rgba(225,29,72,0.9)]" />
                <div className="w-3 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(178,58,72,0.6), transparent)' }} />
              </div>
            </div>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(244,63,94,0.2), rgba(178,58,72,0.45), transparent)' }} />
          </div>

          {/* 4 Unified Deep-Maroon Overview Cards (#260B13) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: 2026 Graduate (Muted Lavender Accent) */}
            <div
              className="overview-card group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'rgba(38, 11, 19, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(199, 181, 255, 0.22)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(199, 181, 255, 0.45)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.18), 0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(199, 181, 255, 0.22)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(199,181,255,0.6), transparent)' }} />
              <div className="flex items-center justify-between pb-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] font-semibold text-[#D8B4FE] bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 px-2.5 py-1 rounded-md">
                  Milestone
                </span>
                <span className="text-2xl select-none group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                  🎓
                </span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  2026 Graduate
                </h4>
                <p className="text-xs font-semibold text-[#F4E2E6]/90 pt-1.5 leading-normal">
                  B.Sc. Computer Science
                </p>
                <p className="text-[11px] text-[#D8C7CA]/70 pt-0.5 leading-normal">
                  PSG College of Arts &amp; Science
                </p>
              </div>
            </div>

            {/* Card 2: 8.0 CGPA (Muted Gold Accent) */}
            <div
              className="overview-card group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'rgba(38, 11, 19, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.18), 0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.22)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />
              <div className="flex items-center justify-between pb-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] font-semibold text-[#FDE047] bg-[#EAB308]/10 border border-[#EAB308]/25 px-2.5 py-1 rounded-md">
                  Distinction
                </span>
                <span className="text-2xl select-none group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                  ⭐
                </span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  8.0 CGPA
                </h4>
                <p className="text-xs font-semibold text-[#F4E2E6]/90 pt-1.5 leading-normal">
                  Strong Academic Standing
                </p>
                <p className="text-[11px] text-[#D8C7CA]/70 pt-0.5 leading-normal">
                  Top Tier Department Performance
                </p>
              </div>
            </div>

            {/* Card 3: 5+ Projects (Rose Accent) */}
            <div
              className="overview-card group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'rgba(38, 11, 19, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.5)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(244, 63, 94, 0.22), 0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.25)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.65), transparent)' }} />
              <div className="flex items-center justify-between pb-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] font-semibold text-[#FDA4AF] bg-[#E11D48]/10 border border-[#E11D48]/25 px-2.5 py-1 rounded-md">
                  Works
                </span>
                <span className="text-2xl select-none group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                  🚀
                </span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  5+ Projects
                </h4>
                <p className="text-xs font-semibold text-[#F4E2E6]/90 pt-1.5 leading-normal">
                  Analytics, ML &amp; Full-Stack
                </p>
                <p className="text-[11px] text-[#D8C7CA]/70 pt-0.5 leading-normal">
                  Excel, Power BI, MySQL, Python &amp; React
                </p>
              </div>
            </div>

            {/* Card 4: 2 Internships (Crimson Accent) */}
            <div
              className="overview-card group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'rgba(38, 11, 19, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(178, 58, 72, 0.28)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(178, 58, 72, 0.6)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(178, 58, 72, 0.28), 0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(178, 58, 72, 0.28)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.35)';
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(178,58,72,0.7), transparent)' }} />
              <div className="flex items-center justify-between pb-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] font-semibold text-[#FECDD3] bg-[#780000]/25 border border-[#B23A48]/35 px-2.5 py-1 rounded-md">
                  Experience
                </span>
                <span className="text-2xl select-none group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                  💼
                </span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  2 Internships
                </h4>
                <p className="text-xs font-semibold text-[#F4E2E6]/90 pt-1.5 leading-normal">
                  Data Analytics &amp; Web Dev
                </p>
                <p className="text-[11px] text-[#D8C7CA]/70 pt-0.5 leading-normal">
                  DecodeLabs &amp; Career Ladder
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Subtle crimson-to-rose transitional divider between Overview & About */}
        <div className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-center opacity-70">
          <div className="h-px w-full" style={{ background: 'radial-gradient(ellipse at center, rgba(178,58,72,0.45) 0%, rgba(225,29,72,0.18) 50%, transparent 100%)' }} />
        </div>

        {/* About Me Section — Minimal & Chic */}
        <AboutSection setShowResumeModal={setShowResumeModal} />

        {/* Tech Stack Section — Unified Glassmorphism & Floating Bubbles */}
        <TechStackSection />


        {/* Featured Projects Bento Grid Section */}
        <ProjectsSection setSelectedProject={setSelectedProject} />


        {/* Liquid Glass Work Experience Section */}
        <ExperienceSection />

        {/* Education & Academic Timeline Section */}
        <EducationSection />

        {/* Cosmic Vault Certificates Section */}
        <CertificatesSection />

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-primary/20 border border-brand-primary/40 text-xs font-semibold text-brand-coral uppercase tracking-widest">
                Let's Connect
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Interested in collaborating or discussing opportunities?
              </h2>
              <p className="text-sm text-brand-textDim leading-relaxed">
                I am actively seeking full-time and internship opportunities in Data Analytics, Business Intelligence, and Full Stack Development. Let's start a conversation!
              </p>

              <div className="space-y-3 pt-2">
                <div 
                  onClick={() => copyToClipboard(siteConfig.personal.email, "Email")}
                  className="glass-panel p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-brand-coral transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-primary/30 text-brand-coral">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-textDim uppercase tracking-wider block">Email Address</span>
                      <span className="text-xs font-semibold text-white">{siteConfig.personal.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-md bg-brand-surface text-brand-coral border border-brand-primary/30 font-medium">Click to Copy</span>
                </div>

                <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-primary/30 text-brand-coral">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-textDim uppercase tracking-wider block">Location</span>
                      <span className="text-xs font-semibold text-white">{siteConfig.personal.location}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-md bg-brand-surface text-brand-textDim border border-brand-primary/30">India</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <a 
                  href={siteConfig.personal.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 rounded-xl glass-panel text-brand-textMuted hover:text-white hover:border-brand-coral transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={siteConfig.personal.socialLinks.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 rounded-xl glass-panel text-brand-textMuted hover:text-white hover:border-brand-coral transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href={`mailto:${siteConfig.personal.email}`} 
                  className="p-3 rounded-xl glass-panel text-brand-textMuted hover:text-white hover:border-brand-coral transition-all">
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleContactSubmit} className="glass-panel p-8 rounded-3xl border border-brand-primary/40 space-y-5">
                <h3 className="text-xl font-bold text-white">Send a Message</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-brand-textMuted">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="John Doe" 
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-primary/30 text-white placeholder-brand-textDim/50 text-xs focus:outline-none focus:border-brand-coral"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-brand-textMuted">Your Email</label>
                    <input 
                      type="email" 
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="john@example.com" 
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-primary/30 text-white placeholder-brand-textDim/50 text-xs focus:outline-none focus:border-brand-coral"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-brand-textMuted">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Opportunity / Project Collaboration" 
                    className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-primary/30 text-white placeholder-brand-textDim/50 text-xs focus:outline-none focus:border-brand-coral"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-brand-textMuted">Message</label>
                  <textarea 
                    rows="4" 
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Hello Sharnitha, I'd like to discuss an opportunity..." 
                    className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-primary/30 text-white placeholder-brand-textDim/50 text-xs focus:outline-none focus:border-brand-coral resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary via-brand-crimson to-brand-coral text-white font-semibold text-xs tracking-wide shadow-lg hover:shadow-[0_0_25px_rgba(230,57,70,0.5)] transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-brand-primary/25 bg-brand-surface/70 py-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-brand-textDim">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{siteConfig.personal.name}</span>
              <span>•</span>
              <span>Full Stack Data Analyst Portfolio</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#hero" className="hover:text-brand-coral transition-colors">Top</a>
              <a href="#about" className="hover:text-brand-coral transition-colors">About</a>
              <a href="#projects" className="hover:text-brand-coral transition-colors">Projects</a>
              <a href="#contact" className="hover:text-brand-coral transition-colors">Contact</a>
              <a href="resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-brand-coral transition-colors">Resume</a>
            </div>
            <div>
              Crafted in Maroon &amp; Dark Palette (#120609)
            </div>
          </div>
        </footer>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-panel w-full max-w-3xl rounded-3xl border border-brand-coral/50 p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(230,57,70,0.3)]">
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-brand-surface border border-brand-primary/40 text-brand-textMuted hover:text-white hover:border-brand-coral">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-brand-primary/30 text-brand-coral border border-brand-primary/40 font-semibold">
                    {selectedProject.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs text-brand-textDim">Timeline: {selectedProject.date}</p>
                </div>

                <p className="text-sm text-brand-textMuted leading-relaxed">
                  {selectedProject.summary}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-brand-coral">Key Engineering Highlights</h4>
                  <div className="space-y-2 bg-brand-surface/70 p-4 rounded-2xl border border-brand-primary/25">
                    {selectedProject.highlights.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-brand-textMuted">
                        <span className="text-brand-coral font-bold mt-0.5">✔</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-brand-coral">Project Workflow & Methodology</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProject.pipeline.map((step, sIdx) => (
                      <div key={sIdx} className="p-3.5 rounded-xl bg-brand-surface border border-brand-primary/20 space-y-1">
                        <span className="text-[10px] font-bold text-brand-coral block">STEP {sIdx + 1}: {step.step}</span>
                        <span className="text-xs text-brand-textDim block">{step.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-brand-coral">Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((t, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-lg bg-brand-primary/20 border border-brand-primary/40 text-xs font-medium text-brand-lightGlow">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-brand-primary/20">
                  <a 
                    href={selectedProject.githubUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-coral text-white text-xs font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                    <Github className="w-4 h-4" />
                    <span>View GitHub Repository</span>
                  </a>
                  <button 
                    onClick={() => setSelectedProject(null)} 
                    className="px-6 py-2.5 rounded-xl bg-brand-surface border border-brand-primary/30 text-brand-textMuted hover:text-white text-xs font-semibold">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Preview Modal */}
        {showResumeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-panel w-full max-w-4xl rounded-3xl border border-brand-coral/50 p-6 sm:p-10 max-h-[92vh] overflow-y-auto relative shadow-[0_0_50px_rgba(230,57,70,0.35)]">
              <div className="flex items-center justify-between pb-6 border-b border-brand-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-coral flex items-center justify-center text-white font-bold">
                    ST
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Curriculum Vitae</h3>
                    <p className="text-xs text-brand-coral">{siteConfig.personal.name} • {siteConfig.personal.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-primary/40 text-xs text-brand-textMuted hover:text-white flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    <span>Print CV</span>
                  </button>
                  <button 
                    onClick={() => setShowResumeModal(false)}
                    className="p-2 rounded-xl bg-brand-surface border border-brand-primary/40 text-brand-textMuted hover:text-white hover:border-brand-coral">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="py-8 space-y-8 text-xs text-brand-textMuted">
                <div className="text-center space-y-2 border-b border-brand-primary/20 pb-6">
                  <h2 className="text-2xl font-black text-white">{siteConfig.personal.name}</h2>
                  <p className="text-brand-coral font-medium text-sm">{siteConfig.personal.title}</p>
                  <p className="text-brand-textDim">
                    {siteConfig.personal.email} • {siteConfig.personal.location}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-brand-coral text-xs">Profile Summary</h4>
                  <p className="leading-relaxed">
                    {siteConfig.personal.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-brand-coral text-xs">Technical Skills</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-brand-surface/60 p-4 rounded-xl border border-brand-primary/20">
                    <div>
                      <strong className="text-white block pb-1">Data Analytics:</strong>
                      <span>Excel, Power Query, Power BI, Data Cleaning, Data Transformation, Data Analysis, Data Modeling, Reporting, Dashboard Development, Data Visualization</span>
                    </div>
                    <div>
                      <strong className="text-white block pb-1">Programming & Databases:</strong>
                      <span>Python, SQL, MySQL, Java (Intermediate), MongoDB, DBMS</span>
                    </div>
                    <div>
                      <strong className="text-white block pb-1">Data & ML Libraries:</strong>
                      <span>Pandas, NumPy, Matplotlib, Scikit-learn, TensorFlow, OpenCV</span>
                    </div>
                    <div>
                      <strong className="text-white block pb-1">Web Technologies:</strong>
                      <span>HTML, CSS, JavaScript, Node.js, Express.js</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-white uppercase tracking-wider text-brand-coral text-xs">Experience</h4>
                  <div className="space-y-4">
                    {siteConfig.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-brand-coral pl-4 space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{exp.role} • {exp.company}</span>
                          <span>{exp.period}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-brand-textMuted">
                          {exp.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-white uppercase tracking-wider text-brand-coral text-xs">Projects</h4>
                  <div className="space-y-4">
                    {siteConfig.projects.map((proj, idx) => (
                      <div key={idx} className="border-l-2 border-brand-coral pl-4 space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{proj.title}</span>
                          <span>{proj.date}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-brand-textMuted">
                          {proj.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-brand-coral text-xs">Education</h4>
                    <ul className="space-y-2">
                      {siteConfig.education.map((edu, idx) => (
                        <li key={idx}>
                          <strong className="text-white block">{edu.degree}</strong>
                          <span>{edu.institution} • {edu.period} ({edu.status || edu.grade})</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-brand-coral text-xs">Certifications</h4>
                    <ul className="space-y-1.5">
                      {siteConfig.certifications.map((cert, idx) => (
                        <li key={idx}>• {cert.title} – {cert.issuer} ({cert.period})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
