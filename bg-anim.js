// ============================================================
//  bg-anim.js — Animated Canvas Backgrounds
//  Image 1 (fbScreen):  Retro psychedelic — floating eyeballs,
//                       spirals, orange+blue, "FOCUS/VISIONS"
//  Image 2 (landing):   Warm ISL — floating hands, ochre glow,
//                       speaker silhouette, gesture trails
// ============================================================

(function () {
  'use strict';

  /* ── UTILS ── */
  const TAU = Math.PI * 2;
  const rand  = (a, b) => Math.random() * (b - a) + a;
  const randI = (a, b) => Math.floor(rand(a, b + 1));
  const lerp  = (a, b, t) => a + (b - a) * t;

  /* ══════════════════════════════════════════════════════════
     SCREEN 1 — FIREBASE SETUP
     Retro Psychedelic: eyeballs · spirals · pointing hand
     Palette: deep navy #0e1b3a, orange #e8631a, cream #f5edd8
     ══════════════════════════════════════════════════════════ */
  function initFbBg() {
    const wrap = document.getElementById('fbScreen');
    if (!wrap) return;

    const cv = document.createElement('canvas');
    cv.id = 'fbBgCanvas';
    cv.style.cssText = `
      position:fixed; inset:0; width:100%; height:100%;
      z-index:0; pointer-events:none;
    `;
    wrap.prepend(cv);
    const ctx = cv.getContext('2d');

    // ── Sizes ──
    let W, H;
    function resize() {
      W = cv.width  = window.innerWidth;
      H = cv.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Palette ──
    const COL = {
      navy:    '#0e1b3a',
      navyMid: '#142040',
      orange:  '#e8631a',
      orange2: '#f07a3a',
      cream:   '#f5edd8',
      teal:    '#1a9e6f',
      red:     '#c0392b',
      blue:    '#2563c8',
    };

    // ── Eyeballs ──
    const EYES = Array.from({ length: 18 }, () => ({
      x: rand(0, 1), y: rand(0, 1),
      r: rand(18, 52),
      pupilFrac: rand(0.38, 0.58),
      speed: rand(0.00008, 0.00022),
      angle: rand(0, TAU),
      orbitR: rand(0.05, 0.22),
      ox: rand(0, 1), oy: rand(0, 1),
      phase: rand(0, TAU),
      blink: rand(0, TAU),
      blinkSpeed: rand(0.01, 0.03),
      color: [COL.orange, COL.cream, '#fddba9', '#fff8e7'][randI(0,3)],
      pupil: ['#0e1b3a','#1c0a04','#0a1828'][randI(0,2)],
      iris: ['#2563c8','#e8631a','#1a9e6f','#7c3aed'][randI(0,3)],
      glintA: rand(0.4, 0.9),
    }));

    // ── Spiral lines (vortex) ──
    const SPIRALS = Array.from({ length: 5 }, () => ({
      cx: rand(0.1, 0.9), cy: rand(0.1, 0.9),
      maxR: rand(60, 160), turns: randI(3, 6),
      speed: rand(0.002, 0.006) * (Math.random() > 0.5 ? 1 : -1),
      angle: 0,
      color: [COL.orange, COL.cream, COL.blue][randI(0,2)],
      alpha: rand(0.04, 0.14),
      thick: rand(0.8, 2),
    }));

    // ── Halftone dots grid ──
    const DOTS = [];
    for (let gx = 0; gx < 28; gx++) {
      for (let gy = 0; gy < 20; gy++) {
        DOTS.push({ gx, gy, phase: rand(0, TAU), speed: rand(0.012, 0.025) });
      }
    }

    // ── Retro words ──
    const WORDS = [
      { text: 'FOCUS',    x: 0.08, y: 0.12, size: 72, angle: 0 },
      { text: 'TIME',     x: 0.42, y: 0.06, size: 56, angle: 0 },
      { text: 'MANIFEST', x: 0.62, y: 0.1,  size: 48, angle: 0 },
      { text: 'VISIONS',  x: 0.3,  y: 0.9,  size: 80, angle: 0 },
      { text: 'LISTEN',   x: 0.72, y: 0.85, size: 44, angle: -0.04 },
      { text: 'SEE',      x: 0.86, y: 0.5,  size: 38, angle: 0.08 },
    ];

    // ── Pointing hand ──
    let handPhase = 0;

    // ── Orange blobs / lava ──
    const BLOBS = Array.from({ length: 4 }, () => ({
      x: rand(0, 1), y: rand(0, 1),
      r: rand(0.08, 0.18),
      speedX: rand(-0.0003, 0.0003),
      speedY: rand(-0.0002, 0.0002),
      phase: rand(0, TAU),
    }));

    let t = 0;
    function draw() {
      t++;

      // ── Background gradient ──
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0,   '#0e1b3a');
      bg.addColorStop(0.4, '#142040');
      bg.addColorStop(0.7, '#1a2550');
      bg.addColorStop(1,   '#0a1020');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Animated orange blob glows ──
      BLOBS.forEach(b => {
        b.x += b.speedX; b.y += b.speedY;
        if (b.x < -0.2 || b.x > 1.2) b.speedX *= -1;
        if (b.y < -0.2 || b.y > 1.2) b.speedY *= -1;
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.018 + b.phase);
        const gr = ctx.createRadialGradient(b.x*W, b.y*H, 0, b.x*W, b.y*H, b.r*W*pulse);
        gr.addColorStop(0, 'rgba(232,99,26,0.13)');
        gr.addColorStop(0.5, 'rgba(232,99,26,0.05)');
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(b.x*W, b.y*H, b.r*W*pulse, 0, TAU);
        ctx.fill();
      });

      // ── Halftone dot grid ──
      const cellW = W / 28, cellH = H / 20;
      DOTS.forEach(d => {
        const cx = (d.gx + 0.5) * cellW;
        const cy = (d.gy + 0.5) * cellH;
        d.phase += d.speed;
        const s = 0.5 + 0.5 * Math.sin(d.phase + t * 0.005);
        const r = s * 2.8;
        ctx.fillStyle = `rgba(232,99,26,${0.04 + s * 0.07})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, TAU);
        ctx.fill();
      });

      // ── Spirals ──
      SPIRALS.forEach(sp => {
        sp.angle += sp.speed;
        ctx.save();
        ctx.translate(sp.cx * W, sp.cy * H);
        ctx.strokeStyle = sp.color;
        ctx.lineWidth   = sp.thick;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        const steps = 200;
        for (let i = 0; i <= steps; i++) {
          const frac = i / steps;
          const a = sp.angle + frac * TAU * sp.turns;
          const r = frac * sp.maxR;
          const x = Math.cos(a) * r, y = Math.sin(a) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      });

      // ── Retro words ──
      ctx.save();
      ctx.font = 'bold 72px "Outfit", serif';
      ctx.textBaseline = 'top';
      WORDS.forEach(w => {
        const pulse = 0.04 + 0.025 * Math.sin(t * 0.011 + w.x * 10);
        ctx.save();
        ctx.translate(w.x * W, w.y * H);
        ctx.rotate(w.angle);
        ctx.font = `900 ${w.size}px "Outfit", sans-serif`;
        ctx.fillStyle = `rgba(245,237,216,${pulse})`;
        ctx.letterSpacing = '8px';
        ctx.fillText(w.text, 0, 0);
        // orange stroke
        ctx.strokeStyle = `rgba(232,99,26,${pulse * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.strokeText(w.text, 0, 0);
        ctx.restore();
      });
      ctx.restore();

      // ── Eyeballs ──
      EYES.forEach(e => {
        e.angle += e.speed * TAU;
        e.blink  += e.blinkSpeed;
        const px = (e.ox + Math.cos(e.angle) * e.orbitR) * W;
        const py = (e.oy + Math.sin(e.angle) * e.orbitR) * H;
        const blinkScale = Math.abs(Math.cos(e.blink));
        const er = e.r;

        ctx.save();
        ctx.translate(px, py);
        ctx.scale(1, blinkScale < 0.08 ? 0.08 : blinkScale);

        // Sclera (white of eye)
        const sGrad = ctx.createRadialGradient(-er*0.2, -er*0.2, er*0.05, 0, 0, er);
        sGrad.addColorStop(0, e.color);
        sGrad.addColorStop(0.7, e.color);
        sGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = sGrad;
        ctx.beginPath(); ctx.arc(0, 0, er, 0, TAU); ctx.fill();

        // Veins
        for (let v = 0; v < 5; v++) {
          const va = (v / 5) * TAU + t * 0.002;
          ctx.strokeStyle = 'rgba(192,57,43,0.3)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(Math.cos(va)*er*0.45, Math.sin(va)*er*0.45);
          ctx.quadraticCurveTo(
            Math.cos(va+0.4)*er*0.7, Math.sin(va+0.4)*er*0.7,
            Math.cos(va+0.2)*er*0.92, Math.sin(va+0.2)*er*0.92
          );
          ctx.stroke();
        }

        // Iris
        const iR = er * e.pupilFrac * 1.4;
        const iGrad = ctx.createRadialGradient(0, 0, iR*0.1, 0, 0, iR);
        iGrad.addColorStop(0, e.iris);
        iGrad.addColorStop(0.6, e.iris + 'aa');
        iGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = iGrad;
        ctx.beginPath(); ctx.arc(0, 0, iR, 0, TAU); ctx.fill();

        // Pupil
        const pR = er * e.pupilFrac * 0.6;
        const pDir = (t * 0.008) % TAU;
        const lookX = Math.cos(pDir) * iR * 0.2, lookY = Math.sin(pDir) * iR * 0.2;
        ctx.fillStyle = e.pupil;
        ctx.beginPath(); ctx.arc(lookX, lookY, pR, 0, TAU); ctx.fill();

        // Glint
        ctx.fillStyle = `rgba(255,255,255,${e.glintA})`;
        ctx.beginPath(); ctx.arc(-er*0.22, -er*0.22, er*0.12, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(er*0.1, -er*0.3, er*0.06, 0, TAU); ctx.fill();

        // Eyelid crease
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, er, Math.PI*0.05, Math.PI*0.95, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, er, Math.PI*1.05, Math.PI*1.95, false);
        ctx.stroke();

        ctx.restore();
      });

      // ── Pointing hand (bottom-right) ──
      handPhase += 0.025;
      const hx = W * 0.88, hy = H * 0.55;
      const hFloat = Math.sin(handPhase) * 18;
      const hRot   = Math.sin(handPhase * 0.7) * 0.18;
      ctx.save();
      ctx.translate(hx, hy + hFloat);
      ctx.rotate(hRot - 0.3);
      ctx.font = `${Math.min(W * 0.12, 130)}px serif`;
      ctx.globalAlpha = 0.18;
      ctx.fillText('☝️', 0, 0);
      ctx.globalAlpha = 1;
      ctx.restore();

      // Smaller floating hands
      const floatHands = ['✋','👁️','🤟','👁'];
      floatHands.forEach((h, i) => {
        const fx = (0.05 + i * 0.28) * W;
        const fy = H * 0.78 + Math.sin(t * 0.015 + i * 1.2) * 30;
        ctx.save();
        ctx.font = `${Math.min(W * 0.045, 52)}px serif`;
        ctx.globalAlpha = 0.1 + 0.06 * Math.sin(t * 0.02 + i);
        ctx.fillText(h, fx, fy);
        ctx.globalAlpha = 1;
        ctx.restore();
      });

      // ── Orange wavey blobs at bottom ──
      ctx.save();
      ctx.globalAlpha = 0.18;
      const wave = ctx.createLinearGradient(0, H*0.75, 0, H);
      wave.addColorStop(0, 'transparent');
      wave.addColorStop(0.5, 'rgba(232,99,26,0.3)');
      wave.addColorStop(1, 'rgba(192,57,43,0.5)');
      ctx.fillStyle = wave;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) {
        const y = H * 0.8 + Math.sin((x / W) * TAU * 3 + t * 0.03) * H * 0.06
                           + Math.sin((x / W) * TAU * 1.5 + t * 0.02) * H * 0.04;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ══════════════════════════════════════════════════════════
     SCREEN 2 — LANDING (Role Select + Waiting)
     Warm ISL Illustration: sign hands · ochre glow · speaker
     Palette: amber #d97706, terracotta #c0522b, warm cream
     ══════════════════════════════════════════════════════════ */
  function initLandingBg() {
    ['landing', 'waitScreen'].forEach(id => {
      const wrap = document.getElementById(id);
      if (!wrap) return;

      const cv = document.createElement('canvas');
      cv.style.cssText = `
        position:fixed; inset:0; width:100%; height:100%;
        z-index:0; pointer-events:none;
      `;
      wrap.style.position = 'relative';
      const existing = wrap.querySelector('canvas[data-bg]');
      if (existing) existing.remove();
      cv.setAttribute('data-bg', 'true');
      wrap.prepend(cv);

      const ctx = cv.getContext('2d');
      let W, H;
      function resize() {
        W = cv.width  = window.innerWidth;
        H = cv.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      // ── Floating hand gestures ──
      const GESTURES = ['🤟','✋','👌','✌️','🙏','👋','🤲','☝️','👍','🫴','🤙'];
      const PARTICLES = Array.from({ length: 28 }, () => ({
        emoji: GESTURES[randI(0, GESTURES.length - 1)],
        x: rand(0, 1),
        y: rand(0, 1),
        size: rand(24, 72),
        speedX: rand(-0.0003, 0.0003),
        speedY: rand(-0.0004, -0.0001),
        rot: rand(0, TAU),
        rotSpeed: rand(-0.012, 0.012),
        alpha: rand(0.06, 0.18),
        alphaPulse: rand(0, TAU),
        alphaPulseSpeed: rand(0.008, 0.022),
      }));

      // ── Stripe panels (like image 2 — vertical color bands) ──
      const STRIPES = [
        { x: 0,    w: 0.18, color: '#3d1c08', opacity: 0.55 },
        { x: 0.18, w: 0.22, color: '#8b3a1a', opacity: 0.45 },
        { x: 0.40, w: 0.26, color: '#d97706', opacity: 0.35 },
        { x: 0.66, w: 0.18, color: '#c0522b', opacity: 0.40 },
        { x: 0.84, w: 0.16, color: '#5c2a10', opacity: 0.50 },
      ];

      // ── Central speaker silhouette ──
      let silPhase = 0;

      // ── Sound ripples ──
      const RIPPLES = Array.from({ length: 6 }, (_, i) => ({
        phase: (i / 6) * TAU,
        speed: 0.018,
      }));

      // ── Sparkling light flecks ──
      const SPARKS = Array.from({ length: 40 }, () => ({
        x: rand(0, 1), y: rand(0, 1),
        r: rand(0.8, 2.5),
        phase: rand(0, TAU),
        speed: rand(0.03, 0.07),
        color: ['#fff8e7','#ffd480','#e8631a','#fffbf0'][randI(0,3)],
      }));

      // ── Hand trail lines (gesture motion) ──
      const TRAILS = Array.from({ length: 8 }, () => ({
        pts: Array.from({ length: 12 }, (_, i) => ({
          x: rand(0.1, 0.9),
          y: rand(0.1, 0.9),
        })),
        color: ['rgba(217,119,6,', 'rgba(192,82,43,', 'rgba(255,255,255,'][randI(0,2)],
        alpha: rand(0.04, 0.1),
        phase: rand(0, TAU),
        speed: rand(0.005, 0.015),
      }));

      let t = 0;
      function draw() {
        t++;
        silPhase += 0.02;

        // ── Warm base gradient ──
        const bg = ctx.createLinearGradient(0, 0, W * 0.5, H);
        bg.addColorStop(0,   '#2a0f04');
        bg.addColorStop(0.3, '#5c2309');
        bg.addColorStop(0.6, '#8b3a12');
        bg.addColorStop(1,   '#3d1505');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // ── Vertical stripe panels ──
        STRIPES.forEach(s => {
          const pulse = 0.85 + 0.15 * Math.sin(t * 0.012 + s.x * 8);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.opacity * pulse;
          ctx.fillRect(s.x * W, 0, s.w * W, H);
          ctx.globalAlpha = 1;
        });

        // ── Warm radial glow (centre stage light) ──
        const cx = W * 0.5, cy = H * 0.4;
        const gPulse = 0.9 + 0.1 * Math.sin(t * 0.025);
        const radGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55 * gPulse);
        radGlow.addColorStop(0,   'rgba(255,200,80,0.22)');
        radGlow.addColorStop(0.3, 'rgba(217,119,6,0.12)');
        radGlow.addColorStop(0.6, 'rgba(192,82,43,0.06)');
        radGlow.addColorStop(1,   'transparent');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, W, H);

        // ── Speaker silhouette (centre back) ──
        const sw = Math.min(W * 0.22, 200);
        const sh = sw * 1.5;
        const sx = cx - sw * 0.5;
        const sy = H * 0.15 + Math.sin(silPhase * 0.5) * 8;

        ctx.save();
        ctx.globalAlpha = 0.22 + 0.06 * Math.sin(silPhase);
        // Body oval
        ctx.fillStyle = '#ffd480';
        ctx.beginPath();
        ctx.ellipse(cx, sy + sw * 0.35, sw * 0.28, sw * 0.35, 0, 0, TAU);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(cx, sy + sw * 0.1, sw * 0.18, 0, TAU);
        ctx.fill();
        // Arms spread (like image 2 person)
        ctx.strokeStyle = '#ffd480';
        ctx.lineWidth = sw * 0.09;
        ctx.lineCap = 'round';
        // Left arm reaching up
        ctx.beginPath();
        ctx.moveTo(cx - sw * 0.25, sy + sw * 0.4);
        ctx.quadraticCurveTo(cx - sw * 0.5, sy + sw * 0.15, cx - sw * 0.38, sy - sw * 0.05);
        ctx.stroke();
        // Right arm with mic
        ctx.beginPath();
        ctx.moveTo(cx + sw * 0.25, sy + sw * 0.4);
        ctx.quadraticCurveTo(cx + sw * 0.38, sy + sw * 0.25, cx + sw * 0.3, sy + sw * 0.1);
        ctx.stroke();
        // Microphone
        ctx.fillStyle = '#3d1505';
        ctx.beginPath();
        ctx.roundRect(cx + sw * 0.28, sy + sw * 0.05, sw * 0.06, sw * 0.22, 4);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        // ── Gesture trail lines ──
        TRAILS.forEach(tr => {
          tr.phase += tr.speed;
          ctx.save();
          ctx.globalAlpha = tr.alpha * (0.7 + 0.3 * Math.sin(tr.phase));
          ctx.strokeStyle = tr.color + '0.8)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 8]);
          ctx.beginPath();
          tr.pts.forEach((p, i) => {
            const px = p.x * W + Math.sin(tr.phase + i * 0.4) * 20;
            const py = p.y * H + Math.cos(tr.phase * 0.7 + i * 0.6) * 15;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          });
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        });

        // ── Sound ripple rings ──
        RIPPLES.forEach(rp => {
          rp.phase += rp.speed;
          const rr = (((rp.phase % TAU) / TAU)) * W * 0.35;
          const ra = 0.22 * (1 - rr / (W * 0.35));
          if (ra > 0.005) {
            ctx.save();
            ctx.globalAlpha = ra;
            ctx.strokeStyle = 'rgba(255,200,80,0.9)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, rr, 0, TAU);
            ctx.stroke();
            ctx.restore();
          }
        });

        // ── Floating hand gestures ──
        PARTICLES.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.rot += p.rotSpeed;
          p.alphaPulse += p.alphaPulseSpeed;
          if (p.y < -0.05) { p.y = 1.05; p.x = rand(0, 1); }
          if (p.x < -0.08) p.x = 1.08;
          if (p.x > 1.08)  p.x = -0.08;
          const a = p.alpha * (0.75 + 0.25 * Math.sin(p.alphaPulse));
          ctx.save();
          ctx.translate(p.x * W, p.y * H);
          ctx.rotate(p.rot);
          ctx.font = `${p.size}px serif`;
          ctx.globalAlpha = a;
          ctx.fillText(p.emoji, -p.size * 0.5, p.size * 0.5);
          ctx.globalAlpha = 1;
          ctx.restore();
        });

        // ── Sparkling flecks (light scatter) ──
        SPARKS.forEach(s => {
          s.phase += s.speed;
          const sa = 0.5 + 0.5 * Math.sin(s.phase);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = sa * 0.7;
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r, 0, TAU);
          ctx.fill();
          // Cross sparkle
          if (s.r > 1.8) {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = sa * 0.4;
            ctx.beginPath();
            ctx.moveTo(s.x*W - s.r*2.5, s.y*H);
            ctx.lineTo(s.x*W + s.r*2.5, s.y*H);
            ctx.moveTo(s.x*W, s.y*H - s.r*2.5);
            ctx.lineTo(s.x*W, s.y*H + s.r*2.5);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        });

        // ── Circular hand gesture outline rings ──
        const outerHands = ['🤟','✋','✌️','🙏'];
        outerHands.forEach((h, i) => {
          const angle = (i / outerHands.length) * TAU + t * 0.006;
          const orR   = Math.min(W, H) * 0.4;
          const hx2   = cx + Math.cos(angle) * orR;
          const hy2   = cy + Math.sin(angle) * orR * 0.55;
          const hs    = Math.min(W * 0.05, 52);
          ctx.save();
          ctx.translate(hx2, hy2);
          ctx.rotate(angle + Math.PI * 0.5);
          ctx.font = `${hs}px serif`;
          ctx.globalAlpha = 0.13 + 0.07 * Math.sin(t * 0.02 + i);
          ctx.fillText(h, -hs * 0.5, hs * 0.5);
          ctx.globalAlpha = 1;
          ctx.restore();
        });

        // ── Line guides (horizontal warm lines from image 2) ──
        for (let li = 0; li < 6; li++) {
          const ly = (li / 6) * H;
          const la = 0.025 + 0.015 * Math.sin(t * 0.01 + li * 0.8);
          ctx.strokeStyle = `rgba(255,200,80,${la})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, ly); ctx.lineTo(W, ly);
          ctx.stroke();
        }

        requestAnimationFrame(draw);
      }
      draw();
    });
  }

  /* ── CALL SCREEN background (same warm style as landing) ── */
  function initCallBg() {
    const wrap = document.getElementById('callScreen');
    if (!wrap) return;
    const cv = document.createElement('canvas');
    cv.style.cssText = `position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;`;
    wrap.style.position = 'relative';
    wrap.prepend(cv);
    const ctx = cv.getContext('2d');
    let W, H;
    function resize() { W = cv.width = wrap.offsetWidth; H = cv.height = wrap.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    const SPARKS = Array.from({ length: 30 }, () => ({
      x: rand(0,1), y: rand(0,1), r: rand(0.5,1.8),
      phase: rand(0,TAU), speed: rand(0.02,0.06),
      color: ['rgba(217,119,6,','rgba(232,99,26,','rgba(255,255,255,'][randI(0,2)],
    }));

    let t = 0;
    function draw() {
      t++;
      const bg = ctx.createLinearGradient(0,0,W,H);
      bg.addColorStop(0,'#f5f2ee'); bg.addColorStop(1,'#ede9e3');
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

      // subtle warm diagonal
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = ctx.createLinearGradient(0,0,W,H);
      (ctx.fillStyle).addColorStop?.(0,'transparent'); // skip if not gradient
      ctx.restore();

      SPARKS.forEach(s => {
        s.phase += s.speed;
        const a = 0.3 + 0.3*Math.sin(s.phase);
        ctx.fillStyle = s.color + a + ')';
        ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, TAU); ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── INIT ALL on DOM ready ── */
  function init() {
    initFbBg();
    initLandingBg();
    // re-init landing bg when screen switches (wait for landing to be shown)
    const obs = new MutationObserver(() => {
      if (document.getElementById('landing')?.style.display !== 'none') {
        // already inited
      }
    });
    const landing = document.getElementById('landing');
    if (landing) obs.observe(landing, { attributes: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
