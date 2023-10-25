import AuthLogin from 'pages/authentication/auth-forms/AuthLogin';
import { Navigate } from 'react-router';

const RedirectToHome = () => {
  if (localStorage.getItem('token')) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <AuthLogin />;
  }
};

export default RedirectToHome;
