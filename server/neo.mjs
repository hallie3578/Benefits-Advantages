import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import cfg from './config.js';import {SITE} from '../src/config.js';import {PAGES} from '../src/data/pages.js';
export const __d=path.dirname(fileURLToPath(import.meta.url)),root=path.join(__d,'..'),dist=path.join(root,'dist'),sd=path.join(__d,'store'),uploadsDir=path.join(__d,'uploads'),storeF=path.join(sd,'store.json');
fs.mkdirSync(sd,{recursive:true});fs.mkdirSync(uploadsDir,{recursive:true});
export const loadStore=()=>{if(!fs.existsSync(storeF))fs.copyFileSync(path.join(root,'public/data/articles.json'),storeF);return JSON.parse(fs.readFileSync(storeF,'utf8'))};
export const saveStore=a=>fs.writeFileSync(storeF,JSON.stringify(a,null,1));
const hdr=()=>{if(!cfg.NEOCITIES_API_KEY)throw new Error('server/config.js mein NEOCITIES_API_KEY daalo');return {Authorization:'Bearer '+cfg.NEOCITIES_API_KEY}};
export async function upload(files){for(let i=0;i<files.length;i+=8){const fd=new FormData();for(const f of files.slice(i,i+8))fd.append(f.remote,new Blob([f.data]),path.basename(f.remote));
const r=await fetch('https://neocities.org/api/upload',{method:'POST',headers:hdr(),body:fd});const j=await r.json().catch(()=>({}));
if(!r.ok||j.result!=='success')throw new Error('Neocities: '+(j.message||j.error_type||r.status))}}
export async function del(p){try{await fetch('https://neocities.org/api/delete',{method:'POST',headers:hdr(),body:new URLSearchParams([['filenames[]',p]])})}catch(e){}}
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const base=()=>fs.readFileSync(path.join(dist,'index.html'),'utf8');
// Har route ka asli HTML (title/description/content) taaki Google aur AI crawlers ko page padhne ko mile
const page=(route,title,desc,body='')=>{const t=title?(title.includes(SITE.name)?title:`${title} | ${SITE.name}`):`${SITE.name}: ${SITE.tagline}`;
return base().replace(/<title>.*?<\/title>/s,`<title>${esc(t)}</title><meta name="description" content="${esc(desc)}"/><link rel="canonical" href="${cfg.SITE_URL}${route}"/>`).replace('<div id="root"></div>',()=>`<div id="root">${body}</div>`)};
const docBody=p=>`<h1>${esc(p.title)}</h1><p>${esc(p.intro)}</p>`+p.sections.map(s=>`<h2>${esc(s.h)}</h2>`+s.p.map(t=>`<p>${esc(t)}</p>`).join('')).join('');
const STATIC=[['/articles','Articles','Browse all Benefits & Advantages articles on AI, money and online business, each explained in plain language.'],
['/contact','Contact','Contact Benefits & Advantages to suggest a topic, report a mistake or ask a question.'],...Object.values(PAGES).map(p=>[p.path,p.title,p.desc])];
export const articleFile=a=>({remote:`articles/${a.slug}/index.html`,data:page('/articles/'+a.slug,a.title,a.excerpt,`<article><h1>${esc(a.title)}</h1>${a.html}</article>`)});
export const sitemapXml=list=>{const u=['','/articles',...STATIC.slice(1).map(x=>x[0]),...list.map(a=>'/articles/'+a.slug)];
return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+u.map(p=>`<url><loc>${cfg.SITE_URL}${p}</loc></url>`).join('')+'</urlset>'};
export const core=list=>[{remote:'data/articles.json',data:JSON.stringify(list,null,1)},{remote:'sitemap.xml',data:sitemapXml(list)}];
export function siteFiles(list){const f=[...core(list),{remote:'robots.txt',data:`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${cfg.SITE_URL}/sitemap.xml\n`},
{remote:'index.html',data:page('/','',SITE.description,`<h1>${esc(SITE.name)}: ${esc(SITE.tagline)}</h1><p>${esc(SITE.description)}</p>`)},{remote:'not_found.html',data:base()}];
for(const [r,t,d] of STATIC){const p=Object.values(PAGES).find(x=>x.path===r);f.push({remote:r.slice(1)+'/index.html',data:page(r,t,d,p?docBody(p):`<h1>${esc(t)}</h1><p>${esc(d)}</p>`)})}
for(const a of list)f.push(articleFile(a));return f}
export async function publishSave(all,a){const list=all.filter(x=>x.pub),f=core(list);if(a.pub)f.push(articleFile(a));await upload(f);if(!a.pub)await del(`articles/${a.slug}/index.html`)}
export async function publishDelete(all,slug){await upload(core(all.filter(x=>x.pub)));await del(`articles/${slug}/index.html`)}
export const uploadImg=(name,buf)=>upload([{remote:'uploads/'+name,data:buf}]);
