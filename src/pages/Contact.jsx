import {useState} from 'react';import {useSeo} from '../lib/seo';import {SITE} from '../config';
export default function Contact(){const [f,setF]=useState({name:'',email:'',topic:'Suggest a topic',msg:''});
useSeo({title:'Contact',path:'/contact',description:'Contact Benefits & Advantages to suggest a topic, report a mistake or ask a question.'});
const s=k=>e=>setF({...f,[k]:e.target.value});
const send=e=>{e.preventDefault();location.href=`mailto:${SITE.email}?subject=${encodeURIComponent(f.topic+' – '+f.name)}&body=${encodeURIComponent(f.msg+'\n\nFrom: '+f.name+' ('+f.email+')')}`};
return <><section className="pagehead"><div className="wrap"><h1>Contact Us</h1><p>Have a topic idea, a question or a correction? We would like to hear from you.</p></div></section>
<div className="wrap cgrid"><div className="doc"><h2>How can I contact Benefits & Advantages?</h2><p>Fill in the form, or email us directly at <a href={'mailto:'+SITE.email}>{SITE.email}</a>.</p>
<h2>Can I suggest an article topic?</h2><p>Yes. Tell us the topic or question you would like explained and why it matters to you.</p>
<h2>How do I report a mistake?</h2><p>Choose “Report a correction”, include the article title and the sentence in question, and we will review it. See our Editorial Policy for how corrections are handled.</p></div>
<form className="panel" onSubmit={send}><label>Name</label><input required value={f.name} onChange={s('name')}/><label>Email</label><input required type="email" value={f.email} onChange={s('email')}/>
<label>Topic</label><select value={f.topic} onChange={s('topic')}><option>Suggest a topic</option><option>Report a correction</option><option>General question</option></select>
<label>Message</label><textarea required rows="5" value={f.msg} onChange={s('msg')}/><button className="btn" style={{marginTop:16}}>Send message</button></form></div></>}
