import {useState} from 'react';import {useNavigate,Navigate} from 'react-router-dom';import {isAuth} from './auth.jsx';import {apiLogin,hasGh} from '../lib/api';import {useSeo} from '../lib/seo';
export default function AdminLogin(){const [u,setU]=useState(''),[p,setP]=useState(''),[t,setT]=useState(''),[e,setE]=useState(''),[b,setB]=useState(false),nav=useNavigate();useSeo({title:'Admin Login',noindex:true,path:'/admin/login'});
if(isAuth())return <Navigate to="/admin" replace/>;
const go=async ev=>{ev.preventDefault();setB(true);setE('');try{await apiLogin(u,p,t);nav('/admin')}catch(x){setE(x.message);setB(false)}};
return <div className="adm alogin"><form className="apanel" onSubmit={go}><h1>🔐 Admin Login</h1><p className="amut">Articles manage karne ke liye sign in karo.</p>
<label>Username</label><input value={u} onChange={x=>setU(x.target.value)} autoFocus/><label>Password</label><input type="password" value={p} onChange={x=>setP(x.target.value)}/>
{!hasGh()&&<><label>GitHub Token (sirf pehli baar)</label><input type="password" value={t} onChange={x=>setT(x.target.value)} placeholder="github_pat_..."/></>}
{e&&<p className="aerr">{e}</p>}<button className="abtn" disabled={b} style={{marginTop:18,width:'100%'}}>{b?'Checking…':'Login'}</button></form></div>}
