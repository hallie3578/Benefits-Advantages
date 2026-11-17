import {Navigate} from 'react-router-dom';import {token,clearToken} from '../lib/api';
export const logout=clearToken;export const isAuth=()=>!!token();
export const Guard=({children})=>isAuth()?children:<Navigate to="/admin/login" replace/>;
