// ============================================================
//  app.js — Main App Logic: State, UI, Camera, TTS, STT
// ============================================================

// ── LANGUAGE CONFIG ──
const LANG_NAMES = {
  'en-IN': 'English',  'hi-IN': 'हिंदी',    'ta-IN': 'தமிழ்',
  'te-IN': 'తెలుగు',  'bn-IN': 'বাংলা',   'mr-IN': 'मराठी',
  'gu-IN': 'ગુજરાતી', 'kn-IN': 'ಕನ್ನಡ',   'ml-IN': 'മലയാളം',
  'pa-IN': 'ਪੰਜਾਬੀ'
};
const LANG_CLASSES = {
  'hi':'hi', 'ta':'ta', 'te':'te', 'bn':'bn',
  'mr':'hi', 'gu':'gu', 'kn':'kn', 'ml':'ml', 'pa':'pa'
};

// ── APP STATE ──
let mode         = 'create';
let role         = null;
let roomCode     = '';
let db           = null;
let useFirebase  = false;
let roomRef      = null;
let bcChan       = null;
let lastG        = '';
let gHold        = 0;
let srActive     = false;
let sr           = null;
let selectedLang = 'en-IN';

// ── BOOT ──
window.addEventListener('DOMContentLoaded', () => {
  // Pre-load saved Firebase config
  const cfg = loadCfg();
  if (cfg && cfg.apiKey && cfg.databaseURL && cfg.projectId) {
    const banner = document.getElementById('savedBanner');
    banner.style.display = 'flex';
    document.getElementById('savedLabel').textContent = 'Project: ' + cfg.projectId;
    document.getElementById('fKey').value = cfg.apiKey;
    document.getElementById('fDb').value  = cfg.databaseURL;
    document.getElementById('fPid').value = cfg.projectId;
    chkFb();
    toast('✅ Saved config loaded — click "Use Saved"', 'var(--green)');
  }

  // Pre-load TTS voices
  window.speechSynthesis?.getVoices();
  window.speechSynthesis?.addEventListener('voiceschanged', () => {});
});

// ── LANDING ──
function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ234567890';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  document.getElementById('codeInp').value = code;
  chkReady();
}

function setMode(m) {
  mode = m;
  document.querySelectorAll('.mode-btn').forEach((b, i) =>
    b.classList.toggle('on', (i === 0 && m === 'create') || (i === 1 && m === 'join'))
  );
  if (m === 'create') genCode();
  else { document.getElementById('codeInp').value = ''; chkReady(); }
}

function pickRole(r) {
  role = r;
  document.getElementById('cMute').className  = 'role-card' + (r === 'mute'  ? ' sel-m' : '');
  document.getElementById('cSpeak').className = 'role-card' + (r === 'speak' ? ' sel-s' : '');
  chkReady();
}

function chkReady() {
  const v  = document.getElementById('codeInp').value.trim();
  const ok = v.length >= 3 && role !== null;
  document.getElementById('btnEnter').classList.toggle('on', ok);
}

// ── CALL SETUP ──
function launchCall() {
  document.getElementById('waitScreen').style.display = 'none';
  document.getElementById('callScreen').style.display = 'flex';
  document.getElementById('discBar').classList.remove('on');
  buildGestureLegend();
  buildISL();
  buildAlpha();
  if (role === 'mute') initCamera();
}

// ── GESTURE LEGEND + SEARCH ──
function buildGestureLegend(list) {
  const grid = document.getElementById('glGrid');
  grid.innerHTML = '';
  const items = list || GESTURE_DEFS;
  document.getElementById('glCount').textContent = items.length + '/' + GESTURE_DEFS.length;
  items.forEach(d => {
    const el = document.createElement('div');
    el.className = 'gl-item';
    el.innerHTML = `<span class="gi-e">${d.emoji}</span><span class="gi-w">${d.en}</span><span class="gi-h">${d.hi}</span>`;
    el.title     = d.name + ': ' + d.en + ' · ' + d.hi + ' [' + d.group + ']';
    el.onclick   = () => addWord(d.en);
    grid.appendChild(el);
  });
}

function filterGestures(q) {
  q = q.toLowerCase().trim();
  if (!q) { buildGestureLegend(); return; }
  const filtered = GESTURE_DEFS.filter(d =>
    d.en.toLowerCase().includes(q) ||
    d.hi.includes(q) ||
    d.name.toLowerCase().includes(q) ||
    d.group.toLowerCase().includes(q)
  );
  buildGestureLegend(filtered);
}

// ── ISL WORD PANEL ──
function buildISL() {
  const cats = Object.keys(ISL_DATA);
  const tabs = document.getElementById('islTabs');
  tabs.innerHTML = '';
  cats.forEach((cat, i) => {
    const b = document.createElement('button');
    b.className = 'isl-t' + (i === 0 ? ' on' : '');
    b.textContent = cat;
    b.onclick = () => {
      document.querySelectorAll('.isl-t').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      renderWords(cat);
    };
    tabs.appendChild(b);
  });
  renderWords(cats[0]);
}

function renderWords(cat) {
  const el = document.getElementById('islWords');
  el.innerHTML = '';
  ISL_DATA[cat].forEach(w => {
    const hi = TR[w]?.hi || '';
    const c = document.createElement('div');
    c.className = 'word-chip';
    c.innerHTML = `<span class="wc-en">${w}</span>${hi ? `<span class="wc-hi">${hi}</span>` : ''}`;
    c.onclick   = () => addWord(w);
    el.appendChild(c);
  });
}

// ── ALPHABET ──
function buildAlpha() {
  const el = document.getElementById('alphaRow');
  el.innerHTML = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(l => {
    const k = document.createElement('div');
    k.className   = 'akey';
    k.textContent = l;
    k.onclick     = () => {
      const box = document.getElementById('cbox');
      box.textContent = (box.textContent || '') + l;
      updateBilingual();
    };
    el.appendChild(k);
  });
}

// ── COMPOSE BOX ──
function addWord(w) {
  const box = document.getElementById('cbox');
  const cur = box.textContent.trim();
  box.textContent = cur ? cur + ' ' + w : w;
  updateBilingual();
  const hi = TR[w]?.hi || '';
  toast('✍️ ' + w + (hi ? ' · ' + hi : ''), 'var(--purple)');
}

function clearCbox() {
  document.getElementById('cbox').textContent       = '';
  document.getElementById('biliHi').textContent     = '';
  document.getElementById('biliLang').textContent   = '';
  document.getElementById('biliLang').classList.remove('on');
  lastG = ''; gHold = 0;
}

// ── BILINGUAL PREVIEW ──
function updateBilingual() {
  const txt   = document.getElementById('cbox').textContent.trim();
  const hiEl  = document.getElementById('biliHi');
  const langEl = document.getElementById('biliLang');

  if (!txt) {
    hiEl.textContent = ''; langEl.textContent = ''; langEl.classList.remove('on'); return;
  }

  const words = txt.split(/\s+/);

  // Always show Hindi
  const hiText = words.map(w => TR[w]?.hi || w).join(' ');
  hiEl.textContent = hiText !== txt ? hiText : '';

  // Show selected regional language (if not Hindi or English)
  const code = selectedLang.split('-')[0];
  if (code !== 'en' && code !== 'hi') {
    const ltext = words.map(w => getTr(w, selectedLang) || w).join(' ');
    if (ltext !== txt) {
      langEl.textContent = (LANG_NAMES[selectedLang] || selectedLang) + ': ' + ltext;
      langEl.className   = 'bili-lang on ' + (LANG_CLASSES[code] || '');
    } else { langEl.textContent = ''; langEl.classList.remove('on'); }
  } else { langEl.textContent = ''; langEl.classList.remove('on'); }
}

// ── LANGUAGE CHANGE ──
function onLangChange() {
  selectedLang = document.getElementById('langSel').value;
  updateBilingual();
  toast('🌐 Voice: ' + LANG_NAMES[selectedLang], 'var(--purple)');
}

// ── CAMERA + MEDIAPIPE ──
async function initCamera() {
  const st = document.getElementById('camSt');
  st.textContent = '⏳ Starting…';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ width:640, height:480 }, audio:false });
    const v = document.getElementById('camVideo');
    v.srcObject = stream;
    await v.play();
    st.textContent = '📷 Camera on';
    initMP(v);
  } catch (e) {
    st.textContent = '⚠️ No camera';
    document.getElementById('vidWrap').style.display = 'none';
  }
}

function initMP(vid) {
  const st = document.getElementById('camSt');
  try {
    const h = new Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
    h.setOptions({ maxNumHands:1, modelComplexity:1, minDetectionConfidence:.65, minTrackingConfidence:.5 });
    h.onResults(onHR);
    const c   = document.getElementById('handCanvas');
    c.width   = 640; c.height = 480;
    const cam = new Camera(vid, { onFrame: async () => await h.send({ image:vid }), width:640, height:480 });
    cam.start().then(() => { st.textContent = '✅ Hand tracking'; });
  } catch (e) {
    st.textContent = '📷 Camera ready';
  }
}

function onHR(res) {
  const c   = document.getElementById('handCanvas');
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);

  if (res.multiHandLandmarks?.length) {
    const lm = res.multiHandLandmarks[0];
    drawConnectors(ctx, lm, HAND_CONNECTIONS, { color:'#ff7043', lineWidth:2 });
    drawLandmarks(ctx, lm, { color:'#26d4a0', lineWidth:1, radius:3 });

    document.getElementById('gpDot').style.display    = 'inline-block';
    document.getElementById('gBarWrap').style.display = 'block';

    const g = classifyGesture(lm);
    if (g) {
      document.getElementById('gpTxt').textContent = `${g.emoji} ${g.en}`;
      document.getElementById('gpHi').textContent  = g.hi;

      if (g.name === lastG) { gHold++; }
      else { gHold = 0; lastG = g.name; }

      document.getElementById('gBar').style.width = Math.min((gHold / 10) * 100, 100) + '%';

      // Auto-send after holding gesture for ~1.5s (10 frames)
      if (gHold >= 10) {
        addWord(g.en);
        gHold = 0; lastG = '';
        document.getElementById('gBar').style.width = '0%';
        setTimeout(() => {
          if (document.getElementById('cbox').textContent.trim()) sendMsg();
        }, 300);
      }
    } else {
      document.getElementById('gpTxt').textContent = 'Hand detected…';
      document.getElementById('gpHi').textContent  = '';
      gHold = 0;
      document.getElementById('gBar').style.width = '0%';
    }
  } else {
    document.getElementById('gpDot').style.display    = 'none';
    document.getElementById('gBarWrap').style.display = 'none';
    document.getElementById('gpTxt').textContent      = 'Position hands in frame';
    document.getElementById('gpHi').textContent       = '';
    gHold = 0; lastG = '';
  }
}

// ── TTS (Text-to-Speech) ──
function speakTTS(text, lang) {
  if (!window.speechSynthesis || !text) return;
  speechSynthesis.cancel();

  function doSpeak() {
    const u    = new SpeechSynthesisUtterance(text);
    u.lang     = lang;   // always set lang — browser will use it even if no explicit voice found
    u.rate     = 0.88;
    u.pitch    = 1;
    u.volume   = 1;

    const vs   = speechSynthesis.getVoices();
    const code = lang.split('-')[0]; // e.g. "hi" from "hi-IN"

    // Find best voice for the requested language — do NOT fall back to English
    const voice =
      vs.find(v => v.lang === lang) ||
      vs.find(v => v.lang.toLowerCase() === lang.toLowerCase()) ||
      vs.find(v => v.lang === code + '-IN') ||
      vs.find(v => v.lang.startsWith(code + '-')) ||
      vs.find(v => v.lang === code);
    // If no match found: don't force English — leave u.voice unset so browser
    // uses its own default for u.lang (correct behaviour on Chrome/Android)

    if (voice) u.voice = voice;

    u.onstart = () => {
      const els = document.querySelectorAll('.b-tts');
      els[els.length - 1]?.classList.add('on');
    };
    u.onend = () => {
      document.querySelectorAll('.b-tts.on').forEach(e => e.classList.remove('on'));
    };

    speechSynthesis.speak(u);
  }

  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    doSpeak();
  } else {
    speechSynthesis.addEventListener('voiceschanged', function handler() {
      speechSynthesis.removeEventListener('voiceschanged', handler);
      doSpeak();
    });
  }
}

// ── STT (Speech-to-Text) ──
function toggleMic() {
  const btn = document.getElementById('micBtn');
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    toast('⚠️ STT not supported in this browser', 'var(--gold)'); return;
  }
  if (srActive) { sr?.stop(); srActive = false; btn.classList.remove('on'); return; }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  sr = new SR();
  sr.continuous     = false;
  sr.interimResults = true;
  sr.lang           = selectedLang;

  sr.onstart = () => {
    srActive = true;
    btn.classList.add('on');
    toast('🎤 Listening in ' + LANG_NAMES[selectedLang] + '…', 'var(--green)');
  };

  sr.onresult = e => {
    let interim = '';
    let final   = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += t;
      else interim += t;
    }
    // Show interim text in the box while speaking
    document.getElementById('replyInp').value = final || interim;
    autoH(document.getElementById('replyInp'));

    // Auto-send as soon as a final result arrives — no need to press Send
    if (final.trim()) {
      srActive = false;
      btn.classList.remove('on');
      sendReply();  // sends immediately with the spoken text
    }
  };

  sr.onend = () => {
    srActive = false;
    btn.classList.remove('on');
    // If box still has text (edge case) — send it
    const leftover = document.getElementById('replyInp').value.trim();
    if (leftover) sendReply();
  };

  sr.onerror = e => {
    srActive = false;
    btn.classList.remove('on');
    toast('⚠️ Mic error: ' + e.error, 'var(--red)');
  };

  sr.start();
}

// ── CHAT BUBBLE ──
function addBubble(from, text, translations, self) {
  const area  = document.getElementById('chatMsgs');
  const empty = document.getElementById('chatEmpty');
  if (empty) empty.remove();

  const d   = document.createElement('div');
  d.className = 'bubble from-' + from;

  const t   = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const who = from === 'mute' ? '🤟 Mute' : '🗣️ Hearing';

  // Build translation rows — always show Hindi, plus selected regional lang
  let trRows = '';
  const showLangs = ['hi'];
  const selCode   = selectedLang.split('-')[0];
  if (selCode !== 'en' && selCode !== 'hi') showLangs.push(selCode);

  showLangs.forEach(code => {
    const trText = translations[code];
    if (trText && trText !== text) {
      const cls  = LANG_CLASSES[code] || '';
      const flag = code === 'hi' ? '🇮🇳 हि' : LANG_NAMES[selectedLang]?.substring(0, 4);
      trRows += `<div class="b-tr-row"><span class="b-tr-label">${flag}</span><span class="b-tr-text ${cls}">${esc(trText)}</span></div>`;
    }
  });

  const trBlock = trRows ? `<div class="b-translations">${trRows}</div>` : '';
  d.innerHTML   = `<div class="b-meta">${who}<span class="b-dot"></span>${t}${self ? ' · you' : ''}</div><div class="b-en">${esc(text)}</div>${trBlock}<div class="b-tts">🔊 Speaking…</div>`;

  area.appendChild(d);
  area.scrollTop = area.scrollHeight;
}

// ── UTILS ──
function autoH(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 84) + 'px';
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function toast(msg, color = 'var(--blue)') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.borderLeftColor = color;
  el.textContent = msg;
  document.getElementById('toastWrap').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ── EVENT LISTENERS ──
document.addEventListener('input',   e => { if (e.target.id === 'cbox') updateBilingual(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'replyInp') {
    e.preventDefault(); sendReply();
  }
});
