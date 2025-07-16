import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();             // مسح البيانات
    navigate('/login');   // توجيه لصفحة الدخول
  }, [logout, navigate]);

  return null; // لا يعرض شيء على الشاشة
};

export default Logout;
