import {useEffect} from 'react';import {SITE} from '../config';
const tag=(sel,attrs)=>{let e=document.head.querySelector(sel);if(!e){e=document.createElement(sel.startsWith('link')?'link':'meta');document.head.appendChild(e)}Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v))};
export function useSeo({title,description,path='/',image,type='website',jsonLd,noindex}={}){
useEffect(()=>{const t=title?(title.includes(SITE.name)?title:`${title} | ${SITE.name}`):`${SITE.name}: ${SITE.tagline}`,d=description||SITE.description,u=SITE.url+path;
document.title=t;tag('meta[name="description"]',{name:'description',content:d});tag('link[rel="canonical"]',{rel:'canonical',href:u});
tag('meta[name="robots"]',{name:'robots',content:noindex?'noindex,nofollow':'index,follow,max-image-preview:large'});
tag('meta[property="og:title"]',{property:'og:title',content:t});tag('meta[property="og:description"]',{property:'og:description',content:d});
tag('meta[property="og:type"]',{property:'og:type',content:type});tag('meta[property="og:url"]',{property:'og:url',content:u});
if(image)tag('meta[property="og:image"]',{property:'og:image',content:image.startsWith('http')?image:SITE.url+image});
tag('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
document.getElementById('ld')?.remove();
if(jsonLd){const s=document.createElement('script');s.id='ld';s.type='application/ld+json';s.text=JSON.stringify(jsonLd);document.head.appendChild(s)}
},[title,description,path,image,type,noindex,JSON.stringify(jsonLd||null)]);}
export const faqLd=f=>f.length?{'@type':'FAQPage',mainEntity:f.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))}:null;
