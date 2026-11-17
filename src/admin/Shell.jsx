import {Link,useNavigate} from 'react-router-dom';import {logout} from './auth.jsx';import {useSeo} from '../lib/seo';
export default function Shell({title,actions,children}){const nav=useNavigate();useSeo({title:'Admin',noindex:true,path:'/admin'});
return <div className="adm"><div className="atop"><div className="awrap arow"><b className="alogo">⚙ B&amp;A Admin</b><div className="arow"><Link className="abtn o" to="/" target="_blank">View site</Link><button className="abtn o" onClick={()=>{logout();nav('/admin/login')}}>Logout</button></div></div></div>
<div className="awrap"><div className="arow sp"><h1>{title}</h1><div className="arow">{actions}</div></div>{children}</div></div>}
