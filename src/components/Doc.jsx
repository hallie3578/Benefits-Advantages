import {useSeo} from '../lib/seo';import {Link} from 'react-router-dom';
export default function Doc({page}){
useSeo({title:page.title,description:page.desc,path:page.path,jsonLd:{'@context':'https://schema.org','@type':'WebPage',name:page.title,description:page.desc}});
return <><section className="pagehead"><div className="wrap"><h1>{page.title}</h1><p>{page.intro}</p></div></section>
<div className="wrap doc">{page.sections.map(s=><section key={s.h}><h2>{s.h}</h2>{s.p.map((t,i)=><p key={i}>{t}</p>)}</section>)}
<p className="mut">Questions? <Link to="/contact">Contact us</Link>.</p></div></>}
