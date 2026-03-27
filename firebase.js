// ============================================================
//  firebase.js — Firebase Init, Room Management, Messaging
// ============================================================

// ── CONFIG STORAGE ──
const LS_KEY = 'sb_v6';

function loadCfg() {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; }
  catch (e) { return null; }
}

function saveCfg(cfg) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); }
  catch (e) {}
}

// ── FIREBASE CONNECT ──
function connectFb() {
  const apiKey      = document.getElementById('fKey').value.trim();
  const databaseURL = document.getElementById('fDb').value.trim();
  const projectId   = document.getElementById('fPid').value.trim();

  if (!apiKey || !databaseURL || !projectId) {
    toast('⚠️ Fill all 3 fields', 'var(--gold)'); return;
  }

  try {
    let app;
    try { app = firebase.app(); }
    catch (e) {
      app = firebase.initializeApp({
        apiKey, databaseURL, projectId,
        authDomain:     projectId + '.firebaseapp.com',
        storageBucket:  projectId + '.appspot.com'
      });
    }

    db         = firebase.database(app);
    useFirebase = true;
    saveCfg({ apiKey, databaseURL, projectId });

    document.getElementById('fbScreen').style.display  = 'none';
    document.getElementById('landing').style.display   = 'flex';
    document.getElementById('connBadge').textContent   = '🔥 Firebase';
    toast('🔥 Firebase connected & config saved!', 'var(--orange)');
    genCode();
  } catch (e) {
    toast('❌ Firebase error: ' + e.message, 'var(--red)');
  }
}

// ── BROADCAST (same-device tab testing) ──
function useBroadcast() {
  useFirebase = false;
  document.getElementById('fbScreen').style.display  = 'none';
  document.getElementById('landing').style.display   = 'flex';
  document.getElementById('connBadge').textContent   = '📡 Tab-to-Tab';
  toast('ℹ️ Tab-to-tab mode — same device only', 'var(--blue)');
  genCode();
}

// ── ROOM ENTRY ──
function enterRoom() {
  roomCode = document.getElementById('codeInp').value.trim().toUpperCase();
  if (!roomCode || !role) return;

  document.getElementById('landing').style.display     = 'none';
  document.getElementById('waitScreen').style.display  = 'flex';
  document.getElementById('wtCode').textContent        = roomCode;
  document.getElementById('shareUrl').textContent      = location.href;
  document.getElementById('tbRoom').textContent        = 'ROOM: ' + roomCode;

  if (useFirebase) {
    _enterFirebaseRoom();
  } else {
    _enterBroadcastRoom();
  }
}

function _enterFirebaseRoom() {
  roomRef = db.ref('rooms/' + roomCode);
  roomRef.child('presence/' + role).set({ joined: Date.now(), role });

  // Watch for partner joining
  roomRef.child('presence').on('value', snap => {
    const d = snap.val() || {};
    const other = role === 'mute' ? 'speak' : 'mute';
    if (d[other] && document.getElementById('callScreen').style.display !== 'flex') {
      launchCall();
      toast('✅ Partner joined!', 'var(--green)');
    }
  });

  // Listen for incoming messages (only from the other role)
  roomRef.child('messages').on('child_added', snap => {
    const m = snap.val();
    if (m && m.from !== role) receiveMsg(m);
  });

  // Watch for partner disconnect
  roomRef.child('presence').on('child_removed', snap => {
    if (snap.key !== role) {
      document.getElementById('discBar').classList.add('on');
      toast('⚠️ Partner disconnected', 'var(--gold)');
    }
  });
}

function _enterBroadcastRoom() {
  bcChan = new BroadcastChannel('sb6-' + roomCode);
  bcChan.onmessage = e => {
    const m = e.data;
    if (m.t === 'join'  && m.role !== role) { bcChan.postMessage({ t:'ack', role }); launchCall(); toast('✅ Partner joined!', 'var(--green)'); }
    if (m.t === 'ack'   && m.role !== role) launchCall();
    if (m.t === 'msg')  receiveMsg(m);
    if (m.t === 'leave') { document.getElementById('discBar').classList.add('on'); toast('⚠️ Partner left', 'var(--gold)'); }
  };
  bcChan.postMessage({ t:'join', role });
}

// ── LEAVE ──
function leaveRoom() {
  if (useFirebase && roomRef) roomRef.child('presence/' + role).remove();
  else { bcChan?.postMessage({ t:'leave', role }); bcChan?.close(); }
  location.reload();
}

// ── SEND MESSAGE ──
function sendMsg() {
  const b = document.getElementById('cbox');
  const txt = b.textContent.trim();
  if (!txt) return;

  const words = txt.split(/\s+/);

  // Build translations for all 9 Indian languages
  const translations = {};
  Object.keys(LANG_NAMES).forEach(lang => {
    const lcode = lang.split('-')[0];
    if (lcode === 'en') return;
    const parts = words.map(w => (TR[w] && TR[w][lcode]) ? TR[w][lcode] : null);
    if (parts.some(p => p !== null)) {
      translations[lcode] = parts.map((p, i) => p || words[i]).join(' ');
    }
  });

  const obj = { from:'mute', text:txt, translations, lang:selectedLang, ts:Date.now() };

  if (useFirebase && roomRef) roomRef.child('messages').push(obj);
  else bcChan.postMessage({ t:'msg', ...obj });

  addBubble('mute', txt, translations, true);

  // Clear compose box
  b.textContent = '';
  document.getElementById('biliHi').textContent = '';
  document.getElementById('biliLang').textContent = '';
  document.getElementById('biliLang').classList.remove('on');
  lastG = ''; gHold = 0;
}

// ── RECEIVE MESSAGE ──
function receiveMsg(m) {
  // Show message bubble on BOTH sides
  addBubble(m.from, m.text, m.translations || {}, false);

  // ── Hearing person receives sign message → speak it ──
  if (role === 'speak' && m.from === 'mute') {
    const code = selectedLang.split('-')[0];
    let speakText = m.text;
    if (m.translations) {
      if (code !== 'en' && m.translations[code]) {
        speakText = m.translations[code];
      } else if (m.translations['hi'] && selectedLang.startsWith('hi')) {
        speakText = m.translations['hi'];
      }
    }
    speakTTS(speakText, selectedLang);
  }

  // ── Mute person receives hearing person reply → speak it out loud like a call ──
  if (role === 'mute' && m.from === 'speak') {
    // Use the EXACT language the hearing person was speaking in (sent with message)
    const lang = m.lang || 'en-IN';
    speakTTS(m.text, lang);
    toast('🗣️ ' + m.text.substring(0, 50) + (m.text.length > 50 ? '…' : ''), 'var(--green)');
  }
}

// ── HEARING PERSON REPLY ──
function sendReply() {
  const inp = document.getElementById('replyInp');
  const txt = inp.value.trim();
  if (!txt) return;

  // CRITICAL: send 'lang' so mute person knows which language to speak in
  const obj = { from:'speak', text:txt, translations:{}, lang:selectedLang, ts:Date.now() };
  if (useFirebase && roomRef) roomRef.child('messages').push(obj);
  else bcChan.postMessage({ t:'msg', ...obj });

  addBubble('speak', txt, {}, true);
  inp.value = ''; autoH(inp);
}

// ── UI HELPERS ──
function chkFb() {
  const ok = document.getElementById('fKey').value.trim() &&
             document.getElementById('fDb').value.trim() &&
             document.getElementById('fPid').value.trim();
  document.getElementById('btnConn').disabled = !ok;
}

function toggleEye(id, btn) {
  const i = document.getElementById(id);
  i.type = i.type === 'password' ? 'text' : 'password';
  btn.textContent = i.type === 'password' ? '👁' : '🙈';
}

function useSaved() {
  const cfg = loadCfg();
  if (!cfg) return;
  document.getElementById('fKey').value = cfg.apiKey;
  document.getElementById('fDb').value  = cfg.databaseURL;
  document.getElementById('fPid').value = cfg.projectId;
  connectFb();
}

function clearSaved() {
  localStorage.removeItem(LS_KEY);
  document.getElementById('savedBanner').style.display = 'none';
  ['fKey','fDb','fPid'].forEach(id => document.getElementById(id).value = '');
  chkFb();
  toast('🗑️ Config cleared', 'var(--red)');
}

function copyCode() {
  navigator.clipboard.writeText(roomCode)
    .then(() => toast('📋 Copied: ' + roomCode, 'var(--blue)'));
}
