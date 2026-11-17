import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import cfg from './config.js';import {dist,uploadsDir,loadStore,saveStore,publishSave,publishDelete,uploadImg} from './neo.mjs';
const sig=e=>crypto.createHmac('sha256',cfg.TOKEN_SECRET).update(String(e)).digest('hex');
const eq=(x,y)=>{const A=Buffer.from(String(x)),B=Buffer.from(String(y));return A.length===B.length&&crypto.timingSafeEqual(A,B)};
const authed=req=>{const [p,s]=String(req.headers['x-token']||'').split('.');return !!(p&&s&&+p>Date.now()/1000&&eq(s,sig(p)))};
const readBuf=req=>new Promise(r=>{const c=[];req.on('data',d=>c.push(d));req.on('end',()=>r(Buffer.concat(c)))});
const strip=s=>String(s??'').replace(/<[^>]*>/g,'');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.txt':'text/plain','.xml':'application/xml'};
const sendFile=(res,f)=>{res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)};
async function api(req,res,act){const send=(d,c=200)=>{res.writeHead(c,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(d))};
const raw=await readBuf(req),jin=()=>{try{return JSON.parse(raw.toString()||'{}')}catch(e){return {}}};
if(act==='login'){const b=jin();await new Promise(r=>setTimeout(r,500));if(!eq(b.user||'',cfg.ADMIN_USER)||!eq(b.password||'',cfg.ADMIN_PASSWORD))return send({error:'Galat username ya password'},401);
const e=Math.floor(Date.now()/1000)+604800;return send({token:e+'.'+sig(e)})}
if(!authed(req))return send({error:'Session expire ho gaya, dobara login karo'},401);
let a=loadStore();
if(act==='list')return send(a);
try{
if(act==='save'){const b=jin();let slug=String(b.slug||'').toLowerCase().replace(/[^a-z0-9-]/g,'');if(!slug||!String(b.title||'').trim())return send({error:'Title missing hai'},400);
if(b.isNew){const base=slug;let n=2;while(a.some(x=>x.slug===slug))slug=base+'-'+n++}
let h=String(b.html||'').replace(/<(script|iframe|object|embed)\b[\s\S]*?(<\/\1>|$)/gi,'').replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi,'');
const keep={slug,title:strip(b.title),date:/^\d{4}-\d\d-\d\d$/.test(b.date||'')?b.date:new Date().toISOString().slice(0,10),excerpt:strip(b.excerpt),image:String(b.image||''),imageAlt:strip(b.imageAlt),html:h,
faqs:(b.faqs||[]).map(f=>({q:strip(f.q),a:strip(f.a)})),note:strip(b.note),related:!!b.related,pub:!!b.pub};
const i=a.findIndex(x=>x.slug===slug);i>=0?a[i]=keep:a.unshift(keep);saveStore(a);
try{await publishSave(a,keep)}catch(e){return send({error:'Local save ho gaya, par Neocities publish fail: '+e.message},502)}return send({ok:true,slug})}
if(act==='delete'){const slug=jin().slug;a=a.filter(x=>x.slug!==slug);saveStore(a);
try{await publishDelete(a,slug)}catch(e){return send({error:'Local delete ho gaya, par Neocities update fail: '+e.message},502)}return send({ok:true})}
if(act==='upload'){const fd=await new Request('http://x/',{method:'POST',headers:{'content-type':req.headers['content-type']||''},body:raw}).formData();const f=fd.get('file');
if(!f||!f.size||f.size>5e6)return send({error:'File nahi mili ya 5MB se badi hai'},400);const buf=Buffer.from(await f.arrayBuffer()),m=buf.subarray(0,12).toString('latin1');
const ext=buf[0]===0xFF&&buf[1]===0xD8?'jpg':m.startsWith('\x89PNG')?'png':m.startsWith('GIF8')?'gif':(m.startsWith('RIFF')&&m.slice(8,12)==='WEBP')?'webp':null;
if(!ext)return send({error:'Sirf jpg/png/webp/gif allowed'},400);const name=new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+crypto.randomBytes(5).toString('hex')+'.'+ext;
fs.writeFileSync(path.join(uploadsDir,name),buf);try{await uploadImg(name,buf)}catch(e){return send({error:'Image Neocities par upload nahi hui: '+e.message},502)}return send({url:'/uploads/'+name})}
}catch(e){return send({error:e.message},500)}
send({error:'Unknown action'},404)}
http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://x');
if(u.pathname==='/api/api.php')return api(req,res,u.searchParams.get('action'));
if(u.pathname==='/data/articles.json'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(loadStore().filter(x=>x.pub)))}
if(u.pathname.startsWith('/uploads/')){const f=path.join(uploadsDir,path.basename(u.pathname));if(fs.existsSync(f))return sendFile(res,f)}
let f=path.join(dist,decodeURIComponent(u.pathname));if(!f.startsWith(dist)||!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(dist,'index.html');
if(!fs.existsSync(f)){res.writeHead(500);return res.end('dist folder nahi mila. Pehle: npm run build')}sendFile(res,f)}catch(e){res.writeHead(500);res.end(e.message)}})
.listen(cfg.PORT,'127.0.0.1',()=>console.log(`\n  Admin ready: http://localhost:${cfg.PORT}/admin/login\n`));
