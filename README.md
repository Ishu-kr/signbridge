# 🤟 SignBridge — ISL Real-Time Communication

> **Break the silence. Bridge the gap.**
> Real-time Indian Sign Language (ISL) platform with 50+ gesture patterns, bilingual Hindi output, and 10-language Indian voice synthesis.

![SignBridge](https://img.shields.io/badge/SignBridge-ISL%20Communication-ff6b35?style=for-the-badge)
[![HTML](https://img.shields.io/badge/Made%20with-HTML%2FCSS%2FJS-e34f26?style=flat-square&logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Firebase](https://img.shields.io/badge/Powered%20by-Firebase-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![MediaPipe](https://img.shields.io/badge/Hand%20Tracking-MediaPipe-4285f4?style=flat-square&logo=google)](https://mediapipe.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ What's New in v6

| Feature | Details |
|---|---|
| 🧠 **50+ ISL Gestures** | 7 groups: Basic, Numbers, Combined, Motion, Two-Hand, Body, Emotional, Special ISL |
| 🔍 **Gesture Search** | Search all gestures by English name, Hindi name, or group |
| 🔤 **Full Hindi Bilingual** | Every word, bubble, and gesture shows English + Hindi simultaneously |
| 🌐 **10-Language TTS** | Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi + English |
| 📝 **200+ Translations** | All ISL words translated into all 9 regional languages |
| 💬 **Multi-Script Bubbles** | Chat messages render in correct Devanagari, Tamil, Telugu, etc. scripts |
| 🎤 **STT in Any Language** | Mic input works in all 10 languages |

---

## 🤟 50+ ISL Gesture Groups

### Basic Hand Shapes
`Open Hand` → Hello | `Fist` → Stop | `Thumbs Up` → Yes | `Thumbs Down` → No | `Index Pointing` → Come | `Peace/V` → Two | `OK Sign` → Okay | `Pinky Up` → Wait | `L Shape` → Love | `Call Sign` → Call me

### Finger Counts
`One` through `Six` — each finger configuration maps to the corresponding number

### Combined Gestures
`I Love You` | `Spread Wide` → More | `Flat Palm` → Eat | `Pinch` → Small | `Thumb+Ring` → Good | `Index Curl` → Question | `Two+Pinky` → Please | `Crossed Fingers` → Hope | `Index+Middle` → Peace

### Motion Gestures
`Wave` → Goodbye | `Beckoning` → Here | `Push Away` → No thanks | `Clap` → Well done | `Point Down/Up/Left/Right`

### Two-Hand Gestures
`Both Palms Up` → Welcome | `Prayer Hands` → Namaste | `Hands Together` → Thank you | `Wide Arms` → Big | `Hands Crossed` → No/Stop | `Cupped Hands` → Please give

### Body Reference
`Touch Forehead` → Headache | `Touch Chest` → Pain here | `Touch Stomach` → Stomach pain | `Touch Mouth` → Hungry | `Ear Point` → Cannot hear | `Eye Point` → I see

### Emotional
`Happy` | `Sad` | `Angry` | `Surprised` | `Confused`

### Special ISL
`My name is` | `Where?` | `How much?` | `Hospital` | `Police` | `I am lost`

---

## 🌐 10 Indian Languages

| Language | Script | TTS | STT |
|---|---|---|---|
| English | Latin | ✅ | ✅ |
| हिंदी Hindi | Devanagari | ✅ | ✅ |
| தமிழ் Tamil | Tamil | ✅ | ✅ |
| తెలుగు Telugu | Telugu | ✅ | ✅ |
| বাংলা Bengali | Bengali | ✅ | ✅ |
| मराठी Marathi | Devanagari | ✅ | ✅ |
| ગુજરાતી Gujarati | Gujarati | ✅ | ✅ |
| ಕನ್ನಡ Kannada | Kannada | ✅ | ✅ |
| മലയാളം Malayalam | Malayalam | ✅ | ✅ |
| ਪੰਜਾਬੀ Punjabi | Gurmukhi | ✅ | ✅ |

> TTS voice availability depends on device OS. Android + Chrome support most Indian languages natively.

---

## 🚀 Setup (2 minutes)

### 1. Firebase (Free)
1. [console.firebase.google.com](https://console.firebase.google.com) → Add project → `signbridge`
2. Build → Realtime Database → Create → **Test mode**
3. ⚙️ Project Settings → Apps → `</>` → Get `apiKey`, `databaseURL`, `projectId`

### 2. Deploy on Vercel (Free)
1. Push `index.html` to GitHub repo
2. [vercel.com](https://vercel.com) → New Project → Import repo → Deploy
3. Share your `https://signbridge-xxx.vercel.app` URL

### 3. Connect Two Devices
- **Device 1**: Open URL → Enter Firebase config → Create Room → Mute Person → Share code
- **Device 2**: Open URL → Join Room → Hearing Person → Enter code → Pick language
- ✅ **Real-time ISL communication begins!**

Config is auto-saved in browser — enter once, never again.

---

## 📁 Files

```
signbridge/
├── index.html    # Full application (~1400 lines, single file)
└── README.md     # This file
```

---

## 🛠️ Tech Stack

- **HTML/CSS/JS** — Zero frameworks, single file
- **MediaPipe Hands** — 21-landmark hand detection
- **Custom gesture classifier** — 50+ patterns from landmark geometry
- **Firebase Realtime Database** — Cross-device real-time messaging
- **Web Speech API** — TTS (10 languages) + STT
- **Noto Sans fonts** — All Indian scripts
- **Vercel** — Free hosting

---

## 🔒 Firebase Security Rules (for production)

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        "messages": { ".indexOn": ["ts"] }
      }
    }
  }
}
```

---

## 📄 License

MIT License

---

<div align="center">
  <strong>Built with ❤️ for the ISL community of India 🇮🇳</strong><br>
  <em>बोलने की जरूरत नहीं — हाथों से बात करो</em>
</div>
