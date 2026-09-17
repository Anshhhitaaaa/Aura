# ✨ Aura — Refined Real-Time Chat & WebRTC Calling Web App

**Aura** is a full-stack real-time messaging and voice/video call web application designed with a **"quiet luxury" meets casual youth culture** aesthetic. Featuring soft off-white/cream palettes (`#FAF8F5`), blush pink, lavender, sage green, and soft gold accents, frosted glass panels (`glassmorphism`), audio voice note recording with interactive waveforms, emoji reactions, and WebRTC peer-to-peer calling.

---

## 🎨 Design System & Aesthetics
- **Palette**: Soft cream backgrounds, blush pink (`#E89CAE`), lavender (`#B8A7EA`), sage green (`#98B09A`), soft gold (`#D4AF37`), espresso charcoal (`#2A2624`).
- **Typography**: Google Fonts — *Space Grotesk* for headings & badges, *Plus Jakarta Sans* for smooth body reading.
- **Components**: Frosted glass panels (`backdrop-blur-md`), rounded soft-edge cards, subtle shadows, animated visualizer bars, and responsive bottom mobile navigation.

---

## 🚀 Quick Start & Local Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

> 💡 **Dual Engine / Demo Mode**: Aura comes with an **Interactive Demo Mode** built-in! If `.env` is missing or set to demo mode, Aura automatically runs with simulated real-time peers, simulated message replies, in-browser voice note recording, and WebRTC loopback video calling out of the box!

---

## ⚙️ Firebase Setup Instructions (.env Structure)

To connect Aura to your live Firebase backend:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password & Google Sign-In).
3. Create a **Firestore Database** in production mode.
4. Enable **Firebase Storage**.
5. Copy `.env.example` to `.env` in the project root:

```env
VITE_FIREBASE_API_KEY="your-api-key-here"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

VITE_FORCE_DEMO_MODE=false
```

---

## 🗄️ Firestore Data Model Schemas

### `users/{userId}`
```json
{
  "uid": "usr_123",
  "email": "alex@aura.app",
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
  "id": "chat_456",
  "type": "direct | group",
  "name": "✨ The Lounge",
  "avatar": "https://...",
  "participants": ["usr_123", "usr_789"],
  "lastMessage": "Hey Alex! Look at this color scheme!",
  "updatedAt": "Timestamp"
}
```

### `chats/{chatId}/messages/{messageId}`
```json
{
  "id": "msg_001",
  "senderId": "usr_123",
  "senderName": "Alex Rivers",
  "senderAvatar": "https://...",
  "type": "text | image | voice",
  "content": "Hey there! ✨",
  "audioUrl": "https://...",
  "duration": 14,
  "waveform": [30, 60, 90, 45, 80],
  "caption": "Sunset photo",
  "timestamp": "10:14 AM",
  "seen": true,
  "reactions": {
    "❤️": ["usr_789"]
  }
}
```

### `calls/{callId}` (WebRTC Signaling)
```json
{
  "callerId": "usr_123",
  "receiverId": "usr_789",
  "type": "voice | video",
  "offer": { "type": "offer", "sdp": "..." },
  "answer": { "type": "answer", "sdp": "..." },
  "status": "outgoing | connected | ended"
}
```

---

## 🔒 Security Rules

Security rules are included in the repository:
- **`firestore.rules`**: Restricts access so users can only read/write their own profile and access chats/messages/calls they belong to.
- **`storage.rules`**: Restricts avatar and chat image/audio attachments to authenticated users with 5MB/20MB size caps.

Deploy rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage
```

---

## 🛠️ Built With
- **React 18** + **Vite**
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **Firebase BaaS** (Auth, Firestore, Storage)
- **WebRTC** (`RTCPeerConnection` for real-time voice & video)
- **Web Audio API** (synth ringtone & live sound visualizer spectrum)
- **Lucide React Icons**
