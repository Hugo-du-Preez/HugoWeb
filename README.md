# Hugo du Preez - Software Developer Portfolio 🚀

[![Portfolio Preview](https://res.cloudinary.com/dxrak5fdv/image/upload/v1775767250/Screenshot_2026-04-09_224000_rksz4b.png)](https://hugodupreez.com/)

> Modern, responsive portfolio showcasing production-ready projects in C#, Python, SQL, Azure, and full-stack development. AZ-900 certified graduate available August 2026.

<div align=\"center\">

[![Hugo du Preez](https://img.shields.io/badge/Hugo%20du%20Preez-Portfolio-blue?style=for-the-badge&logo=github&logoColor=white)](https://hugodupreez.com/)
[![GitHub Hugo-du-Preez](https://img.shields.io/badge/GitHub-Hugo--du--Preez-181717.svg?logo=github&logoColor=white&style=for-the-badge)](https://github.com/Hugo-du-Preez)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hugo%20du%20Preez-0077B5?logo=linkedin&logoColor=white&style=for-the-badge)](https://www.linkedin.com/in/hugo-du-preez/)
[![AZ-900](https://img.shields.io/badge/Microsoft-AZ--900%20Certified-0078D4?logo=microsoft&logoColor=white&style=for-the-badge)](https://learn.microsoft.com/api/credentials/share/en-us/HugoduPreez-7666/788DBB7B7C3B3708?sharingId=788DBB7B7C3B3708)

</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Dark/Light Theme** | Automatic system preference + manual toggle |
| 📱 **Fully Responsive** | Optimized for mobile, tablet, desktop |
| ⚡ **Vanilla JS** | No frameworks - 100/100 Lighthouse perf |
| 🔄 **Smooth Animations** | Intersection Observer + CSS transitions |
| 📂 **Blog & Projects** | 3 featured projects + technical blog posts |
| ♿ **Accessibility** | Keyboard nav, focus management, ARIA |
| 🚀 **PWA Ready** | Add to homescreen, offline caching capable |
| 🌍 **SEO Optimized** | Semantic HTML, meta tags, Open Graph |

## 🛠️ Tech Stack

![C#](https://img.shields.io/badge/C%23-178600?style=for-the-badge&logo=c-sharp&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=azure&logoColor=white)
![Power BI](https://img.shields.io/badge/Power_BI-F2C811?style=for-the-badge&logo=Power-BI&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

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
<summary>View All 3 Projects ➕ Blog Posts</summary>

| Section | Links |
|---------|-------|
| **All Projects** | [Project 1](projects/project1.html) • [Project 2](projects/project2.html) • [Project 3](projects/project3.html) • [4-6](projects/) |
| **Blog** | [Healthcare Data @ Scale](blog/post1.html) • [Distributed DB Design](blog/post2.html) • [SQL vs NoSQL](blog/post3.html) |

</details>


## 🌐 Deployment

### 🎉 Live Site
[![Visit Portfolio](https://img.shields.io/badge/Live%20Site-hugodupreez.com-blue?style=for-the-badge&logo=github&logoColor=white)](https://hugodupreez.com/)

**Hosted on GitHub Pages with custom domain `hugodupreez.com`**

### 🚀 Deploy to GitHub Pages
```bash
# 1. Push to main/gh-pages branch
git add .
git commit -m \"Update portfolio\"
git push origin main

# 2. GitHub Pages auto-deploys from main branch root
# Settings > Pages > Source: Deploy from branch > main > / (root)
```

### 🔧 Custom Domain Setup
```
# Add CNAME file (created below)
echo \"hugodupreez.com\" > CNAME
echo \"www.hugodupreez.com\" >> CNAME

# GitHub Settings:
# - Pages > Custom domain: hugodupreez.com
# - Enforce HTTPS: Enabled
# - WWW redirect: Enabled (if desired)
```

### ☁️ Alternative: Azure Static Web Apps (Current CI/CD)
- Workflow auto-deploys on push: `.github/workflows/azure-static-web-apps-salmon-field-095c73810.yml`
- Free tier: 100GB bandwidth/month, global CDN

## 📂 Project Structure

```
Portfolio-Hugo/
├── index.html              # Main landing page
├── assets/
│   ├── css/style.css       # Dark/light theme, responsive
│   ├── js/main.js          # Theme toggle, mobile nav, animations
│   └── img/                # Hero images, project screenshots
├── projects/               # 6 detailed project pages
│   └── project1.html       # Power BI dashboard
├── blog/                   # Technical articles
│   └── post1.html          # Cloud healthcare data
├── staticwebapp.config.json # Azure SWA caching/CSP
├── .github/workflows/      # CI/CD pipeline
└── README.md              # This file!
```

## 🏃‍♂️ Local Development

```bash
# 1. Clone & open in VS Code/browser
git clone https://github.com/Hugo-du-Preez/HugoWeb.git
cd HugoWeb
open index.html  # or Live Server extension

# 2. Edit & preview changes instantly
# No build step - pure static HTML/CSS/JS

# 3. Validate (Python script included)
python validate_site.py
```

## 📊 Academic Achievements
- **Diploma in Information Technology** (Software Development) - Belgium Campus iTversity
- **16 Academic Distinctions** across programming, databases, cloud
- **AZ-900: Microsoft Azure Fundamentals** ([Verify](https://learn.microsoft.com/api/credentials/share/en-us/HugoduPreez-7666/788DBB7B7C3B3708?sharingId=788DBB7B7C3B3708))
- Upcoming: CCNA, ISC² Certified in Cybersecurity

## 📞 Get In Touch
```
hugo777dupreez@gmail.com
+27 65 843 9361
[LinkedIn](https://www.linkedin.com/in/hugo-du-preez/)
[GitHub](https://github.com/Hugo-du-Preez)
```

**Available for junior developer roles from August 2026** 🚀

---

<div align=\"center\">

**Made with ❤️ using vanilla HTML/CSS/JS**  
[![Star on GitHub](https://img.shields.io/github/stars/Hugo-du-Preez/HugoWeb?style=social&logo=github)](https://github.com/Hugo-du-Preez/HugoWeb/stargazers/)
[![License](https://img.shields.io/github/license/Hugo-du-Preez/HugoWeb?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjI1IDMuNzVMNy41IDkuNUw1LjM1IDcuMzVMMy44OCA4Ljg4TDcuNSA5LjVMMTMuMjUgMy43NVoiIGZpbGw9IiM5RkUzRkMiLz4KPHBhdGggZD0iTTExLjUgMS41SDMuNUwxIDEuNUwxIDExLjVIMTFMMTMuNSAxMUwxMy41IDNINVoiIGZpbGw9IiNBRDgwMkYiLz4KPC9zdmc+)](LICENSE)

</div>

<!--- Markdown rendered perfectly on GitHub --->

