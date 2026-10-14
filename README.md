# Sharnitha T — Full Stack Data Analyst Portfolio

An executive, high-performance portfolio website built for **Sharnitha T**, inspired by the visual design, interactive polish, and typography of [ilijakorodic.com](https://ilijakorodic.com/), customized with her resume and an ambient **Crimson & Ruby Red Gradient** theme (`#6C1A1A`).

---

## 🎨 Theme & Visual Architecture

- **Primary Accent**: Deep Wine Crimson (`#6C1A1A`)
- **Gradient Aura**: `#6C1A1A` → `#8C1F1F` → Ruby `#B22222` → Coral `#E63946` → Rose Glow (`#FF758F`)
- **Background**: Deep Obsidian Velvet (`#0A0304`) with glassmorphic cards (`backdrop-blur-xl`)
- **Typography**: Montserrat & Inter
- **Micro-Interactions**:
  - Custom trailing cursor with interactive expand ring
  - Glowing ambient radial lights
  - Infinite marquee ticker of core technical skills
  - "Social Wave" hover buttons inspired by Ilija Korodic's signature design
  - Interactive Project Deep-Dive modal with data pipeline steps & metrics
  - One-click copy for email (`sharnithat@gmail.com`)

---

## 🚀 How to Run & Preview Locally

### Option 1: Instant Direct Launch (No dependencies needed!)
Simply **double-click** `index.html` or `run_portfolio.bat` in File Explorer. It opens instantly in Chrome, Edge, Brave, or Firefox.

### Option 2: Run with Python Local Server
Since Python 3.11 is installed, run:
```bash
python run_portfolio.py
```
Or:
```bash
python -m http.server 3000
```
Then visit: [http://localhost:3000](http://localhost:3000)

### Option 3: Vite + React Development (When Node.js is installed)
```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
portfolio/
├── index.html            # Standalone React 18 production app (Zero install required)
├── siteConfig.js         # Central configuration file for links, bio, & projects
├── run_portfolio.bat     # Windows 1-click launcher
├── run_portfolio.py     # Python local server launcher
├── package.json          # Node.js dependencies for Vite build
├── vite.config.js        # Vite build tool configuration
├── tailwind.config.js    # Tailwind styling with #6C1A1A palette
├── postcss.config.js     # PostCSS configuration
├── src/
│   ├── App.jsx           # Modular React main component
│   ├── main.jsx          # React DOM entry point
│   └── index.css         # Custom animations, glassmorphism, & scrollbars
└── README.md             # Documentation & deployment guide
```

---

## 🛠️ Updating Your Links & Information

Open `siteConfig.js` to change:
- **GitHub URL**: Replace `"https://github.com/sharnitha-t"` with your actual repository URL
- **LinkedIn URL**: Replace `"https://linkedin.com/in/sharnitha-t"` with your profile link
- **Email**: Already pre-configured from your resume (`sharnithat@gmail.com`)
- **Projects & Highlights**: Edit or add projects anytime

---

## 🌐 Free 1-Click Deployment

### 1. GitHub Pages
1. Push this folder to a GitHub repository named `portfolio` or `sharnitha-t.github.io`.
2. Go to **Settings** > **Pages** > Select `main` branch > `/root` folder > Click **Save**.
3. Your website will be live in 60 seconds!

### 2. Vercel / Netlify
Drag and drop this folder directly into [app.netlify.com/drop](https://app.netlify.com/drop) or import from GitHub into [vercel.com](https://vercel.com).
