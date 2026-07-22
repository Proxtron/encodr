import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const ProtectedRoute = ({ children } : React.PropsWithChildren) => {
  const token = Cookies.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) navigate("/");
  }, [token, navigate]);
 

  return children;
};

export default ProtectedRoute;