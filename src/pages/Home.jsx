import {Link} from 'react-router-dom';import Card from '../components/Card';import {useArticles} from '../lib/store';
import {useSeo,faqLd} from '../lib/seo';import {SITE} from '../config';import {HOME_FAQ} from '../data/pages';
export default function Home(){const all=useArticles(),arts=(all||[]).filter(a=>a.pub).slice(0,6);
useSeo({path:'/',jsonLd:{'@context':'https://schema.org','@graph':[{'@type':'WebSite',name:SITE.name,url:SITE.url,description:SITE.description},{'@type':'Organization',name:SITE.name,url:SITE.url,logo:SITE.url+'/favicon.svg'},faqLd(HOME_FAQ)]}});
return <><section className="hero"><div className="wrap"><span className="pill">AI · Money · Online business</span>
<h1>Benefits &amp; Advantages: clear, honest answers on what really helps</h1>
<p>Benefits &amp; Advantages is an online publication that explains the real benefits, advantages and limits of modern tools, money decisions and online business in clear, plain language.</p>
<div className="row"><Link className="btn amber" to="/articles">Read the articles</Link><Link className="btn ghost" to="/about">About the site</Link></div></div></section>
<div className="mq"><div>{[0,1].map(k=><span key={k}>🤖 AI Agents ✦ 💰 Smart Money ✦ 🛒 Online Selling ✦ 📈 Business Growth ✦ 🧭 Better Decisions ✦ ✅ Practical Advice ✦ </span>)}</div></div>
<section className="wrap sec"><div className="sh"><h2>Latest articles</h2><Link to="/articles">View all →</Link></div><div className="grid">{!all&&[1,2,3].map(i=><div key={i} className="card sk"/>)}{arts.map(a=><Card key={a.slug} a={a}/>)}</div></section>
<section className="band"><div className="wrap trio">{[['⚖️','Honest trade-offs','Every advantage is explained together with its limits, so you can decide with confidence.'],['🧭','Practical examples','Real-life examples show how each benefit works for individuals, teams and small businesses.'],['⏱️','Five-minute reads','Numbered sections and short paragraphs make each article quick to scan and easy to remember.']].map(([i,t,d])=><div key={t} className="feat"><span>{i}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
<section className="wrap sec narrow"><h2>Frequently asked questions</h2>{HOME_FAQ.map(f=><details key={f.q} className="faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}</section></>}
