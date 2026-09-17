<div align="center">
  <img src="public/aura-logo.jpg" alt="Aura Logo" width="120" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(232, 156, 174, 0.3);" />
  <h1>✨ Aura — Refined Real-Time Chat & WebRTC Calls</h1>
  <p><strong>Quiet Luxury meets Casual Youth Culture</strong></p>
  <p>A full-stack, real-time social application featuring frosted glass aesthetics, audio voice notes with waveform visualization, WebRTC peer-to-peer video calling, and multi-method authentication.</p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-firebase-setup">Firebase Setup</a> •
    <a href="#-firestore-data-models">Data Models</a>
  </p>
</div>

---

## 🎨 Design Identity & Aesthetic

Aura avoids generic corporate templates in favor of a refined, Gen-Z coded visual design:
- **Palette**: Soft off-white and warm cream backgrounds (`#FAF8F5`), blush pink (`#E89CAE`), soft lavender (`#B8A7EA`), sage green (`#98B09A`), and soft gold (`#D4AF37`) accents.
- **Glassmorphism**: Frosted glass panels (`backdrop-blur-md`), soft shadow cards, and ambient micro-glows.
- **Typography**: Dual Google Fonts pairing — **Space Grotesk** for display headers & badges, **Plus Jakarta Sans** for body readability.
- **Interactive Sidebar**: Hover-expandable and tap-to-pin navigation drawer (compact icon view by default, expands to full width on hover or pin toggle).

---

## 🔥 Features

### 🔐 Multi-Method Authentication Suite
- **Email & Password**: Registration and login with automatic user document initialization in Firestore.
- **Google Sign-In**: 1-click popup & fallback redirect authentication via `GoogleAuthProvider`.
- **Facebook Sign-In**: Social login via `FacebookAuthProvider`.
- **Phone Number SMS OTP**: Verification using Firebase `RecaptchaVerifier` and `signInWithPhoneNumber`.

### 💬 Real-Time Messaging & Media
- **1:1 Direct DMs & Group Channels**: Powered by real-time Firestore listeners (`onSnapshot`).
- **Voice Notes**: In-browser audio recording (`MediaRecorder`), live spectrum visualizer bars, and custom interactive waveform audio playback (`WaveformPlayer`).
- **Image Attachments**: Instant file upload to Firebase Storage with captioning and image viewer.
- **Emoji Reactions**: Dynamic hover toolbar (`❤️`, `✨`, `🔥`, `🙌`, `☕`, `😍`) with real-time user reaction badges.

### 📞 WebRTC Voice & Video Calling
- **Peer-to-Peer Calls**: Built with native browser `RTCPeerConnection` and Firestore signaling.
- **Call Controls**: Toggle microphone mute, camera enable/disable, Picture-in-Picture (PIP) local camera preview, and remote video view.
- **Audio Synthesizer**: Web Audio API ringtone synthesizer for incoming and outgoing call alerts.

### 👥 Friend System & User Search
- **Live User Search**: Query registered users in Firestore by email, phone number, username, or friend code (`@username#8492`).
- **Friend Requests**: Real-time request notifications with 1-click Accept / Decline actions.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS v4 + `@tailwindcss/vite` |
| **Icons** | Lucide React |
| **Backend & BaaS** | Firebase v10+ (Authentication, Firestore, Storage) |
| **Real-time Signaling & Media** | WebRTC (`RTCPeerConnection`) + Web Audio API |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Anshhhitaaaa/Aura.git
cd Aura
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## ⚙️ Firebase Setup Instructions

Create a `.env` file in the project root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef..."
```

---

## 🗄️ Firestore Data Models

### `users/{userId}`
```json
{
  "uid": "usr_abc123",
  "email": "alex@aura.app",
  "phoneNumber": "+1234567890",
  "displayName": "Alex Rivers",
  "username": "alex_rivers",
  "tag": "8492",
  "avatar": "https://...",
  "bio": "designing quiet luxury software ✨",
  "status": "In the flow ☕",
  "online": true,
  "createdAt": "2026-09-18T00:00:00.000Z"
}
```

### `chats/{chatId}`
```json
{
  "id": "chat_xyz789",
  "type": "direct | group",
  "name": "🎨 Design & Vibe",
  "participants": ["usr_abc123", "usr_def456"],
  "lastMessage": "Voice note (0:14)",
  "updatedAt": "Timestamp"
}
```

### `chats/{chatId}/messages/{messageId}`
```json
{
  "id": "msg_001",
  "senderId": "usr_abc123",
  "senderName": "Alex Rivers",
  "type": "text | image | voice",
  "content": "Look at this color scheme! ✨",
  "audioUrl": "https://...",
  "duration": 14,
  "waveform": [30, 60, 90, 45, 80],
  "timestamp": "Timestamp",
  "seen": true,
  "reactions": {
    "❤️": ["usr_def456"]
  }
}
```

---

## 🔒 Security Rules

Production Security rules are provided in the project:
- **`firestore.rules`**: Manages document access for users, friends, chats, messages, and calls.
- **`storage.rules`**: Restricts image uploads (5MB max) and voice notes (20MB max) to authenticated users.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
