// ============================================================
//  bg-anim.js  v2 — Faithful animated recreation of reference images
//
//  fbScreen  → Image 1: Retro "FOCUS / VISIONS / MANIFEST" eyeball scene
//                        (light cream + soft blue + coral, NOT dark)
//  landing   → Image 2: ISL performer with floating sign-hands + speaker
//                        (light warm cream + golden amber, NOT dark)
// ============================================================
(function () {
  'use strict';
  const TAU  = Math.PI * 2;
  const rand = (a, b) => Math.random() * (b - a) + a;
  const rI   = (a, b) => Math.floor(rand(a, b + 1));

  /* ─────────────────────────────────────────────────────────
     SCREEN 1 — FIREBASE SETUP
     Faithful animated recreation of Image 1:
       • Light cream/sky-blue background (panels like the original)
       • Animated pointing hand (top-centre, floating)
       • "FOCUS" repeat-panel left, "TIME" top, "MANIFEST"+spiral right
       • "VISIONS" big text at bottom
       • 1 large eyeball on desk + 6 small floating eyeballs
       • Suit-man silhouette at desk (subtle breathe)
       • Orange coral wavy blob (right edge dripping)
       • Soft halftone dots
       • Telephone silhouette left, book-stack right
  ─────────────────────────────────────────────────────────── */
  function initFbBg() {
    const wrap = document.getElementById('fbScreen');
    if (!wrap) return;
    const old = document.getElementById('fbBgCanvas');
    if (old) old.remove();

    const cv = document.createElement('canvas');
    cv.id = 'fbBgCanvas';
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    wrap.prepend(cv);
    const ctx = cv.getContext('2d');

    let W, H;
    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const C = {
      cream:   '#fef6e4', cream2:  '#fdefd6', cream3:  '#f8e8c8',
      sky:     '#b8d4ea', sky2:    '#9abfd8', skyDk:   '#7aadc8',
      coral:   '#f0956a', coral2:  '#e87845', coralLt: '#f8b89a',
      tan:     '#c49060', tanLt:   '#dbb07a',
      brown:   '#7a5030', brownLt: '#a07040', ivory:   '#fdfaf4',
    };

    const EYES = Array.from({ length: 7 }, () => ({
      x: rand(0.05, 0.95), y: rand(0.05, 0.85),
      r: rand(14, 26), vx: rand(-0.25, 0.25), vy: rand(-0.18, 0.18),
      phase: rand(0, TAU), bSpeed: rand(0.015, 0.03), bPhase: rand(0, TAU),
      irisCol: ['#5b85c2','#c87040','#4a9870','#8a5a9e'][rI(0,3)],
    }));

    const DOTS = [];
    for (let gx = 0; gx < 22; gx++)
      for (let gy = 0; gy < 16; gy++)
        DOTS.push({ gx, gy, p: rand(0, TAU), s: rand(0.008, 0.018) });

    const bigEye = { blinkP: 0, blinkS: 0.018, irisAngle: 0, irisS: 0.006 };
    let spiralAngle = 0, waveT = 0, handPhase = 0, breathePhase = 0, t = 0;

    function draw() {
      t++;
      waveT += 0.025; handPhase += 0.022; breathePhase += 0.018;
      spiralAngle += 0.012; bigEye.blinkP += bigEye.blinkS;
      bigEye.irisAngle += bigEye.irisS;

      // ── Background wall ──
      const bgG = ctx.createLinearGradient(0, 0, 0, H);
      bgG.addColorStop(0, '#cce0f0'); bgG.addColorStop(0.55, C.sky); bgG.addColorStop(1, C.sky2);
      ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);

      // Floor band
      ctx.fillStyle = C.cream2; ctx.fillRect(0, H * 0.72, W, H * 0.28);
      // Wainscoting
      ctx.fillStyle = C.skyDk; ctx.fillRect(0, H * 0.55, W, H * 0.17);
      ctx.fillStyle = C.tan;   ctx.fillRect(0, H * 0.72, W, 3);

      // ── Halftone dots ──
      const cW = W / 22, cH = H / 16;
      DOTS.forEach(d => {
        d.p += d.s;
        const cx = (d.gx + 0.5) * cW, cy = (d.gy + 0.5) * cH;
        const s  = 0.4 + 0.6 * Math.abs(Math.sin(d.p));
        ctx.fillStyle = `rgba(243,138,80,${0.055 + s * 0.045})`;
        ctx.beginPath(); ctx.arc(cx, cy, s * 2.4, 0, TAU); ctx.fill();
      });

      // ── Left panel: FOCUS ──
      const lpW = W * 0.18, lpH = H * 0.42, lpX = W * 0.03, lpY = H * 0.08;
      ctx.fillStyle = C.brown; ctx.fillRect(lpX, lpY, lpW, lpH);
      ctx.strokeStyle = C.tanLt; ctx.lineWidth = 3;
      ctx.strokeRect(lpX + 5, lpY + 5, lpW - 10, lpH - 10);
      ctx.fillStyle = C.tanLt;
      const fSize = Math.max(12, W * 0.022);
      ctx.font = `bold ${fSize}px "Outfit", sans-serif`; ctx.textAlign = 'center';
      for (let row = 0; row < 7; row++) {
        const fy = lpY + 28 + row * (fSize + 6);
        if (fy < lpY + lpH - 12) ctx.fillText('FOCUS', lpX + lpW / 2, fy);
      }

      // ── Top centre panel: TIME ──
      const tpW = W * 0.22, tpH = H * 0.16, tpX = W * 0.39, tpY = H * 0.04;
      ctx.fillStyle = C.cream3; ctx.fillRect(tpX, tpY, tpW, tpH);
      ctx.strokeStyle = C.tan; ctx.lineWidth = 2;
      ctx.strokeRect(tpX + 4, tpY + 4, tpW - 8, tpH - 8);
      ctx.fillStyle = C.brown;
      ctx.font = `900 ${Math.max(24, W * 0.05)}px "Outfit", sans-serif`;
      ctx.fillText('TIME', tpX + tpW / 2, tpY + tpH * 0.65);

      // ── Right panel: MANIFEST + spiral ──
      const rpW = W * 0.22, rpH = H * 0.38, rpX = W * 0.76, rpY = H * 0.06;
      const rpG = ctx.createLinearGradient(rpX, rpY, rpX + rpW, rpY + rpH);
      rpG.addColorStop(0, '#f8c880'); rpG.addColorStop(1, C.coral);
      ctx.fillStyle = rpG; ctx.fillRect(rpX, rpY, rpW, rpH);
      ctx.strokeStyle = C.cream; ctx.lineWidth = 2;
      ctx.strokeRect(rpX + 4, rpY + 4, rpW - 8, rpH - 8);
      ctx.fillStyle = C.cream;
      ctx.font = `900 ${Math.max(11, W * 0.018)}px "Outfit", sans-serif`;
      ctx.fillText('MANIFEST', rpX + rpW / 2, rpY + rpH * 0.22);
      ctx.save(); ctx.translate(rpX + rpW / 2, rpY + rpH * 0.6);
      ctx.strokeStyle = C.cream; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const f = i / 200, a = spiralAngle + f * TAU * 4, r = f * rpW * 0.38;
        i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      ctx.stroke(); ctx.globalAlpha = 1; ctx.restore();
      ctx.textAlign = 'left';

      // ── Desk ──
      const deskY = H * 0.68;
      ctx.fillStyle = C.tanLt; ctx.fillRect(W * 0.1, deskY, W * 0.8, H * 0.06);
      ctx.fillStyle = C.tan;   ctx.fillRect(W * 0.1, deskY, W * 0.8, 4);

      // ── Man silhouette ──
      const bs = 0.97 + 0.03 * Math.sin(breathePhase);
      const sh = Math.min(W * 0.12, 100);
      ctx.save(); ctx.translate(W * 0.5, deskY); ctx.scale(bs, bs);
      ctx.fillStyle = '#7aadc8';
      ctx.beginPath(); ctx.roundRect(-sh*0.5, -sh*2.2, sh, sh*1.5, 8); ctx.fill();
      ctx.fillStyle = C.coralLt;
      ctx.beginPath(); ctx.roundRect(-sh*0.1, -sh*2.5, sh*0.2, sh*0.35, 4); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -sh*2.65, sh*0.28, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.cream; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-sh*0.12,-sh*2.2); ctx.lineTo(0,-sh*1.98); ctx.lineTo(sh*0.12,-sh*2.2); ctx.stroke();
      ctx.strokeStyle = '#7aadc8'; ctx.lineWidth = sh*0.18; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-sh*0.5,-sh*1.8); ctx.quadraticCurveTo(-sh*0.95,-sh*1.5,-sh*0.8,-sh*0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( sh*0.5,-sh*1.8); ctx.quadraticCurveTo( sh*0.95,-sh*1.5, sh*0.8,-sh*0.7); ctx.stroke();
      ctx.restore();

      // ── Big pointing hand (floating) ──
      const hSize = Math.min(W * 0.2, 180);
      const hY = H * 0.03 + Math.sin(handPhase) * 18;
      const hRot = Math.sin(handPhase * 0.6) * 0.12 - 0.1;
      ctx.save(); ctx.translate(W * 0.46 + hSize * 0.5, hY + hSize * 0.5); ctx.rotate(hRot);
      const hw = hSize * 0.55;
      ctx.fillStyle = C.coral;
      ctx.beginPath(); ctx.roundRect(-hw*0.35, 0, hw*0.7, hSize*0.55, 8); ctx.fill();
      ctx.beginPath(); ctx.roundRect(-hw*0.06,-hSize*0.46, hw*0.22, hSize*0.54, hw*0.1); ctx.fill();
      ctx.fillStyle = C.coralLt;
      ctx.beginPath(); ctx.roundRect( hw*0.06,-hSize*0.12, hw*0.2, hSize*0.28, hw*0.09); ctx.fill();
      ctx.beginPath(); ctx.roundRect( hw*0.18,-hSize*0.08, hw*0.18, hSize*0.24, hw*0.08); ctx.fill();
      ctx.beginPath(); ctx.roundRect( hw*0.29,-hSize*0.04, hw*0.15, hSize*0.2,  hw*0.07); ctx.fill();
      ctx.fillStyle = C.coral;
      ctx.beginPath(); ctx.roundRect(-hw*0.42, hSize*0.1, hw*0.17, hSize*0.26, hw*0.08); ctx.fill();
      ctx.restore();

      // ── Big eyeball on desk ──
      const eR = Math.min(W, H) * 0.065;
      const eX = W * 0.5 - eR * 0.6, eY = deskY - eR * 1.15;
      const blinkSq = Math.abs(Math.sin(bigEye.blinkP));
      ctx.save(); ctx.translate(eX, eY); ctx.scale(1, blinkSq < 0.1 ? 0.1 : blinkSq);
      const eg = ctx.createRadialGradient(-eR*0.2,-eR*0.25,eR*0.05,0,0,eR);
      eg.addColorStop(0,'#fdfcf8'); eg.addColorStop(0.75,'#f5f0e8'); eg.addColorStop(1,'rgba(180,150,120,0.4)');
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(0,0,eR,0,TAU); ctx.fill();
      for (let v = 0; v < 8; v++) {
        const va = (v/8)*TAU;
        ctx.strokeStyle='rgba(210,100,80,0.22)'; ctx.lineWidth=0.7;
        ctx.beginPath(); ctx.moveTo(Math.cos(va)*eR*0.42,Math.sin(va)*eR*0.42);
        ctx.quadraticCurveTo(Math.cos(va+0.4)*eR*0.7,Math.sin(va+0.4)*eR*0.7,Math.cos(va+0.15)*eR*0.92,Math.sin(va+0.15)*eR*0.92); ctx.stroke();
      }
      const iR = eR * 0.52;
      const iG = ctx.createRadialGradient(0,0,iR*0.1,0,0,iR);
      iG.addColorStop(0,'#3d7abf'); iG.addColorStop(0.5,'#2a5a9a'); iG.addColorStop(1,'rgba(0,30,80,0.7)');
      ctx.fillStyle=iG; ctx.beginPath(); ctx.arc(0,0,iR,0,TAU); ctx.fill();
      const lX=Math.cos(bigEye.irisAngle)*iR*0.22, lY=Math.sin(bigEye.irisAngle)*iR*0.22;
      ctx.fillStyle='#0a0f1e'; ctx.beginPath(); ctx.arc(lX,lY,iR*0.5,0,TAU); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(-eR*0.18,-eR*0.2,eR*0.1,0,TAU); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.5)';  ctx.beginPath(); ctx.arc( eR*0.08,-eR*0.28,eR*0.05,0,TAU); ctx.fill();
      ctx.restore();

      // ── Small floating eyeballs ──
      EYES.forEach(e => {
        e.phase += 0.02; e.x += e.vx*0.001; e.y += e.vy*0.001;
        if (e.x<0.04||e.x>0.96) e.vx*=-1; if (e.y<0.04||e.y>0.90) e.vy*=-1;
        e.bPhase += e.bSpeed;
        const bSq = Math.abs(Math.sin(e.bPhase)), er = e.r;
        ctx.save(); ctx.translate(e.x*W, e.y*H); ctx.scale(1, bSq<0.08?0.08:bSq);
        const esg = ctx.createRadialGradient(-er*0.2,-er*0.2,er*0.05,0,0,er);
        esg.addColorStop(0,'#fefcf8'); esg.addColorStop(0.8,'#f0ece0'); esg.addColorStop(1,'rgba(180,150,110,0.4)');
        ctx.fillStyle=esg; ctx.beginPath(); ctx.arc(0,0,er,0,TAU); ctx.fill();
        ctx.fillStyle=e.irisCol+'cc'; ctx.beginPath(); ctx.arc(0,0,er*0.5,0,TAU); ctx.fill();
        ctx.fillStyle='#0a0e1a'; ctx.beginPath(); ctx.arc(Math.cos(e.phase)*er*0.12,Math.sin(e.phase*0.7)*er*0.12,er*0.28,0,TAU); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(-er*0.2,-er*0.2,er*0.1,0,TAU); ctx.fill();
        ctx.restore();
      });

      // ── Telephone ──
      const telX=W*0.22, telY=deskY-H*0.045, telS=Math.min(H*0.08,55);
      ctx.fillStyle=C.brownLt; ctx.beginPath(); ctx.roundRect(telX,telY,telS*1.5,telS,6); ctx.fill();
      ctx.fillStyle=C.brown; ctx.beginPath(); ctx.roundRect(telX+telS*0.2,telY-telS*0.38,telS*1.1,telS*0.42,14); ctx.fill();
      ctx.strokeStyle=C.brownLt; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(telX+telS*0.2,telY-telS*0.16); ctx.quadraticCurveTo(telX-telS*0.08,telY+telS*0.2,telX+telS*0.3,telY+telS*0.55); ctx.stroke();

      // ── Book stack ──
      const bkX=W*0.72, bkY=deskY-H*0.06, bkW=Math.min(W*0.06,50), bkH=Math.min(H*0.015,12);
      [C.coral,C.skyDk,C.tanLt,C.brown,C.coral2,C.cream3].forEach((c,i) => {
        const w2=bkW*(0.85+i*0.04);
        ctx.fillStyle=c; ctx.beginPath(); ctx.roundRect(bkX-w2*0.15,bkY+i*bkH*1.05,w2,bkH,2); ctx.fill();
        ctx.strokeStyle='rgba(0,0,0,0.08)'; ctx.lineWidth=0.5; ctx.strokeRect(bkX-w2*0.15,bkY+i*bkH*1.05,w2,bkH);
      });

      // ── Orange wavy blob (right edge) ──
      ctx.save(); ctx.fillStyle=C.coral; ctx.globalAlpha=0.55;
      ctx.beginPath(); ctx.moveTo(W,0);
      for (let y=0;y<=H;y+=6) {
        const xOff=Math.sin(y/H*TAU*2.5+waveT)*W*0.055+Math.sin(y/H*TAU*1.2+waveT*0.7)*W*0.03;
        ctx.lineTo(W-W*0.08+xOff,y);
      }
      ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
      ctx.fillStyle=C.coralLt; ctx.globalAlpha=0.35;
      ctx.beginPath(); ctx.moveTo(W,0);
      for (let y=0;y<=H;y+=6) {
        const xOff=Math.sin(y/H*TAU*2.5+waveT+0.8)*W*0.035+Math.sin(y/H*TAU+waveT*0.5)*W*0.02;
        ctx.lineTo(W-W*0.035+xOff,y);
      }
      ctx.lineTo(W,H); ctx.closePath(); ctx.fill(); ctx.globalAlpha=1; ctx.restore();

      // ── "VISIONS" text ──
      const visSize=Math.max(28,Math.min(W*0.075,72));
      ctx.save(); ctx.font=`900 ${visSize}px "Outfit",sans-serif`; ctx.fillStyle=C.coral;
      ctx.textAlign='center'; ctx.globalAlpha=0.55+0.12*Math.sin(t*0.018);
      ctx.fillText('VISIONS',W*0.46,H*0.94); ctx.restore();

      // ── Scrim ──
      const scrim=ctx.createLinearGradient(0,0,0,H);
      scrim.addColorStop(0,'rgba(254,246,228,0.40)'); scrim.addColorStop(0.5,'rgba(254,246,228,0.28)'); scrim.addColorStop(1,'rgba(254,246,228,0.44)');
      ctx.fillStyle=scrim; ctx.fillRect(0,0,W,H);

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─────────────────────────────────────────────────────────
     SCREEN 2 — LANDING + WAIT SCREEN
     Faithful animated recreation of Image 2:
       • Light warm cream base
       • Vertical amber/terracotta colour bands
       • Person in golden-yellow striped top with mic (centre)
       • Speaker/loudspeaker (left side)
       • Multiple white outlined sign-language hands floating
       • Sparkle star glints
       • Sound ripples from speaker
  ─────────────────────────────────────────────────────────── */
  function initLandingBg() {
    ['landing','waitScreen'].forEach(screenId => {
      const wrap = document.getElementById(screenId);
      if (!wrap) return;
      const old = wrap.querySelector('canvas[data-bg]');
      if (old) old.remove();

      const cv = document.createElement('canvas');
      cv.setAttribute('data-bg','true');
      cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
      wrap.style.position='relative';
      wrap.prepend(cv);
      const ctx=cv.getContext('2d');

      let W,H;
      const resize=()=>{ W=cv.width=window.innerWidth; H=cv.height=window.innerHeight; };
      resize(); window.addEventListener('resize',resize);

      const C = {
        cream:'#fef3d0', cream2:'#fdebc0', amber:'#e8a840', amber2:'#f0bc60',
        amberLt:'#f8d498', terra:'#c47038', terra2:'#d88048',
        bark:'#7c4820', bark2:'#9a6030', gold:'#f5c842', goldLt:'#fad870',
        skin:'#f5c898',
      };

      const PANELS=[
        {x:0,    w:0.16, topCol:C.bark,  botCol:'#5a3010', a:0.72},
        {x:0.16, w:0.20, topCol:C.cream2,botCol:C.amberLt, a:0.62},
        {x:0.36, w:0.28, topCol:C.terra2,botCol:C.terra,   a:0.68},
        {x:0.64, w:0.20, topCol:C.amber, botCol:C.terra,   a:0.65},
        {x:0.84, w:0.16, topCol:C.bark2, botCol:C.bark,    a:0.70},
      ];

      const HAND_SHAPES=[
        {t:'open',   x:.08,y:.22,sz:.055,rot: .2, vx:.0002, vy:-.0001,rs:.004, a:.75,p:rand(0,TAU)},
        {t:'peace',  x:.82,y:.18,sz:.045,rot:-.15,vx:-.0002,vy: .0001,rs:-.005,a:.70,p:rand(0,TAU)},
        {t:'fist',   x:.12,y:.62,sz:.04, rot: .4, vx:.0001, vy:-.0002,rs:.003, a:.65,p:rand(0,TAU)},
        {t:'point',  x:.80,y:.58,sz:.05, rot:-.3, vx:-.0001,vy: .0002,rs:-.004,a:.72,p:rand(0,TAU)},
        {t:'thumbUp',x:.05,y:.42,sz:.038,rot: .1, vx:.00015,vy:-.00015,rs:.006,a:.60,p:rand(0,TAU)},
        {t:'wave',   x:.88,y:.40,sz:.042,rot:-.2, vx:-.00018,vy:.00018,rs:-.003,a:.68,p:rand(0,TAU)},
        {t:'iLoveU', x:.22,y:.82,sz:.048,rot: .05,vx:.0001, vy:-.0001,rs:.005, a:.55,p:rand(0,TAU)},
        {t:'ok',     x:.72,y:.78,sz:.04, rot:-.1, vx:-.0001,vy: .0001,rs:-.004,a:.60,p:rand(0,TAU)},
        {t:'open',   x:.44,y:.88,sz:.035,rot: .3, vx:.00008,vy:-.00012,rs:.007,a:.50,p:rand(0,TAU)},
        {t:'peace',  x:.55,y:.10,sz:.03, rot:-.25,vx:-.00012,vy:.00008,rs:-.005,a:.55,p:rand(0,TAU)},
      ];

      const SPARKS=Array.from({length:28},()=>({
        x:rand(0,1),y:rand(0,1),s:rand(3,8),phase:rand(0,TAU),
        speed:rand(0.04,0.09),col:[C.gold,C.amber2,'#ffffff',C.goldLt][rI(0,3)],
      }));
      const RIPPLES=Array.from({length:5},(_,i)=>({phase:(i/5)*TAU,speed:0.022}));

      let swayPhase=0, mouthPhase=0, speakerVibe=0, t=0;

      // ── Draw schematic hand shapes ──
      function drawHand(ctx,type,size) {
        const s=size;
        ctx.fillStyle='rgba(255,255,255,0.20)';
        ctx.strokeStyle='rgba(255,255,255,0.85)';
        ctx.lineWidth=Math.max(1.8,s*0.045);
        ctx.lineCap='round'; ctx.lineJoin='round';

        if(type==='open'){
          ctx.beginPath(); ctx.roundRect(-s*.30,-s*.50,s*.60,s*.45,s*.06); ctx.fill(); ctx.stroke();
          for(let f=0;f<5;f++){
            const fx=-s*.30+f*s*.14, fh=s*(.24+Math.sin((f+.5)*.8)*.05);
            ctx.beginPath(); ctx.roundRect(fx,-s*.50-fh,s*.10,fh,s*.05); ctx.fill(); ctx.stroke();
          }
        } else if(type==='peace'){
          ctx.beginPath(); ctx.roundRect(-s*.26,-s*.50,s*.50,s*.42,s*.06); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect(-s*.10,-s*.90,s*.09,s*.44,s*.04); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect( s*.04,-s*.88,s*.09,s*.42,s*.04); ctx.fill(); ctx.stroke();
        } else if(type==='fist'){
          ctx.beginPath(); ctx.roundRect(-s*.28,-s*.38,s*.56,s*.42,s*.08); ctx.fill(); ctx.stroke();
          ctx.strokeStyle='rgba(255,255,255,0.40)'; ctx.lineWidth=s*.025;
          for(let j=0;j<3;j++){ctx.beginPath();ctx.moveTo(-s*.12+j*s*.14,-s*.14);ctx.lineTo(-s*.06+j*s*.14,-s*.14);ctx.stroke();}
        } else if(type==='point'){
          ctx.beginPath(); ctx.roundRect(-s*.26,-s*.28,s*.52,s*.38,s*.08); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect(-s*.06,-s*.70,s*.13,s*.44,s*.05); ctx.fill(); ctx.stroke();
        } else if(type==='thumbUp'){
          ctx.beginPath(); ctx.roundRect(-s*.26,-s*.33,s*.52,s*.38,s*.08); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect(-s*.36,-s*.52,s*.13,s*.38,s*.05); ctx.fill(); ctx.stroke();
        } else if(type==='wave'){
          ctx.beginPath(); ctx.roundRect(-s*.26,-s*.46,s*.54,s*.42,s*.06); ctx.fill(); ctx.stroke();
          for(let f=0;f<5;f++){
            const fx=-s*.28+f*s*.14, fh=s*(.22+Math.sin(f*.9+mouthPhase*.5)*.07);
            ctx.beginPath(); ctx.roundRect(fx,-s*.46-fh,s*.09,fh,s*.04); ctx.fill(); ctx.stroke();
          }
        } else if(type==='iLoveU'){
          ctx.beginPath(); ctx.roundRect(-s*.26,-s*.34,s*.52,s*.38,s*.08); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect(-s*.06,-s*.72,s*.11,s*.40,s*.05); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect( s*.14,-s*.66,s*.11,s*.34,s*.05); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect(-s*.33,-s*.52,s*.10,s*.32,s*.04); ctx.fill(); ctx.stroke();
        } else if(type==='ok'){
          ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=s*.055;
          ctx.beginPath(); ctx.arc(s*.06,-s*.34,s*.21,0,TAU); ctx.stroke();
          for(let f=1;f<4;f++){
            ctx.beginPath(); ctx.roundRect(s*.08+f*s*.10,-s*.48+f*s*.05,s*.08,s*.28,3);
            ctx.fillStyle='rgba(255,255,255,0.20)'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=s*.04; ctx.stroke();
          }
        }
      }

      function draw(){
        t++; swayPhase+=.016; mouthPhase+=.05; speakerVibe+=.08;

        // Base cream
        ctx.fillStyle=C.cream; ctx.fillRect(0,0,W,H);

        // Vertical panels
        PANELS.forEach(p=>{
          const pulse=.92+.08*Math.sin(t*.01+p.x*6);
          const g=ctx.createLinearGradient(p.x*W,0,p.x*W,H);
          g.addColorStop(0,p.topCol); g.addColorStop(1,p.botCol);
          ctx.fillStyle=g; ctx.globalAlpha=p.a*pulse;
          ctx.fillRect(p.x*W,0,p.w*W,H); ctx.globalAlpha=1;
        });

        // Top light overlay
        const hOver=ctx.createLinearGradient(0,0,0,H);
        hOver.addColorStop(0,'rgba(254,243,208,0.52)');
        hOver.addColorStop(0.3,'rgba(254,243,208,0.22)');
        hOver.addColorStop(1,'rgba(254,243,208,0.08)');
        ctx.fillStyle=hOver; ctx.fillRect(0,0,W,H);

        // Speaker (left)
        const spX=W*.088, spY=H*.3, spW=Math.min(W*.055,52), spH=Math.min(H*.2,148);
        ctx.save(); ctx.translate(spX+Math.sin(speakerVibe)*1.2,spY);
        ctx.fillStyle=C.bark; ctx.beginPath(); ctx.roundRect(-spW*.5,0,spW,spH,6); ctx.fill();
        ctx.fillStyle=C.bark2; ctx.beginPath(); ctx.arc(0,spH*.35,spW*.42,0,TAU); ctx.fill();
        ctx.fillStyle='#3a1e08'; ctx.beginPath(); ctx.arc(0,spH*.35,spW*.22,0,TAU); ctx.fill();
        ctx.strokeStyle=C.amber2; ctx.lineWidth=1.5;
        for(let r=1;r<=3;r++){ctx.beginPath();ctx.arc(0,spH*.35,spW*.42*(r/4),0,TAU);ctx.stroke();}
        ctx.fillStyle=C.bark2; ctx.beginPath(); ctx.arc(0,spH*.15,spW*.20,0,TAU); ctx.fill();
        ctx.fillStyle='#3a1e08'; ctx.beginPath(); ctx.arc(0,spH*.15,spW*.10,0,TAU); ctx.fill();
        ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=1;
        for(let g2=0;g2<5;g2++){const gy2=spH*.55+g2*spH*.09;if(gy2<spH-6){ctx.beginPath();ctx.moveTo(-spW*.35,gy2);ctx.lineTo(spW*.35,gy2);ctx.stroke();}}
        ctx.restore();

        // Sound ripples
        const sCX=W*.13, sCY=H*.42;
        RIPPLES.forEach(rp=>{
          rp.phase+=rp.speed;
          const rr=((rp.phase%TAU)/TAU)*W*.28, ra=.30*(1-rr/(W*.28));
          if(ra>.01){ctx.save();ctx.globalAlpha=ra;ctx.strokeStyle=C.amber2;ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(sCX,sCY,rr,0,TAU);ctx.stroke();ctx.restore();}
        });

        // Person
        const pX=W*.5, pY=H*.08, sway=Math.sin(swayPhase)*4;
        const bodyH=Math.min(H*.65,520), bodyW=bodyH*.42;
        ctx.save(); ctx.translate(pX+sway,pY);
        // Torso golden stripe
        ctx.fillStyle=C.gold;
        ctx.beginPath(); ctx.roundRect(-bodyW*.5,bodyH*.18,bodyW,bodyH*.5,12); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.roundRect(-bodyW*.5,bodyH*.18,bodyW,bodyH*.5,12); ctx.clip();
        ctx.strokeStyle='rgba(180,130,0,0.22)'; ctx.lineWidth=bodyW*.048;
        for(let s2=-2;s2<8;s2++){ctx.beginPath();ctx.moveTo(-bodyW*.5+s2*bodyW*.14,bodyH*.18);ctx.lineTo(-bodyW*.5+s2*bodyW*.14,bodyH*.68);ctx.stroke();}
        ctx.restore();
        // Bag strap
        ctx.strokeStyle=C.bark; ctx.lineWidth=bodyW*.032; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(-bodyW*.35,bodyH*.22); ctx.quadraticCurveTo(bodyW*.05,bodyH*.45,bodyW*.28,bodyH*.62); ctx.stroke();
        ctx.fillStyle=C.bark; ctx.beginPath(); ctx.roundRect(bodyW*.16,bodyH*.52,bodyW*.22,bodyW*.2,4); ctx.fill();
        // Neck
        ctx.fillStyle=C.skin; ctx.beginPath(); ctx.roundRect(-bodyW*.08,bodyH*.12,bodyW*.16,bodyH*.08,4); ctx.fill();
        // Head
        ctx.beginPath(); ctx.ellipse(0,bodyH*.07,bodyW*.17,bodyW*.2,0,0,TAU); ctx.fill();
        // Mouth
        const mO=.3+.25*Math.abs(Math.sin(mouthPhase));
        ctx.fillStyle='#4a1e08'; ctx.beginPath(); ctx.ellipse(0,bodyH*.085,bodyW*.055,bodyW*.04*mO,0,0,TAU); ctx.fill();
        // Eyes
        ctx.fillStyle='#2a0e04';
        ctx.beginPath(); ctx.arc(-bodyW*.055,bodyH*.058,bodyW*.022,0,TAU); ctx.fill();
        ctx.beginPath(); ctx.arc( bodyW*.055,bodyH*.058,bodyW*.022,0,TAU); ctx.fill();
        // Mic
        ctx.fillStyle='#3a1e08'; ctx.beginPath(); ctx.roundRect(bodyW*.04,bodyH*.16,bodyW*.065,bodyH*.18,6); ctx.fill();
        ctx.fillStyle='#1a0a04'; ctx.beginPath(); ctx.arc(bodyW*.04+bodyW*.033,bodyH*.16,bodyW*.055,0,TAU); ctx.fill();
        // Left arm up
        ctx.strokeStyle=C.skin; ctx.lineWidth=bodyW*.12; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(-bodyW*.46,bodyH*.28); ctx.quadraticCurveTo(-bodyW*.68,bodyH*.1,-bodyW*.55,bodyH*-.04+Math.sin(swayPhase*1.2)*8); ctx.stroke();
        ctx.fillStyle=C.skin; ctx.beginPath(); ctx.arc(-bodyW*.56,bodyH*-.04+Math.sin(swayPhase*1.2)*8,bodyW*.1,0,TAU); ctx.fill();
        // Right arm mic
        ctx.strokeStyle=C.skin; ctx.lineWidth=bodyW*.12;
        ctx.beginPath(); ctx.moveTo(bodyW*.46,bodyH*.28); ctx.quadraticCurveTo(bodyW*.6,bodyH*.38,bodyW*.5,bodyH*.42); ctx.stroke();
        ctx.restore();

        // Floating sign hands
        HAND_SHAPES.forEach(h=>{
          h.x+=h.vx; h.y+=h.vy; h.rot+=h.rs; h.p+=.018;
          if(h.x<.02||h.x>.98) h.vx*=-1;
          if(h.y<.02||h.y>.95) h.vy*=-1;
          const hSz=Math.min(W,H)*h.sz;
          ctx.save();
          ctx.translate(h.x*W,h.y*H);
          ctx.rotate(h.rot+Math.sin(h.p*.5)*.08);
          ctx.globalAlpha=h.a*(.75+.25*Math.sin(h.p));
          drawHand(ctx,h.t,hSz);
          ctx.globalAlpha=1; ctx.restore();
        });

        // Sparkles
        SPARKS.forEach(s=>{
          s.phase+=s.speed;
          const sa=.5+.5*Math.sin(s.phase), sz=s.s*sa;
          ctx.save(); ctx.translate(s.x*W,s.y*H); ctx.globalAlpha=sa*.85;
          ctx.fillStyle=s.col; ctx.beginPath();
          for(let sp=0;sp<4;sp++){
            const a0=(sp/4)*TAU-Math.PI*.5, a1=a0+TAU/8;
            ctx.lineTo(Math.cos(a0)*sz,Math.sin(a0)*sz);
            ctx.lineTo(Math.cos(a1)*sz*.38,Math.sin(a1)*sz*.38);
          }
          ctx.closePath(); ctx.fill(); ctx.globalAlpha=1; ctx.restore();
        });

        // Scrim
        const scrim=ctx.createLinearGradient(0,0,0,H);
        scrim.addColorStop(0,'rgba(254,243,208,0.36)');
        scrim.addColorStop(.5,'rgba(254,243,208,0.20)');
        scrim.addColorStop(1,'rgba(254,243,208,0.38)');
        ctx.fillStyle=scrim; ctx.fillRect(0,0,W,H);

        requestAnimationFrame(draw);
      }
      draw();
    });
  }

  function init(){ initFbBg(); initLandingBg(); }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',init);
  else init();
})();
