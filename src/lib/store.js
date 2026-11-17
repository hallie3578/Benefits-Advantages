import {useEffect,useState} from 'react';
let cache=null;
export function useArticles(){const [l,setL]=useState(cache);
useEffect(()=>{let ok=true;fetch('/data/articles.json?t='+Date.now()).then(r=>r.json()).then(d=>{cache=d;ok&&setL(d)}).catch(()=>ok&&setL(cache||[]));return()=>{ok=false}},[]);return l}
export const slugify=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'article';
export const fmtDate=d=>new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
export const readTime=h=>Math.max(1,Math.round(h.replace(/<[^>]+>/g,' ').split(/\s+/).length/200));
