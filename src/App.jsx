import {Routes,Route} from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';import Articles from './pages/Articles.jsx';import Article from './pages/Article.jsx';
import About from './pages/About.jsx';import EditorialPolicy from './pages/EditorialPolicy.jsx';import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';import Terms from './pages/Terms.jsx';import Disclaimer from './pages/Disclaimer.jsx';import NotFound from './pages/NotFound.jsx';
import AdminLogin from './admin/AdminLogin.jsx';import Dashboard from './admin/Dashboard.jsx';import Editor from './admin/Editor.jsx';import {Guard} from './admin/auth.jsx';
export default function App(){return <Routes>
<Route element={<Layout/>}>
<Route path="/" element={<Home/>}/><Route path="/articles" element={<Articles/>}/><Route path="/articles/:slug" element={<Article/>}/>
<Route path="/about" element={<About/>}/><Route path="/editorial-policy" element={<EditorialPolicy/>}/><Route path="/contact" element={<Contact/>}/>
<Route path="/privacy-policy" element={<Privacy/>}/><Route path="/terms" element={<Terms/>}/><Route path="/disclaimer" element={<Disclaimer/>}/><Route path="*" element={<NotFound/>}/>
</Route>
{/* Admin: alag section, site header/footer nahi */}
<Route path="/admin/login" element={<AdminLogin/>}/>
<Route path="/admin" element={<Guard><Dashboard/></Guard>}/>
<Route path="/admin/new" element={<Guard><Editor/></Guard>}/>
<Route path="/admin/edit/:slug" element={<Guard><Editor/></Guard>}/>
</Routes>}
