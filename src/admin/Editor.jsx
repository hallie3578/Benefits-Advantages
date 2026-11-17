import {useState,useRef,useEffect} from 'react';import {useNavigate,useParams} from 'react-router-dom';import Shell from './Shell.jsx';import {logout} from './auth.jsx';
import {apiList,apiSave,apiUpload} from '../lib/api';import {slugify} from '../lib/store';
const shrink=f=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>{const i=new Image();i.onload=()=>{const s=Math.min(1,1400/i.width),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);c.toBlob(r,'image/jpeg',.85)};i.src=fr.result};fr.readAsDataURL(f)});
const blank=()=>({slug:'',title:'',date:new Date().toISOString().slice(0,10),excerpt:'',image:'',imageAlt:'',html:'',faqs:[],note:'',related:true,pub:true});
export default function Editor(){const {slug}=useParams(),nav=useNavigate(),[init,setInit]=useState(slug?null:blank()),[err,setErr]=useState('');
useEffect(()=>{if(slug)apiList().then(l=>{const a=l.find(x=>x.slug===slug);a?setInit(a):setErr('Article nahi mila')}).catch(e=>{if(/Session/.test(e.message)){logout();nav('/admin/login')}else setErr(e.message)})},[slug]);
if(!init)return <Shell title="Edit Article"><p className="amut">{err||'Loading…'}</p></Shell>;
return <Form init={init} isNew={!slug}/>}
function Form({init,isNew}){const nav=useNavigate(),[a,setA]=useState(init),[busy,setBusy]=useState(''),ed=useRef(),fi=useRef(),fe=useRef(),sel=useRef();
useEffect(()=>{ed.current.innerHTML=a.html},[]);
const set=(k,v)=>setA(s=>({...s,[k]:v})),cmd=(c,v)=>{ed.current.focus();document.execCommand(c,false,v)};
const keep=()=>{const s=getSelection();sel.current=s.rangeCount?s.getRangeAt(0):null};
const restore=()=>{ed.current.focus();if(sel.current){const s=getSelection();s.removeAllRanges();s.addRange(sel.current)}};
const up=async f=>{setBusy('Image upload ho rahi hai…');try{return (await apiUpload(await shrink(f))).url}catch(e){alert(e.message)}finally{setBusy('')}};
const img=async f=>{if(!f)return;const u=await up(f);if(u){restore();cmd('insertImage',u)}};
const B=(l,c,v)=><button type="button" key={l} onMouseDown={e=>{e.preventDefault();cmd(c,v)}}>{l}</button>;
const link=()=>{keep();const u=prompt('Link URL (https://...)');if(u){restore();cmd('createLink',u)}};
const imgBtn=()=>{keep();const u=prompt('Image URL paste karo, ya khali chhod kar device se upload karo');if(u){restore();cmd('insertImage',u)}else fi.current.click()};
const faq=(i,k,v)=>set('faqs',a.faqs.map((f,j)=>j===i?{...f,[k]:v}:f));
const save=async()=>{if(!a.title.trim())return alert('Title zaroori hai');setBusy('Publish ho raha hai…');
const html=ed.current.innerHTML,plain=html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
try{await apiSave({...a,isNew,slug:a.slug||slugify(a.title),html,excerpt:a.excerpt.trim()||plain.slice(0,160)+(plain.length>160?'…':''),imageAlt:a.imageAlt||a.title,faqs:a.faqs.filter(f=>f.q.trim()&&f.a.trim())});
nav('/admin',{state:{done:a.pub?'Article live ho gaya ✓ (cache ki wajah se 1 min lag sakta hai)':'Draft save ho gaya ✓'}})}catch(e){alert(e.message);setBusy('')}};
return <Shell title={isNew?'New Article':'Edit Article'} actions={<><button className="abtn o" disabled={!!busy} onClick={()=>nav('/admin')}>Cancel</button><button className="abtn" disabled={!!busy} onClick={save}>{busy||(a.pub?'Publish':'Save Draft')}</button></>}>
<div className="apanel"><label>Title</label><input value={a.title} onChange={e=>set('title',e.target.value)} placeholder="Article title"/>
<label>Feature image</label><div className="arow"><input style={{flex:1}} value={a.image} onChange={e=>set('image',e.target.value)} placeholder="Image URL paste karo ya Upload dabao"/><button type="button" className="abtn o s" onClick={()=>fe.current.click()}>Upload</button>{a.image&&<button type="button" className="abtn d s" onClick={()=>set('image','')}>Remove</button>}</div>
<input ref={fe} type="file" accept="image/*" hidden onChange={async e=>{const u=e.target.files[0]&&await up(e.target.files[0]);u&&set('image',u)}}/>{a.image&&<img className="aprev" src={a.image} alt=""/>}
<label>Short summary (SEO, optional)</label><textarea rows="2" value={a.excerpt} onChange={e=>set('excerpt',e.target.value)} placeholder="Khali chhodo to article ke shuru se ban jayega"/></div>
<div className="apanel"><label>Content</label><div className="atb">{B('B','bold')}{B('I','italic')}{B('H2','formatBlock','H2')}{B('H3','formatBlock','H3')}{B('¶','formatBlock','P')}{B('• List','insertUnorderedList')}{B('1. List','insertOrderedList')}
<button type="button" onMouseDown={e=>{e.preventDefault();link()}}>🔗 Link</button><button type="button" onMouseDown={e=>{e.preventDefault();imgBtn()}}>🖼 Image</button>{B('Unlink','unlink')}</div>
<div ref={ed} className="aed body" contentEditable suppressContentEditableWarning onBlur={keep} onPaste={e=>{const f=[...e.clipboardData.files].find(x=>x.type.startsWith('image'));if(f){e.preventDefault();keep();img(f)}}}/>
<input ref={fi} type="file" accept="image/*" hidden onChange={e=>{img(e.target.files[0]);e.target.value=''}}/></div>
<div className="apanel"><div className="arow sp"><b>FAQs</b><button type="button" className="abtn o s" onClick={()=>set('faqs',[...a.faqs,{q:'',a:''}])}>+ Add FAQ</button></div>
{a.faqs.map((f,i)=><div key={i} style={{marginTop:12}}><input placeholder="Question" value={f.q} onChange={e=>faq(i,'q',e.target.value)}/><textarea rows="2" style={{marginTop:6}} placeholder="Answer" value={f.a} onChange={e=>faq(i,'a',e.target.value)}/><button type="button" className="abtn d s" onClick={()=>set('faqs',a.faqs.filter((_,j)=>j!==i))}>Remove</button></div>)}</div>
<div className="apanel"><label>Note (optional)</label><textarea rows="2" value={a.note} onChange={e=>set('note',e.target.value)} placeholder="Source ya extra jaankari"/>
<div className="arow sp" style={{marginTop:18}}><span>Related articles dikhao</span><label className="sw"><input type="checkbox" checked={a.related} onChange={e=>set('related',e.target.checked)}/><span/></label></div>
<div className="arow sp" style={{marginTop:12}}><span>Live (off = Draft)</span><label className="sw"><input type="checkbox" checked={a.pub} onChange={e=>set('pub',e.target.checked)}/><span/></label></div></div></Shell>}
