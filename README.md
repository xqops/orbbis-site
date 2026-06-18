[README.md](https://github.com/user-attachments/files/29113011/README.md)
<div align="center">

<img src="https://raw.githubusercontent.com/xqops/orbbis/main/assets/logo.png" alt="Orbbis Logo" width="80"/>

# Orbbis

**Visual Discord bot builder — no code required.**

[![Live](https://img.shields.io/badge/live-orbbis-7c3aed?style=flat-square&logo=github)](https://xqops.github.io/orbbis/)
[![Discord](https://img.shields.io/badge/community-discord-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/3ePFQtkdzm)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](#-license)
[![Ko-fi](https://img.shields.io/badge/support-ko--fi-ff5e5b?style=flat-square&logo=kofi&logoColor=white)](https://ko-fi.com/xqops)

[🌐 Try it now](https://xqops.github.io/orbbis/) · [💬 Join the community](https://discord.gg/3ePFQtkdzm) · [☕ Support the project](https://ko-fi.com/xqops)

---

</div>

---

## ✨ What is Orbbis?

Orbbis is a free, open-source platform that lets anyone build a fully functional Discord bot — visually, in minutes, with zero coding knowledge required.

You configure everything through a clean 4-step editor. At the end, you download a ready-to-host Node.js project and deploy it wherever you want.

> Solo indie project built from scratch. Free for everyone, forever.

---

## 🚀 How it works

| Step | Action |
|------|--------|
| **1. Token** | Paste your bot token from Discord Developer Portal |
| **2. Commands** | Create custom slash commands |
| **3. Systems** | Enable moderation, tickets, reaction roles and more |
| **4. Download** | Get your ZIP — ready to host instantly |

---

## 🛠️ Features

- 🤖 Generates a complete **Discord.js v14** project
- 🎨 **Full visual identity** — custom name, avatar, status
- 🛡️ **Auto-moderation** — anti-spam, word filter, raid protection
- 🎫 **Ticket system** — with categories and `/setup-tickets`
- 🎭 **Reaction roles** — assign roles with emoji reactions
- 📦 **Multi-platform deploy** — Discloud, Railway, Render or generic
- 🌐 **EN / PT-BR** — full bilingual support
- 🌙 **Dark / Light theme** — your choice
- ✅ No sign-up. No login. No catch.

---

## 📁 Project structure

```
orbbis/
├── index.html             ← Landing page
├── editor.html            ← Main bot editor (4-step flow)
├── docs.html              ← Documentation
├── privacy.html           ← Privacy policy
├── server.js              ← Express server (serves static files)
├── package.json
├── discloud.config        ← Discloud deploy config
│
├── css/
│   └── editor.css         ← All editor styles
│
└── js/
    ├── translations.js    ← UI strings (EN / PT-BR)
    ├── systems-config.js  ← Bot module configuration
    ├── bot-generator.js   ← Bot code generation logic
    └── editor.js          ← UI logic and interactions
```

> 💬 Code comments written with AI assistance (Claude) to make the code easier to understand.

---

## 🧱 Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, Vanilla JS |
| Backend | Node.js + Express |
| Generated bot | Discord.js v14, Node.js 20+ |
| Hosting | Discloud (via `discloud.config`) |

---

## 💻 Run locally

```bash
npm install
node server.js
# Open: http://localhost:8080
```

---

## 💬 Community

Got a question, suggestion, or found a bug?

Join the Discord server — built specifically for the Orbbis community:

**[discord.gg/3ePFQtkdzm](https://discord.gg/3ePFQtkdzm)**

The generated bot code has been tested, but bugs can happen. Report them there and I'll look into it!

---

## 💜 Support

Orbbis is maintained by one person, in their free time, completely free for everyone.

If it helped you in any way, consider supporting via **[Ko-fi](https://ko-fi.com/xqops)**. But using the project is support enough. 🙏

---

## 📄 License

MIT — free to study, modify and distribute.

---

<div align="center">

Made with 💜 by [xqops](https://github.com/xqops)

</div>
