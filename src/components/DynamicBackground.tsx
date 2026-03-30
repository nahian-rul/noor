import React, { useEffect, useRef } from "react";
import { useWaqt } from "../WaqtContext";
import { useTheme } from "../contexts/ThemeContext";

const WAQT_PALETTE: Record<string, { bg: string; accent: string; star: string }> = {
  Fajr:    { bg: "#0a0f2e", accent: "#3b5bdb", star: "#a5b4fc" },
  Sunrise: { bg: "#1a0a00", accent: "#f59e0b", star: "#fde68a" },
  Dhuhr:   { bg: "#020b18", accent: "#0ea5e9", star: "#bae6fd" },
  Asr:     { bg: "#150a00", accent: "#f97316", star: "#fed7aa" },
  Maghrib: { bg: "#0f0318", accent: "#7c3aed", star: "#ddd6fe" },
  Isha:    { bg: "#000308", accent: "#1e3a5f", star: "#93c5fd" },
  Night:   { bg: "#000308", accent: "#1e3a5f", star: "#93c5fd" },
};

export const DynamicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { waqt } = useWaqt();
  const { theme, themeId } = useTheme();
  const animRef = useRef<number>(0);

  // Resolve palette: auto = waqt-based, else use theme
  const palette = themeId === "auto"
    ? (WAQT_PALETTE[waqt] ?? WAQT_PALETTE.Night)
    : { bg: theme.bg, accent: theme.accent, star: theme.star };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const bg  = hexToRgb(palette.bg);
    const acc = hexToRgb(palette.accent);
    const st  = hexToRgb(palette.star);

    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      offset: Math.random() * Math.PI * 2,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background radial gradient
      const grad = ctx.createRadialGradient(
        canvas.width * 0.4, canvas.height * 0.35, 0,
        canvas.width * 0.5, canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.85
      );
      grad.addColorStop(0, `rgb(${bg.r + 20},${bg.g + 14},${bg.b + 38})`);
      grad.addColorStop(1, `rgb(${bg.r},${bg.g},${bg.b})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Islamic geometric rings
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.max(canvas.width, canvas.height) * 0.72;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.00014);

      [0.17, 0.30, 0.44, 0.58, 0.72].forEach((frac, ri) => {
        const R = maxR * frac;
        const n = (ri + 1) * 8;
        const alpha = 0.045 - ri * 0.005;
        const pulse = 1 + Math.sin(t * 0.001 + ri) * 0.018;

        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const angle = (i / n) * Math.PI * 2 - Math.PI / n;
          const x = Math.cos(angle) * R * pulse;
          const y = Math.sin(angle) * R * pulse;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${acc.r},${acc.g},${acc.b},${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (ri % 2 === 0) {
          for (let i = 0; i < n; i += 2) {
            const a1 = (i / n) * Math.PI * 2 - Math.PI / n;
            const a2 = ((i + Math.floor(n / 4)) / n) * Math.PI * 2 - Math.PI / n;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a1) * R * pulse, Math.sin(a1) * R * pulse);
            ctx.lineTo(Math.cos(a2) * R * pulse, Math.sin(a2) * R * pulse);
            ctx.strokeStyle = `rgba(${acc.r},${acc.g},${acc.b},${alpha * 0.55})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Central mandala petals
      const petals = 8;
      const petalR = maxR * 0.08;
      const petalDist = maxR * 0.055;
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2 + t * 0.00025;
        const px = Math.cos(angle) * petalDist;
        const py = Math.sin(angle) * petalDist;
        ctx.beginPath();
        ctx.ellipse(px, py, petalR, petalR * 0.38, angle, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${st.r},${st.g},${st.b},0.055)`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.restore();

      // Stars / particles
      stars.forEach((s) => {
        const a = s.alpha * (0.55 + 0.45 * Math.sin(t * s.speed + s.offset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${st.r},${st.g},${st.b},${a})`;
        ctx.fill();
      });

      // Vignette
      const vig = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.18,
        canvas.width / 2, canvas.height / 2, canvas.height
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [palette.bg, palette.accent, palette.star]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full" style={{ display: "block" }} />;
};
