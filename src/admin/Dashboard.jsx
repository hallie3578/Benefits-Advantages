import {useState,useEffect} from 'react';import {Link,useNavigate,useLocation} from 'react-router-dom';import Shell from './Shell.jsx';import {logout} from './auth.jsx';import {apiList,apiSave,apiDelete} from '../lib/api';import {fmtDate} from '../lib/store';
export default function Dashboard(){const nav=useNavigate(),loc=useLocation(),[list,setList]=useState(null),[err,setErr]=useState(''),[q,setQ]=useState(''),[msg,setMsg]=useState(loc.state?.done||'');
const fail=e=>{if(/Session/.test(e.message)){logout();nav('/admin/login')}else setErr(e.message)};
const load=()=>apiList().then(setList).catch(fail);useEffect(()=>{load()},[]);
const toggle=async a=>{try{await apiSave({...a,pub:!a.pub});setMsg(a.pub?'Draft mein chala gaya':'Live ho gaya ✓');load()}catch(e){fail(e)}};
const del=async a=>{if(!confirm('Delete: '+a.title+' ?'))return;try{await apiDelete(a.slug);setMsg('Delete ho gaya');load()}catch(e){fail(e)}};
const f=(list||[]).filter(a=>a.title.toLowerCase().includes(q.toLowerCase()));
return <Shell title="Articles" actions={<Link className="abtn" to="/admin/new">+ New Article</Link>}>
{msg&&<div className="abanner">{msg}</div>}{err&&<div className="abanner er">{err}</div>}
{list&&<div className="astat"><div><b>{list.length}</b><span>Total</span></div><div><b>{list.filter(a=>a.pub).length}</b><span>Live</span></div><div><b>{list.filter(a=>!a.pub).length}</b><span>Drafts</span></div></div>}
<input className="asearch" placeholder="Search articles…" value={q} onChange={e=>setQ(e.target.value)}/>
{!list&&!err&&<p className="amut">Loading…</p>}
{f.map(a=><div key={a.slug} className="apanel arow sp">
<div className="arow" style={{gap:14}}>{a.image?<img className="athumb" src={a.image} alt=""/>:<div className="athumb ph">{a.title[0]}</div>}<div><b>{a.title}</b><div className="amut">{fmtDate(a.date)} <span className={'atag '+(a.pub?'':'dr')}>{a.pub?'Live':'Draft'}</span></div></div></div>
<div className="arow"><label className="sw" title="Live / Draft"><input type="checkbox" checked={!!a.pub} onChange={()=>toggle(a)}/><span/></label>
{a.pub&&<a className="abtn o s" href={'/articles/'+a.slug} target="_blank" rel="noreferrer">View</a>}<Link className="abtn o s" to={'/admin/edit/'+a.slug}>Edit</Link><button className="abtn d s" onClick={()=>del(a)}>Delete</button></div></div>)}
{list&&!f.length&&<p className="amut">Koi article nahi mila.</p>}</Shell>}
