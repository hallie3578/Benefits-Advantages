import {Link} from 'react-router-dom';import {useSeo} from '../lib/seo';
export default function NotFound(){useSeo({title:'Page not found',noindex:true});return <div className="wrap doc" style={{textAlign:'center',padding:'90px 20px'}}><h1>Page not found</h1><p>The page you are looking for does not exist.</p><Link className="btn" to="/articles">Browse articles</Link></div>}
