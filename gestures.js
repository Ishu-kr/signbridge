// ============================================================
//  gestures.js — ISL Gesture Definitions + MediaPipe Classifier
// ============================================================

// ── GESTURE DEFINITIONS — 50+ patterns ──
const GESTURE_DEFS = [
  // BASIC HAND SHAPES
  { name:"Open Hand",      emoji:"✋", en:"Hello",        hi:"नमस्ते",              group:"basic" },
  { name:"Closed Fist",    emoji:"✊", en:"Stop",         hi:"रुको",                group:"basic" },
  { name:"Thumbs Up",      emoji:"👍", en:"Yes",          hi:"हाँ",                 group:"basic" },
  { name:"Thumbs Down",    emoji:"👎", en:"No",           hi:"नहीं",               group:"basic" },
  { name:"Index Pointing", emoji:"☝️", en:"Come",         hi:"आओ",                 group:"basic" },
  { name:"Peace / V",      emoji:"✌️", en:"Two",          hi:"दो",                 group:"basic" },
  { name:"OK Sign",        emoji:"👌", en:"Okay",         hi:"ठीक है",             group:"basic" },
  { name:"Pinky Up",       emoji:"🤙", en:"Wait",         hi:"रुकिए",              group:"basic" },
  { name:"L Shape",        emoji:"🤙", en:"Love",         hi:"प्यार",              group:"basic" },
  { name:"Call Sign",      emoji:"🤙", en:"Call me",      hi:"कॉल करो",            group:"basic" },
  // FINGER COUNTS
  { name:"One Finger",     emoji:"1️⃣",  en:"One",         hi:"एक",                 group:"numbers" },
  { name:"Two Fingers",    emoji:"2️⃣",  en:"Two",         hi:"दो",                 group:"numbers" },
  { name:"Three Fingers",  emoji:"3️⃣",  en:"Three",       hi:"तीन",                group:"numbers" },
  { name:"Four Fingers",   emoji:"4️⃣",  en:"Four",        hi:"चार",                group:"numbers" },
  { name:"Five / All",     emoji:"5️⃣",  en:"Five",        hi:"पाँच",               group:"numbers" },
  { name:"Six (thumb+pinky+thumb)", emoji:"6️⃣", en:"Six", hi:"छह",                group:"numbers" },
  // COMBINED
  { name:"I Love You",     emoji:"🤟", en:"I love you",   hi:"मैं प्यार करता हूँ", group:"combined" },
  { name:"Spread Wide",    emoji:"🖐️", en:"More",         hi:"और",                 group:"combined" },
  { name:"Flat Palm",      emoji:"🤲", en:"Eat",          hi:"खाना खाएं",           group:"combined" },
  { name:"Pinch",          emoji:"👌", en:"Small",        hi:"छोटा",               group:"combined" },
  { name:"Thumb+Ring",     emoji:"🤙", en:"Good",         hi:"अच्छा",              group:"combined" },
  { name:"Index Curl",     emoji:"☝",  en:"Question",     hi:"सवाल",               group:"combined" },
  { name:"Two+Pinky",      emoji:"🤞", en:"Please",       hi:"कृपया",              group:"combined" },
  { name:"Crossed Fingers",emoji:"🤞", en:"Hope",         hi:"उम्मीद",             group:"combined" },
  { name:"Index+Middle",   emoji:"✌",  en:"Peace",        hi:"शांति",              group:"combined" },
  // MOTION
  { name:"Wave",           emoji:"👋", en:"Goodbye",      hi:"अलविदा",             group:"motion" },
  { name:"Beckoning",      emoji:"🫴", en:"Here",         hi:"यहाँ",               group:"motion" },
  { name:"Push Away",      emoji:"🤚", en:"No thanks",    hi:"नहीं शुक्रिया",      group:"motion" },
  { name:"Clap",           emoji:"👏", en:"Well done",    hi:"शाबाश",              group:"motion" },
  { name:"Point Down",     emoji:"👇", en:"Down",         hi:"नीचे",               group:"motion" },
  { name:"Point Up",       emoji:"👆", en:"Up",           hi:"ऊपर",               group:"motion" },
  { name:"Point Left",     emoji:"👈", en:"Left",         hi:"बाएं",               group:"motion" },
  { name:"Point Right",    emoji:"👉", en:"Right",        hi:"दाएं",               group:"motion" },
  // TWO-HAND
  { name:"Both Palms Up",  emoji:"🙌", en:"Welcome",      hi:"स्वागत है",          group:"twohand" },
  { name:"Prayer Hands",   emoji:"🙏", en:"Namaste",      hi:"नमस्ते",             group:"twohand" },
  { name:"Hands Together", emoji:"🤝", en:"Thank you",    hi:"धन्यवाद",            group:"twohand" },
  { name:"Wide Arms",      emoji:"🤗", en:"Big/Large",    hi:"बड़ा",               group:"twohand" },
  { name:"Hands Crossed",  emoji:"🙅", en:"No/Stop",      hi:"नहीं/रुको",          group:"twohand" },
  { name:"Cupped Hands",   emoji:"🫶", en:"Please give",  hi:"कृपया दीजिए",        group:"twohand" },
  // BODY REFERENCE
  { name:"Touch Forehead", emoji:"🧠", en:"Headache",     hi:"सिरदर्द",            group:"body" },
  { name:"Touch Chest",    emoji:"💗", en:"Pain here",    hi:"यहाँ दर्द",          group:"body" },
  { name:"Touch Stomach",  emoji:"🤢", en:"Stomach pain", hi:"पेट दर्द",           group:"body" },
  { name:"Touch Mouth",    emoji:"👄", en:"Hungry",       hi:"भूख",                group:"body" },
  { name:"Ear Point",      emoji:"👂", en:"Cannot hear",  hi:"सुनाई नहीं",         group:"body" },
  { name:"Eye Point",      emoji:"👁️", en:"I see",        hi:"मैं देख रहा",       group:"body" },
  // EMOTIONAL
  { name:"Thumbs+Smile",   emoji:"😊", en:"Happy",        hi:"खुश",                group:"emotion" },
  { name:"Drooping Hand",  emoji:"😢", en:"Sad",          hi:"दुखी",               group:"emotion" },
  { name:"Fist Shake",     emoji:"😠", en:"Angry",        hi:"गुस्सा",             group:"emotion" },
  { name:"Open+Close",     emoji:"😮", en:"Surprised",    hi:"हैरान",              group:"emotion" },
  { name:"Head Shake",     emoji:"🤦", en:"Confused",     hi:"भ्रमित",             group:"emotion" },
  // SPECIAL ISL
  { name:"ISL: Name",      emoji:"🏷️", en:"My name is",  hi:"मेरा नाम है",        group:"isl" },
  { name:"ISL: Where",     emoji:"📍", en:"Where",        hi:"कहाँ",               group:"isl" },
  { name:"ISL: How much",  emoji:"💰", en:"How much?",    hi:"कितना?",             group:"isl" },
  { name:"ISL: Hospital",  emoji:"🏥", en:"Hospital",     hi:"अस्पताल",            group:"isl" },
  { name:"ISL: Police",    emoji:"👮", en:"Police",       hi:"पुलिस",              group:"isl" },
  { name:"ISL: Lost",      emoji:"🗺️", en:"I am lost",   hi:"रास्ता भटक गया",     group:"isl" },
];

// ── GESTURE CLASSIFIER using MediaPipe hand landmarks ──
function classifyGesture(lm) {
  if (!lm || lm.length < 21) return null;

  // Finger extension flags
  const thUp = lm[4].y < lm[3].y - 0.04;
  const thEx = Math.abs(lm[4].x - lm[2].x) > 0.065;
  const thDn = lm[4].y > lm[3].y + 0.05;
  const ix   = lm[8].y  < lm[6].y  - 0.01;
  const mi   = lm[12].y < lm[10].y - 0.01;
  const ri   = lm[16].y < lm[14].y - 0.01;
  const pi   = lm[20].y < lm[18].y - 0.01;
  const th   = thEx || thUp;

  // Curl detection
  const ixC = !ix && lm[8].y  > lm[5].y  + 0.01;
  const miC = !mi && lm[12].y > lm[9].y  + 0.01;
  const riC = !ri && lm[16].y > lm[13].y + 0.01;
  const piC = !pi && lm[20].y > lm[17].y + 0.01;

  // Pinch detection
  const pinch    = Math.hypot(lm[4].x - lm[8].x,  lm[4].y - lm[8].y)  < 0.04;
  const pinchMid = Math.hypot(lm[4].x - lm[12].x, lm[4].y - lm[12].y) < 0.045;

  // Spread / wrist metrics
  const cx = (lm[0].x + lm[9].x) / 2;
  const cy = (lm[0].y + lm[9].y) / 2;
  const spread = [4,8,12,16,20].reduce((s,t) => s + Math.hypot(lm[t].x - cx, lm[t].y - cy), 0) / 5;
  const wristTilt = Math.abs(lm[0].x - lm[9].x);

  // ── MATCH RULES (priority order) ──
  if (th && ix && mi && ri && pi && spread > 0.14)    return find("Open Hand");
  if (!th && !ix && !mi && !ri && !pi)                return find("Closed Fist");
  if ((thUp||thEx) && !ix && !mi && !ri && !pi && !thDn) return find("Thumbs Up");
  if (thDn && !ix && !mi && !ri && !pi)               return find("Thumbs Down");
  if (!th && ix && !mi && !ri && !pi && !ixC)         return find("Index Pointing");
  if (!th && ix && mi && !ri && !pi)                  return find("Peace / V");
  if (pinch && !mi && !ri && !pi)                     return find("OK Sign");
  if (!th && !ix && !mi && !ri && pi)                 return find("Pinky Up");
  if (th && ix && !mi && !ri && !pi && !thDn)         return find("L Shape");
  if (th && !ix && !mi && !ri && pi)                  return find("Call Sign");

  // Numbers
  if (!th && ix && !miC && !riC && !piC && !mi && !ri && !pi) return find("One Finger");
  if (!th && ix && mi && !ri && !pi)                  return find("Two Fingers");
  if (!th && ix && mi && ri && !pi)                   return find("Three Fingers");
  if (!th && ix && mi && ri && pi && !th)             return find("Four Fingers");
  if (th && ix && mi && ri && pi && spread < 0.14)    return find("Five / All");

  // Combined
  if (th && ix && !mi && !ri && pi)                   return find("I Love You");
  if (spread > 0.155 && th && ix && mi && ri && pi)   return find("Spread Wide");
  if (pinchMid && !ri && !pi)                         return find("Pinch");
  if (th && !ix && !mi && ri && !pi)                  return find("Thumb+Ring");
  if (!th && ixC && !mi && !ri && !pi)                return find("Index Curl");
  if (!th && ix && mi && !ri && pi)                   return find("Two+Pinky");

  // Motion
  if (th && ix && mi && ri && pi && wristTilt > 0.08) return find("Wave");

  // Two-hand approximation
  if (!th && !ix && !miC && !riC && !piC && mi && ri && pi) return find("Both Palms Up");

  return null;
}

function find(name) {
  return GESTURE_DEFS.find(g => g.name === name) || null;
}
