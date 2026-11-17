import {Link} from 'react-router-dom';import {fmtDate,readTime} from '../lib/store';
export const Cover=({a,cls=''})=>a.image?<img className={'cover '+cls} src={a.image} alt={a.imageAlt||a.title} loading="lazy"/>:<div className={'cover ph '+cls}>{a.title[0]}</div>;
export default function Card({a}){return <Link to={'/articles/'+a.slug} className="card"><Cover a={a}/><div className="cb"><span className="meta">{fmtDate(a.date)} · {readTime(a.html)} min read</span><h3>{a.title}</h3><p>{a.excerpt}</p><span className="more">Read article →</span></div></Link>}
