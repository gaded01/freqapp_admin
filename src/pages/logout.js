import React, {useState, useEffect, useRef} from 'react';
import { Navigate, useNavigate } from 'react-router';


function logout() {
   const navigate = useNavigate();
   useEffect(()=> {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
   },[])
   
   return (
      <div>logout</div>
   )
}

export default logout