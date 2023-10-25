import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { MyUserContext } from '../context/UserContext';

export const PrivateRoutes = () => {
  let { user, setUser } = useContext(MyUserContext);
  const [errorMessage, setErrorMessage] = useState('')

  let access_token = localStorage.getItem('token');
  let auth = { token: access_token ? true : false };

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  if (auth.token) {
    useEffect(() => {
      axios
        .post(`${process.env.REACT_APP_BASE_API_URL}/user-details`, {}, config)
        .then((res) => {
          if (res.data.status !== 'failed') {
            setUser(res.data);
          } else {
            setErrorMessage(res.data.message);
          }
        });
    }, []);
  }

  return auth.token ? <Outlet /> : <Navigate to="/" />;
};
export default PrivateRoutes;
