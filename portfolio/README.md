# Cybersecurity Expert Portfolio

## 🚀 Quick Start
1. Download/clone this folder
2. Open `index.html` in browser (or deploy to Netlify/Vercel/GitHub Pages)
3. For full functionality, serve via local server: `npx serve .` (or equivalent)

## 📁 Folder Structure
```
/portfolio
  index.html
  achievements.html
  contact.html
  services.html
  README.md
  admin/
    secure-entry.html
    dashboard.html
  assets/
    css/
      global.css
      page1.css
      page2.css
      page3.css
      page4.css
      admin.css
    js/
      global.js
      page1.js
      page2.js
      page3.js
      page4.js
      admin.js
      admin-config.js
    data/
      achievements.json
      services.json
```

## 🔐 Admin Panel Access
1. Navigate to: `/admin/secure-entry.html`
2. Default credentials are set in `assets/js/admin-config.js`
3. Open that file, change USERNAME and PASSWORD_HASH before deploying
4. To generate a new password hash: open browser console, run:
   ```javascript
   bcrypt.hash("yourpassword", 10).then(h => console.log(h))
   ```
5. Paste the hash into `admin-config.js`
6. **NEVER share `admin-config.js` publicly. Add it to .gitignore.**

## ✏️ How to Update Your Content (Admin Panel Guide)
### Adding an Achievement:
1. Go to Admin Panel → Achievements & Projects tab
2. Click "+ Add New Achievement"
3. Fill in: Title (what you won/did), Year, Category, Description
4. Click Save — it appears on your public site instantly

### Adding a Project:
1. Go to Admin Panel → Achievements & Projects tab
2. Click "+ Add New Project"
3. Fill in Details, Link, Tags, etc.
4. Save.

### Adding a Service:
1. Go to Admin Panel → Services & Work tab
2. Click "+ Add Service"
3. Provide details and SVG icon.
4. Save.

### Editing / Deleting Items:
- Click the pencil ✏️ icon on any item → edit fields → Save
- Click the trash 🗑️ icon → confirm in popup → removed

## 🌐 Deployment
- Recommended: Netlify (free, HTTPS automatic)
- Drag and drop the entire `/portfolio` folder to app.netlify.com/drop
- Your site is live with HTTPS in 30 seconds

## 🛡️ Security Notes
- Change admin credentials before going live
- Never deploy over HTTP
- Keep `admin-config.js` out of version control (.gitignore)
- Session auto-expires after 30 minutes

## 🔧 Customization
- Colors: Edit CSS variables in `assets/css/global.css`
- Your photo: Replace the placeholder div in `index.html` with your `<img>` tag
- Contact details: Edit directly in `contact.html` or via admin panel

## 📦 Dependencies (All CDN, no install needed)
- Three.js r158
- GSAP 3.12
- Orbitron + Share Tech Mono + Rajdhani (Google Fonts)
- bcrypt.js 2.4.3
