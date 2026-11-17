import {useState,useEffect} from 'react';import {NavLink,Link,Outlet,useLocation} from 'react-router-dom';import {SITE} from '../config';
const main=[['/','Home'],['/articles','Articles'],['/about','About'],['/editorial-policy','Editorial Policy'],['/contact','Contact']];
const more=[['/privacy-policy','Privacy Policy'],['/terms','Terms of Use'],['/disclaimer','Disclaimer']];
export default function Layout(){const [open,setOpen]=useState(false),{pathname}=useLocation();
useEffect(()=>{setOpen(false);window.scrollTo(0,0)},[pathname]);
const L=([to,t])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'on':''}>{t}</NavLink>;
return <><header className="hd"><div className="wrap hrow"><Link to="/" className="logo">Benefits<b>&amp;</b>Advantages</Link>
<button className="burger" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</button>
<nav className={open?'open':''}>{main.map(L)}<details className="more"><summary>More ▾</summary><div>{more.map(L)}</div></details><div className="mobmore">{more.map(L)}</div></nav></div></header>
<main><Outlet/></main>
<footer className="ft"><div className="wrap fgrid"><div><Link to="/" className="logo">Benefits<b>&amp;</b>Advantages</Link><p>{SITE.description}</p></div>
<div><h4>Explore</h4>{main.map(L)}</div><div><h4>Legal</h4>{more.map(L)}</div></div><div className="copy">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div></footer></>}
