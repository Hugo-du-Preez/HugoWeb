# Hugo du Preez - Software Developer Portfolio 🚀

[![Portfolio Preview](https://res.cloudinary.com/dxrak5fdv/image/upload/v1775767250/Screenshot_2026-04-09_224000_rksz4b.png)](https://hugodupreez.com/)

> Modern, responsive portfolio showcasing production-ready projects in C#, Python, SQL, Azure, and full-stack development. AZ-900 certified graduate available August 2026. **Powered by Groq AI chatbot** 🤖 for instant project/skills queries.

<div align=\"center\">

[![Hugo du Preez](https://img.shields.io/badge/Hugo%20du%20Preez-Portfolio-blue?style=for-the-badge&logo=github&logoColor=white)](https://hugodupreez.com/)
[![GitHub Hugo-du-Preez](https://img.shields.io/badge/GitHub-Hugo--du--Preez-181717.svg?logo=github&logoColor=white&style=for-the-badge)](https://github.com/Hugo-du-Preez)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hugo%20du%20Preez-0077B5?logo=linkedin&logoColor=white&style=for-the-badge)](https://www.linkedin.com/in/hugo-du-preez/)
[![AZ-900](https://img.shields.io/badge/Microsoft-AZ--900%20Certified-0078D4?logo=microsoft&logoColor=white&style=for-the-badge)](https://learn.microsoft.com/api/credentials/share/en-us/HugoduPreez-7666/788DBB7B7C3B3708?sharingId=788DBB7C3B3708)
[![Groq](https://img.shields.io/badge/Groq-AI%20Chatbot-00D2FF?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)

</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Dark/Light Theme** | Automatic system preference + manual toggle |
| 📱 **Fully Responsive** | Optimized for mobile, tablet, desktop |
| ⚡ **Vanilla JS** | No frameworks - 100/100 Lighthouse perf |
| 🔄 **Smooth Animations** | Intersection Observer + CSS transitions |
| 📂 **Blog & Projects** | 6 detailed projects + technical blog posts |
| ♿ **Accessibility** | Keyboard nav, focus management, ARIA |
| 🚀 **PWA Ready** | Add to homescreen, offline caching capable |
| 🌍 **SEO Optimized** | Semantic HTML, meta tags, Open Graph |
| 🤖 **Groq AI Chatbot** | Ask about skills/projects/availability instantly! |

## 🛠️ Tech Stack

![C#](https://img.shields.io/badge/C%23-178600?style=for-the-badge&logo=c-sharp&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=azure&logoColor=white)
![Power BI](https://img.shields.io/badge/Power_BI-F2C811?style=for-the-badge&logo=Power-BI&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-00D2FF?style=for-the-badge&logo=groq&logoColor=white)

## 🎯 Featured Projects

### 01. Portfolio Analytics Dashboard
[![Live Demo](https://img.shields.io/badge/Live-Dashboard-brightgreen?style=for-the-badge&logo=power-bi&logoColor=black)](https://white-meadow-022a87d10.1.azurestaticapps.net/)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Code-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Hugo-du-Preez/Portfolio-analytics)

**Business Intelligence** • Power BI • Azure Static Web Apps • Excel/OneDrive  
Enterprise dashboard with embedded analytics and real-time Excel integration.

### 02. AFCON 2025 MongoDB Platform
[![Demo](https://img.shields.io/badge/Flask%20API-Demo-orange?style=for-the-badge&logo=flask&logoColor=white)](projects/project2.html)
[![MongoDB](https://img.shields.io/badge/MongoDB-7000Geolocation-green?style=for-the-badge&logo=mongodb&logoColor=white)](projects/project2.html)

**Database Engineering** • Python/Flask • MongoDB • Geospatial Queries  
High-performance tournament platform managing 700+ player records with REST API.

### 03. Student Management System
[![Demo](https://img.shields.io/badge/Full--Stack-Web%20App-blue?style=for-the-badge&logo=flask&logoColor=white)](projects/project3.html)

**Full-Stack** • Flask • SQLite • Bootstrap 5  
Enterprise CRUD app migrated from Tkinter to modern responsive web architecture.

<details>
<summary>View All 6 Projects ➕ Blog Posts</summary>

| Section | Links |
|---------|-------|
| **All Projects** | [1](projects/project1.html) • [2](projects/project2.html) • [3](projects/project3.html) • [4-6](projects/) |
| **Blog** | [Healthcare](blog/post1.html) • [E-commerce DB](blog/post2.html) • [DB Admin](blog/post3.html) |

</details>

## 🌐 Deployment

### 🎉 Live Site
[![Visit Portfolio](https://img.shields.io/badge/Live%20Site-hugodupreez.com-blue?style=for-the-badge&logo=netlify&logoColor=white)](https://hugodupreez.com/)

**Hosted on Netlify** via GitHub repo for **secure API key management** 🔒

**Why Netlify + GitHub:**
- ✅ **Serverless Functions** (`netlify/functions/chat.js`) host **Groq AI** securely
- ✅ **Environment Variables** keep API keys hidden (`.env` → Netlify dashboard)
- ✅ **Auto-deploys** on `git push` (Netlify + GitHub integration)
- ✅ **Custom Domain** `hugodupreez.com` with HTTPS
- ✅ **Global CDN** + edge caching for lightning performance

### 🚀 Quick Deploy (Netlify CLI)
```bash
# 1. Install & login
npm i -g netlify-cli
netlify login

# 2. Deploy from repo folder
netlify deploy --prod --dir=.

# 3. Add env vars in Netlify dashboard
GROQ_API_KEY=your_key_here
```

### 🔧 Netlify Functions (Groq Chatbot)
```
netlify/functions/
├── chat.js          # Groq Llama-3.1-70B API endpoint
└── knowledge.js     # RAG knowledge base (project details)
```

**Chatbot endpoint:** `/.netlify/functions/chat`

### 📦 Local Development + Testing
```bash
# 1. Serve locally (w/ Netlify functions)
npm i -g netlify-cli
netlify dev

# 2. Or simple static serve
python -m http.server 8000
# open http://localhost:8000

# 3. Test chatbot locally
curl -X POST http://localhost:8888/.netlify/functions/chat \\
  -H \"Content-Type: application/json\" \\
  -d '{\"message\":\"What tech does Hugo use?\"}'
```

## 📂 Project Structure

```
Portfolio-Hugo/
├── index.html                    # Landing page + hero
├── assets/                       # CSS/JS/images
│   ├── css/style.css            # Responsive + dark theme
│   ├── js/main.js               # Toggle + animations + chat JS
│   └── img/                     # Screenshots + assets
├── projects/                    # 6 project detail pages
├── blog/                        # Technical blog posts
├── netlify/                     # Serverless functions
│   └── functions/
│       ├── chat.js              # Groq AI endpoint
│       └── knowledge.js         # Portfolio knowledge base
├── netlify.toml                 # Netlify config (functions, redirects)
├── .gitignore                   # Secure API keys
└── README.md                    # This file
```

## 🎓 Academic Background
- **Diploma IT (Software Development)** - Belgium Campus iTversity (2023-2026)
- **16 Academic Distinctions** (Programming, Databases, Cloud)
- **AZ-900 Certified** ([Verify](https://learn.microsoft.com/api/credentials/share/en-us/HugoduPreez-7666/788DBB7B7C3B3708?sharingId=788DBB7B7C3B3708))
- **Upcoming:** CCNA (Apr 2026) • ISC² Cybersecurity (May 2026)

## 📞 Contact
```
hugo777dupreez@gmail.com
+27 65 843 9361
[LinkedIn](https://linkedin.com/in/hugo-du-preez/)
[GitHub](https://github.com/Hugo-du-Preez)
**Available August 2026** 🚀
```

---

<div align=\"center\">

**Built with ❤️ | **Groq-powered AI** 🤖 | Netlify-hosted 🔒 | Vanilla perfection ⚡**

[![Star](https://img.shields.io/github/stars/Hugo-du-Preez/HugoWeb?style=social&logo=github)](https://github.com/Hugo-du-Preez/HugoWeb/stargazers/)
[![License](https://img.shields.io/github/license/Hugo-du-Preez/HugoWeb?style=flat-square&logo=MIT)](LICENSE)

</div>
