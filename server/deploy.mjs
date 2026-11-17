import fs from 'node:fs';import path from 'node:path';
import cfg from './config.js';import {dist,uploadsDir,loadStore,siteFiles,upload} from './neo.mjs';
if(!fs.existsSync(path.join(dist,'index.html')))throw new Error('Pehle chalao: npm run build');
const walk=(d,b='')=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name),b+e.name+'/'):[{remote:b+e.name,data:fs.readFileSync(path.join(d,e.name))}]);
const skip=new Set(['index.html','robots.txt','sitemap.xml','data/articles.json','.htaccess','_redirects']);
const files=[...walk(dist).filter(f=>!skip.has(f.remote)&&!f.remote.endsWith('.map')),...siteFiles(loadStore().filter(a=>a.pub)),
...fs.readdirSync(uploadsDir).map(n=>({remote:'uploads/'+n,data:fs.readFileSync(path.join(uploadsDir,n))}))];
console.log(`${files.length} files upload ho rahi hain…`);
await upload(files);console.log('Done ✓  ->',cfg.SITE_URL);
