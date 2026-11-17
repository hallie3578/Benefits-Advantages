# Benefits & Advantages (React + Vite, Render)

## Render settings (Static Site)
- Build Command: `npm install && npm run build`   |  Publish Directory: `dist`
- Redirects/Rewrites: Source `/*` -> Destination `/index.html` (Rewrite)

## Dashboard
Live site par: `https://<aapki-site>.onrender.com/admin/login`
Login: username `admin`, password `ChangeMe@2026` + (pehli baar) GitHub token.
Publish dabate hi article GitHub repo mein commit hota hai -> Render 1-2 min mein dobara deploy -> live.

### GitHub token banane ka tareeka
GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token
- Repository access: Only select repositories -> Benefits-Advantages
- Repository permissions: Contents = Read and write
- Expiration: lamba rakho. Token (github_pat_...) copy karke login page par paste karo.

### Password badalna
Terminal: `node -e "console.log(require('crypto').createHash('sha256').update('NAYA_PASSWORD').digest('hex'))"`
Jo hash aaye use `src/config.js` mein `passHash` ki jagah daalo. (username bhi wahin hai)

### Dhyan
- Drafts `content/all.json` mein rehte hain. Repo public hai to drafts GitHub par dikh sakte hain; private repo rakhna behtar hai.
- Token sirf aapke browser mein save hota hai. Kisi ko mat dena.
