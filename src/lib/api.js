import {GH,ADMIN} from '../config';
/* Render par backend nahi hota, isliye dashboard articles ko GitHub API se repo mein commit karta hai.
   Render push dekhkar site dobara build karta hai -> article live. */
const SK='baa_token',GK='baa_gh',B=`https://api.github.com/repos/${GH.owner}/${GH.repo}`;
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
export const token=()=>{const t=ls.get(SK);return t&&+t>Date.now()&&ls.get(GK)?t:null};
export const hasGh=()=>!!ls.get(GK);
export const clearToken=()=>ls.del(SK);
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const expired=()=>{ls.del(SK);ls.del(GK);return new Error('Session expire: GitHub token galat ya expire ho gaya, dobara login karo')};
async function gh(url,body,method){const r=await fetch(url,{method:method||(body?'POST':'GET'),cache:'no-store',headers:{Authorization:'Bearer '+ls.get(GK),Accept:'application/vnd.github+json',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
if(r.status===401)throw expired();const d=await r.json().catch(()=>({}));
if(!r.ok)throw new Error(r.status===403||r.status===404?'GitHub: token ko is repo ka "Contents: Read and write" access chahiye':'GitHub error: '+(d.message||r.status));return d}
export async function apiLogin(user,password,tok){await new Promise(r=>setTimeout(r,400));
if(user!==ADMIN.user||await sha(password)!==ADMIN.passHash)throw new Error('Galat username ya password');
if(tok)ls.set(GK,tok.trim());if(!ls.get(GK))throw new Error('GitHub token paste karo (pehli baar zaroori hai)');
try{const r=await gh(B);if(!r.permissions||!r.permissions.push)throw new Error('Is token se repo mein likhne ki permission nahi hai (Contents: Read and write)')}catch(e){if(tok)ls.del(GK);throw e}
ls.set(SK,String(Date.now()+6048e5))}
async function loadAll(){const r=await fetch(`${B}/contents/content/all.json?ref=${GH.branch}`,{cache:'no-store',headers:{Authorization:'Bearer '+ls.get(GK),Accept:'application/vnd.github.raw+json'}});
if(r.status===401)throw expired();if(r.ok)return r.json();
if(r.status===404){const p=await fetch('/data/articles.json?t='+Date.now());return p.ok?p.json():[]}
throw new Error('GitHub error '+r.status)}
export const apiList=loadAll;
async function commit(files,msg){const ref=await gh(`${B}/git/ref/heads/${GH.branch}`),parent=ref.object.sha,pc=await gh(`${B}/git/commits/${parent}`),tree=[];
for(const f of files){if(f.b64){const b=await gh(`${B}/git/blobs`,{content:f.b64,encoding:'base64'});tree.push({path:f.path,mode:'100644',type:'blob',sha:b.sha})}else tree.push({path:f.path,mode:'100644',type:'blob',content:f.content})}
const t=await gh(`${B}/git/trees`,{base_tree:pc.tree.sha,tree}),c=await gh(`${B}/git/commits`,{message:msg,tree:t.sha,parents:[parent]});
await gh(`${B}/git/refs/heads/${GH.branch}`,{sha:c.sha},'PATCH')}
async function publish(a,files,msg){const pub=a.filter(x=>x.pub),u=['','/articles','/about','/editorial-policy','/contact','/privacy-policy','/terms','/disclaimer',...pub.map(x=>'/articles/'+x.slug)];
const sm='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+u.map(p=>`<url><loc>${location.origin}${p}</loc></url>`).join('')+'</urlset>';
await commit([...files,{path:'content/all.json',content:JSON.stringify(a,null,1)},{path:'public/data/articles.json',content:JSON.stringify(pub,null,1)},{path:'public/sitemap.xml',content:sm}],msg)}
const strip=s=>String(s==null?'':s).replace(/<[^>]*>/g,'');
function extract(d,files){const m=/^data:image\/(\w+);base64,(.+)$/.exec(d);if(!m)return d;const ext=m[1]==='jpeg'?'jpg':m[1],p=`uploads/${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,9)}.${ext}`;files.push({path:'public/'+p,b64:m[2]});return '/'+p}
export async function apiSave(b){const a=await loadAll(),files=[];let slug=String(b.slug||'').toLowerCase().replace(/[^a-z0-9-]/g,'');
if(!slug||!String(b.title||'').trim())throw new Error('Title missing hai');
if(b.isNew){const base=slug;let n=2;while(a.some(x=>x.slug===slug))slug=base+'-'+n++}
const html=String(b.html||'').replace(/<(script|iframe|object|embed)\b[\s\S]*?(<\/\1>|$)/gi,'').replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi,'').replace(/src="(data:image\/[^"]+)"/g,(_,d)=>`src="${extract(d,files)}"`);
const keep={slug,title:strip(b.title),date:/^\d{4}-\d\d-\d\d$/.test(b.date||'')?b.date:new Date().toISOString().slice(0,10),excerpt:strip(b.excerpt),image:extract(String(b.image||''),files),imageAlt:strip(b.imageAlt),html,
faqs:(b.faqs||[]).map(f=>({q:strip(f.q),a:strip(f.a)})),note:strip(b.note),related:!!b.related,pub:!!b.pub};
const i=a.findIndex(x=>x.slug===slug);i>=0?a[i]=keep:a.unshift(keep);
await publish(a,files,`${keep.pub?'Publish':'Save draft'}: ${keep.title}`);return {ok:true,slug}}
export async function apiDelete(slug){const a=(await loadAll()).filter(x=>x.slug!==slug);await publish(a,[],'Delete: '+slug)}
// Images publish ke waqt hi repo mein jaati hain (ek hi commit mein). Tab tak preview ke liye data URL use hota hai.
export const apiUpload=blob=>new Promise(r=>{const f=new FileReader();f.onload=()=>r({url:f.result});f.readAsDataURL(blob)});
