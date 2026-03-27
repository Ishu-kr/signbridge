// ============================================================
//  gestures.js — ISL Gesture Definitions + Improved Classifier
// ============================================================

// ── GESTURE DEFINITIONS ──
const GESTURE_DEFS = [
  // ── BASIC ──
  { name:"Open Hand",       emoji:"✋", en:"Hello",              hi:"नमस्ते",               group:"basic" },
  { name:"Closed Fist",     emoji:"✊", en:"Stop",               hi:"रुको",                 group:"basic" },
  { name:"Thumbs Up",       emoji:"👍", en:"Yes",                hi:"हाँ",                  group:"basic" },
  { name:"Thumbs Down",     emoji:"👎", en:"No",                 hi:"नहीं",                group:"basic" },
  { name:"Index Pointing",  emoji:"☝️", en:"Come",               hi:"आओ",                  group:"basic" },
  { name:"Peace V",         emoji:"✌️", en:"Two / Peace",        hi:"दो / शांति",           group:"basic" },
  { name:"OK Sign",         emoji:"👌", en:"Okay",               hi:"ठीक है",              group:"basic" },
  { name:"Pinky Up",        emoji:"🤙", en:"Wait",               hi:"रुकिए",               group:"basic" },
  { name:"L Shape",         emoji:"👆", en:"Love",               hi:"प्यार",               group:"basic" },
  { name:"Call Sign",       emoji:"📞", en:"Call me",            hi:"कॉल करो",             group:"basic" },
  { name:"Flat Hand",       emoji:"🤚", en:"Please stop",        hi:"कृपया रुकें",          group:"basic" },

  // ── NUMBERS ──
  { name:"One Finger",      emoji:"1️⃣", en:"One",                hi:"एक",                  group:"numbers" },
  { name:"Two Fingers",     emoji:"2️⃣", en:"Two",                hi:"दो",                  group:"numbers" },
  { name:"Three Fingers",   emoji:"3️⃣", en:"Three",              hi:"तीन",                 group:"numbers" },
  { name:"Four Fingers",    emoji:"4️⃣", en:"Four",               hi:"चार",                 group:"numbers" },
  { name:"Five All",        emoji:"5️⃣", en:"Five",               hi:"पाँच",                group:"numbers" },
  { name:"Six",             emoji:"6️⃣", en:"Six",                hi:"छह",                  group:"numbers" },
  { name:"Seven",           emoji:"7️⃣", en:"Seven",              hi:"सात",                 group:"numbers" },
  { name:"Eight",           emoji:"8️⃣", en:"Eight",              hi:"आठ",                  group:"numbers" },
  { name:"Nine",            emoji:"9️⃣", en:"Nine",               hi:"नौ",                  group:"numbers" },
  { name:"Ten",             emoji:"🔟", en:"Ten",                hi:"दस",                  group:"numbers" },

  // ── COMBINED ──
  { name:"I Love You",      emoji:"🤟", en:"I love you",         hi:"मैं प्यार करता हूँ",  group:"combined" },
  { name:"Spread Wide",     emoji:"🖐️", en:"More",               hi:"और",                  group:"combined" },
  { name:"Flat Palm Up",    emoji:"🤲", en:"Eat",                hi:"खाना खाएं",            group:"combined" },
  { name:"Pinch",           emoji:"👌", en:"Small",              hi:"छोटा",                group:"combined" },
  { name:"Thumb Ring",      emoji:"👍", en:"Good",               hi:"अच्छा",               group:"combined" },
  { name:"Index Curl",      emoji:"☝",  en:"Question",           hi:"सवाल",                group:"combined" },
  { name:"Two Pinky",       emoji:"🤞", en:"Please",             hi:"कृपया",               group:"combined" },
  { name:"Crossed Fingers", emoji:"🤞", en:"Hope",               hi:"उम्मीद",              group:"combined" },

  // ── MOTION / DIRECTION ──
  { name:"Wave",            emoji:"👋", en:"Goodbye",            hi:"अलविदा",              group:"motion" },
  { name:"Beckoning",       emoji:"🫴", en:"Come here",          hi:"इधर आओ",              group:"motion" },
  { name:"Push Away",       emoji:"🤚", en:"No thanks",          hi:"नहीं शुक्रिया",       group:"motion" },
  { name:"Point Down",      emoji:"👇", en:"Down",               hi:"नीचे",                group:"motion" },
  { name:"Point Up",        emoji:"👆", en:"Up",                 hi:"ऊपर",                group:"motion" },
  { name:"Point Left",      emoji:"👈", en:"Left",               hi:"बाएं",                group:"motion" },
  { name:"Point Right",     emoji:"👉", en:"Right",              hi:"दाएं",                group:"motion" },

  // ── TWO-HAND ──
  { name:"Both Palms Up",   emoji:"🙌", en:"Welcome",            hi:"स्वागत है",           group:"twohand" },
  { name:"Prayer Hands",    emoji:"🙏", en:"Namaste",            hi:"नमस्ते",              group:"twohand" },
  { name:"Hands Together",  emoji:"🤝", en:"Thank you",          hi:"धन्यवाद",             group:"twohand" },
  { name:"Wide Arms",       emoji:"🤗", en:"Big",                hi:"बड़ा",                group:"twohand" },
  { name:"Hands Crossed",   emoji:"🙅", en:"No",                 hi:"नहीं",                group:"twohand" },
  { name:"Cupped Hands",    emoji:"🫶", en:"Please give",        hi:"कृपया दीजिए",         group:"twohand" },
  { name:"Clap",            emoji:"👏", en:"Well done",          hi:"शाबाश",               group:"twohand" },

  // ── BODY REFERENCE ──
  { name:"Touch Forehead",  emoji:"🧠", en:"Headache",           hi:"सिरदर्द",             group:"body" },
  { name:"Touch Chest",     emoji:"💗", en:"Pain here",          hi:"यहाँ दर्द",           group:"body" },
  { name:"Touch Stomach",   emoji:"🤢", en:"Stomach pain",       hi:"पेट दर्द",            group:"body" },
  { name:"Touch Mouth",     emoji:"👄", en:"Hungry",             hi:"भूख",                 group:"body" },
  { name:"Ear Point",       emoji:"👂", en:"Cannot hear",        hi:"सुनाई नहीं",          group:"body" },
  { name:"Eye Point",       emoji:"👁️", en:"I see",             hi:"मैं देख रहा",         group:"body" },

  // ── EMOTIONAL ──
  { name:"Happy",           emoji:"😊", en:"Happy",              hi:"खुश",                 group:"emotion" },
  { name:"Sad",             emoji:"😢", en:"Sad",                hi:"दुखी",                group:"emotion" },
  { name:"Angry",           emoji:"😠", en:"Angry",              hi:"गुस्सा",              group:"emotion" },
  { name:"Surprised",       emoji:"😮", en:"Surprised",          hi:"हैरान",               group:"emotion" },
  { name:"Confused",        emoji:"🤦", en:"Confused",           hi:"भ्रमित",              group:"emotion" },
  { name:"Scared",          emoji:"😨", en:"Scared",             hi:"डरा हुआ",             group:"emotion" },
  { name:"Tired",           emoji:"😴", en:"Tired",              hi:"थका हुआ",             group:"emotion" },

  // ── SPECIAL ISL ──
  { name:"ISL Name",        emoji:"🏷️", en:"My name is",        hi:"मेरा नाम है",         group:"isl" },
  { name:"ISL Where",       emoji:"📍", en:"Where?",             hi:"कहाँ?",               group:"isl" },
  { name:"ISL How Much",    emoji:"💰", en:"How much?",          hi:"कितना?",              group:"isl" },
  { name:"ISL Hospital",    emoji:"🏥", en:"Hospital",           hi:"अस्पताल",             group:"isl" },
  { name:"ISL Police",      emoji:"👮", en:"Police",             hi:"पुलिस",               group:"isl" },
  { name:"ISL Lost",        emoji:"🗺️", en:"I am lost",         hi:"रास्ता भटक गया",      group:"isl" },
  { name:"ISL Help",        emoji:"🆘", en:"Help me now",        hi:"अभी मदद करो",         group:"isl" },
  { name:"ISL Water",       emoji:"💧", en:"I need water",       hi:"पानी चाहिए",          group:"isl" },
  { name:"ISL Toilet",      emoji:"🚻", en:"Where is toilet?",   hi:"शौचालय कहाँ है?",     group:"isl" },
  { name:"ISL Doctor",      emoji:"🩺", en:"I need a doctor",    hi:"डॉक्टर चाहिए",        group:"isl" },
  { name:"ISL Deaf",        emoji:"🦻", en:"I am deaf",          hi:"मैं बधिर हूँ",        group:"isl" },
  { name:"ISL Family",      emoji:"👨‍👩‍👧", en:"Call my family",   hi:"परिवार को बुलाओ",    group:"isl" },

  // ── ISL ALPHABET ──
  { name:"Alpha A", emoji:"🔤", en:"A", hi:"ए",        group:"alphabet" },
  { name:"Alpha B", emoji:"🔤", en:"B", hi:"बी",       group:"alphabet" },
  { name:"Alpha C", emoji:"🔤", en:"C", hi:"सी",       group:"alphabet" },
  { name:"Alpha D", emoji:"🔤", en:"D", hi:"डी",       group:"alphabet" },
  { name:"Alpha E", emoji:"🔤", en:"E", hi:"ई",        group:"alphabet" },
  { name:"Alpha F", emoji:"🔤", en:"F", hi:"एफ",       group:"alphabet" },
  { name:"Alpha G", emoji:"🔤", en:"G", hi:"जी",       group:"alphabet" },
  { name:"Alpha H", emoji:"🔤", en:"H", hi:"एच",       group:"alphabet" },
  { name:"Alpha I", emoji:"🔤", en:"I", hi:"आई",       group:"alphabet" },
  { name:"Alpha K", emoji:"🔤", en:"K", hi:"के",        group:"alphabet" },
  { name:"Alpha L", emoji:"🔤", en:"L", hi:"एल",       group:"alphabet" },
  { name:"Alpha M", emoji:"🔤", en:"M", hi:"एम",       group:"alphabet" },
  { name:"Alpha N", emoji:"🔤", en:"N", hi:"एन",       group:"alphabet" },
  { name:"Alpha O", emoji:"🔤", en:"O", hi:"ओ",        group:"alphabet" },
  { name:"Alpha P", emoji:"🔤", en:"P", hi:"पी",       group:"alphabet" },
  { name:"Alpha R", emoji:"🔤", en:"R", hi:"आर",       group:"alphabet" },
  { name:"Alpha S", emoji:"🔤", en:"S", hi:"एस",       group:"alphabet" },
  { name:"Alpha T", emoji:"🔤", en:"T", hi:"टी",       group:"alphabet" },
  { name:"Alpha U", emoji:"🔤", en:"U", hi:"यू",       group:"alphabet" },
  { name:"Alpha V", emoji:"🔤", en:"V", hi:"वी",       group:"alphabet" },
  { name:"Alpha W", emoji:"🔤", en:"W", hi:"डब्ल्यू",  group:"alphabet" },
  { name:"Alpha Y", emoji:"🔤", en:"Y", hi:"वाय",      group:"alphabet" },
];

// ============================================================
//  IMPROVED CLASSIFIER
//  — normalised to palm size (works at any distance)
//  — relaxed thresholds (more forgiving)
//  — cleaner rule ordering (specific before general)
// ============================================================
function classifyGesture(lm) {
  if (!lm || lm.length < 21) return null;

  // Normalise all distances to palm size so detection works
  // whether hand is near or far from camera
  const palmSize = Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y) || 0.001;

  function ndist(a, b) {
    return Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y) / palmSize;
  }
  // dy > 0 means a is LOWER than b in frame (y increases downward)
  function ndy(a, b) { return (lm[a].y - lm[b].y) / palmSize; }
  function ndx(a, b) { return (lm[a].x - lm[b].x) / palmSize; }

  // ── Finger extended: tip is clearly above the pip joint ──
  const ix = ndy(8,  6)  < -0.3;
  const mi = ndy(12, 10) < -0.3;
  const ri = ndy(16, 14) < -0.3;
  const pi = ndy(20, 18) < -0.3;

  // Thumb
  const thUp  = ndy(4, 3) < -0.3;
  const thOut = Math.abs(ndx(4, 2)) > 0.5;
  const thDn  = ndy(4, 3) > 0.25;
  const th    = thUp || thOut;

  // ── Finger curled: tip is below the mcp knuckle ──
  const ixC = ndy(8,  5) > 0.15;
  const miC = ndy(12, 9) > 0.15;
  const riC = ndy(16,13) > 0.15;
  const piC = ndy(20,17) > 0.15;

  // ── Pinch ──
  const pinchIx  = ndist(4, 8)  < 0.6;
  const pinchMi  = ndist(4, 12) < 0.6;
  const pinchAll = ndist(4, 8) < 0.7 && ndist(4,12) < 0.7;

  // ── Spread ──
  const cx = (lm[0].x + lm[9].x) / 2;
  const cy = (lm[0].y + lm[9].y) / 2;
  const spread = [4,8,12,16,20].reduce((s,t) =>
    s + Math.hypot(lm[t].x - cx, lm[t].y - cy), 0) / (5 * palmSize);

  const wristTilt = Math.abs(ndx(0, 9));

  // ══════════════════════════════════════
  //  RULES — most specific first
  // ══════════════════════════════════════

  // Unique multi-finger combos first
  if (th && ix && !mi && !ri && pi && !thDn)            return find("I Love You");
  if (th && !ix && !mi && !ri && pi && !thDn)           return find("Call Sign");
  if (thOut && ix && !mi && !ri && !pi)                 return find("L Shape");
  if (th && ix && mi && !ri && !pi && !thDn)            return find("Alpha K");

  // Thumb only
  if ((thUp || thOut) && !ix && !mi && !ri && !pi && !thDn) return find("Thumbs Up");
  if (thDn && !ix && !mi && !ri && !pi)                 return find("Thumbs Down");

  // OK — pinch + 3 up
  if (pinchIx && mi && ri && pi)                        return find("OK Sign");

  // Open / Spread
  if (th && ix && mi && ri && pi && spread > 2.0)       return find("Spread Wide");
  if (th && ix && mi && ri && pi && spread > 1.3)       return find("Open Hand");
  if (!th && ix && mi && ri && pi && spread > 1.3)      return find("Flat Hand");

  // Fist
  if (!ix && !mi && !ri && !pi && ixC && miC)           return find("Closed Fist");

  // Five (open, thumb included)
  if (th && ix && mi && ri && pi)                       return find("Five All");

  // Four: all fingers, no thumb
  if (!th && ix && mi && ri && pi)                      return find("Four Fingers");

  // Three: index + middle + ring
  if (!th && ix && mi && ri && !pi)                     return find("Three Fingers");

  // Two: index + middle
  if (!th && ix && mi && !ri && !pi && !ixC && !miC)    return find("Two Fingers");

  // Peace V (same as two but specific check)
  if (!th && ix && mi && !ri && !pi)                    return find("Peace V");

  // Two + Pinky
  if (!th && ix && mi && !ri && pi)                     return find("Two Pinky");

  // One: index only
  if (!th && ix && !mi && !ri && !pi) {
    // Directional pointing check
    const tipY = lm[8].y - lm[5].y;
    const tipX = lm[8].x - lm[5].x;
    if (tipY < -0.06 && Math.abs(tipX) < 0.04)         return find("Point Up");
    if (tipY > 0.06 && Math.abs(tipX) < 0.04)          return find("Point Down");
    if (tipX < -0.06 && Math.abs(tipY) < 0.05)         return find("Point Left");
    if (tipX > 0.06 && Math.abs(tipY) < 0.05)          return find("Point Right");
    return find("Index Pointing");
  }

  // Pinky only
  if (!th && !ix && !mi && !ri && pi)                  return find("Pinky Up");

  // Crossed fingers
  if (!th && ix && mi && !ri && !pi && ndist(8,12) < 0.4) return find("Crossed Fingers");

  // Index curl
  if (!th && ixC && !mi && !ri && !pi)                 return find("Index Curl");

  // Thumb + ring
  if (th && !ix && !mi && ri && !pi)                   return find("Thumb Ring");

  // Pinch small
  if (pinchIx && !mi && !ri && !pi)                    return find("Pinch");

  // Wave: open hand tilted
  if (th && ix && mi && ri && pi && wristTilt > 0.6)   return find("Wave");

  // Push Away: four fingers + no thumb, palm out (flat)
  if (!th && ix && mi && ri && pi && spread < 1.3)      return find("Push Away");

  // ── ISL Alphabet ──
  // A: fist + thumb on side
  if (thOut && !ix && !mi && !ri && !pi && ixC && miC && riC && piC) return find("Alpha A");
  // B: four fingers together, thumb in
  if (!thOut && ix && mi && ri && pi && !th && spread < 1.1)         return find("Alpha B");
  // C: curved, all slightly bent
  if (!ixC && !miC && !riC && !piC && spread > 0.8 && spread < 1.4 && !th) return find("Alpha C");
  // D: index up + pinch other fingers to thumb
  if (ix && !mi && !ri && !pi && pinchMi)                            return find("Alpha D");
  // E: all fingers bent/curled
  if (ixC && miC && riC && piC && !thOut)                            return find("Alpha E");
  // F: index+thumb pinch, others open
  if (pinchIx && mi && ri && pi && !thDn)                            return find("Alpha F");
  // G: index+thumb sideways like gun
  if (thOut && ix && !mi && !ri && !pi && Math.abs(ndx(8,0)) > 0.5) return find("Alpha G");
  // H: index + middle sideways
  if (!th && ix && mi && !ri && !pi && Math.abs(ndy(8,5)) < 0.15)   return find("Alpha H");
  // I: pinky only
  if (!th && !ix && !mi && !ri && pi)                                return find("Alpha I");
  // M: three over thumb
  if (!th && ixC && miC && riC && !pi)                               return find("Alpha M");
  // N: two over thumb
  if (!th && ixC && miC && !ri && !pi)                               return find("Alpha N");
  // O: all tips touch thumb
  if (pinchAll && spread < 1.0)                                      return find("Alpha O");
  // R: index + middle crossed close
  if (!th && ix && mi && !ri && !pi && ndist(8,12) < 0.35)          return find("Alpha R");
  // S: fist thumb over
  if (!ix && !mi && !ri && !pi && ixC && miC && riC && piC && thOut) return find("Alpha S");
  // T: index tucked under thumb
  if (!ix && !mi && !ri && !pi && thOut && ixC)                      return find("Alpha T");
  // U: index + middle close together
  if (!th && ix && mi && !ri && !pi && ndist(8,12) < 0.35)          return find("Alpha U");
  // W: three fingers spread wide
  if (!th && ix && mi && ri && !pi && spread > 1.2)                  return find("Alpha W");
  // Y: thumb + pinky
  if (th && !ix && !mi && !ri && pi)                                 return find("Alpha Y");

  return null;
}

function find(name) {
  return GESTURE_DEFS.find(g => g.name === name) || null;
}
