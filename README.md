# Benefits & Advantages: React + Neocities (no database)

## Ek baar ka setup
1. `server/config.js` kholo: ADMIN_PASSWORD, TOKEN_SECRET badlo aur NEOCITIES_API_KEY daalo
   (Neocities > Manage Site Settings > API Key).
2. `npm install` aur phir `npm run build`
3. `npm run deploy`  -> poori site Neocities par upload ho jayegi

## Roz articles daalne ke liye
    npm run admin
Browser mein kholo: http://localhost:4001/admin/login  -> login -> New Article -> Publish
Publish dabate hi article Neocities par live ho jata hai (data/articles.json + article ka page + sitemap).

## Dhyan
- Dashboard sirf aapke computer par chalta hai (live site par /admin nahi chalta).
- Articles ka backup: `server/store/store.json` aur `server/uploads/`
- Code/design badalne ke baad: `npm run build` phir `npm run deploy`
