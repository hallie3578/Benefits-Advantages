const API='/api/api.php',TK='baa_token';
export const token=()=>{try{const t=localStorage.getItem(TK);return t&&+t.split('.')[0]*1000>Date.now()?t:null}catch(e){return null}};
export const clearToken=()=>{try{localStorage.removeItem(TK)}catch(e){}};
async function call(action,body,form){const h={},t=token();if(t)h['X-Token']=t;const o={method:'POST',headers:h};
if(body){if(form)o.body=body;else{h['Content-Type']='application/json';o.body=JSON.stringify(body)}}
let r,d;try{r=await fetch(`${API}?action=${action}`,o);d=await r.json()}catch(e){throw new Error('Server se jawab nahi mila. Kya PHP hosting par site chal rahi hai?')}
if(!r.ok)throw new Error(d.error||'Error');return d}
export const apiLogin=async(user,password)=>{const d=await call('login',{user,password});try{localStorage.setItem(TK,d.token)}catch(e){}};
export const apiList=()=>call('list');export const apiSave=a=>call('save',a);export const apiDelete=slug=>call('delete',{slug});
export const apiUpload=blob=>{const f=new FormData();f.append('file',blob,'image.jpg');return call('upload',f,true)};
