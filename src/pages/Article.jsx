import {useState,useEffect} from 'react';import {Link,useParams} from 'react-router-dom';import Card,{Cover} from '../components/Card';
import {useArticles,fmtDate,readTime} from '../lib/store';import {useSeo,faqLd} from '../lib/seo';import {SITE} from '../config';import NotFound from './NotFound';
export default function Article(){const {slug}=useParams(),list=useArticles(),[p,setP]=useState(0);
const a=list&&list.find(x=>x.slug===slug&&x.pub),rel=a?list.filter(x=>x.pub&&x.slug!==a.slug).slice(0,3):[];
useEffect(()=>{const h=()=>{const d=document.documentElement;setP(Math.min(1,scrollY/Math.max(1,d.scrollHeight-innerHeight)))};addEventListener('scroll',h,{passive:true});return()=>removeEventListener('scroll',h)},[]);
useSeo(a?{title:a.title,description:a.excerpt,path:'/articles/'+a.slug,image:a.image,type:'article',
jsonLd:{'@context':'https://schema.org','@graph':[{'@type':'Article',headline:a.title,description:a.excerpt,image:a.image?SITE.url+a.image:undefined,datePublished:a.date,author:{'@type':'Organization',name:SITE.name},publisher:{'@type':'Organization',name:SITE.name},mainEntityOfPage:SITE.url+'/articles/'+a.slug},faqLd(a.faqs||[])].filter(Boolean)}}:{title:list?'Not found':'Loading',noindex:!!list});
if(!list)return <div className="wrap art"><div className="card sk"/></div>;
if(!a)return <NotFound/>;
return <article className="wrap art"><div className="prog" style={{transform:`scaleX(${p})`}}/><nav className="crumb"><Link to="/">Home</Link> / <Link to="/articles">Articles</Link></nav>
<h1>{a.title}</h1><div className="meta">{fmtDate(a.date)} · {readTime(a.html)} min read</div>
{a.image&&<Cover a={a} cls="hero-img"/>}
<div className="body" dangerouslySetInnerHTML={{__html:a.html}}/>
{a.faqs?.length>0&&<section><h2>Frequently Asked Questions</h2>{a.faqs.map((f,i)=><details key={i} className="faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>}
{a.note&&<div className="note"><b>Note:</b> {a.note}</div>}
{a.related&&rel.length>0&&<section className="relsec"><h2>Related Articles</h2><div className="grid">{rel.map(r=><Card key={r.slug} a={r}/>)}</div></section>}</article>}
