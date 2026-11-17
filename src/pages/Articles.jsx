import {useState} from 'react';import Card from '../components/Card';import {useArticles} from '../lib/store';import {useSeo} from '../lib/seo';
export default function Articles(){const list=useArticles(),all=(list||[]).filter(a=>a.pub),[q,setQ]=useState('');
useSeo({title:'Articles',path:'/articles',description:'Browse all Benefits & Advantages articles on AI, money and online business, each explained in plain language.'});
const f=all.filter(a=>(a.title+a.excerpt).toLowerCase().includes(q.toLowerCase()));
return <><section className="pagehead"><div className="wrap"><h1>All Articles</h1><p>Practical benefits and advantages of AI, money tools and online business, explained in plain language.</p><input className="search" placeholder="Search articles…" value={q} onChange={e=>setQ(e.target.value)}/></div></section>
<div className="wrap"><div className="grid">{!list&&[1,2,3].map(i=><div key={i} className="card sk"/>)}{f.map(a=><Card key={a.slug} a={a}/>)}</div>{list&&!f.length&&<p className="mut" style={{padding:'30px 0'}}>No articles found.</p>}</div></>}
