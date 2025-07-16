import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [organization, setOrganization] = useState(localStorage.getItem('organization') || '');
  const [companyId, setcompanyId] = useState(localStorage.getItem('companyId') || '');

  const login = async (usernameInput, passwordInput) => {
    try {
      const response = await fetch('http://localhost:5051/api/Users/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          loginName: usernameInput,
          loginPassword: passwordInput,
          userAgent: navigator.userAgent
        }),
      });

      if (!response.ok) throw new Error('فشل تسجيل الدخول');

      const data = await response.json();
      const userData = data.data?.[0];

      if (!userData?.accessToken) throw new Error('الرمز غير موجود');

      // تخزين في localStorage
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('username', userData.userName || usernameInput);
      localStorage.setItem('organization', userData.organization || 'جمعية البر');
      localStorage.setItem('companyId', userData.companyId || '');

      // تحديث الحالة
      setToken(userData.accessToken);
      setUsername(userData.userName || usernameInput);
      setOrganization(userData.organization || 'جمعية البر');
      setcompanyId(userData.companyId || '');

      return true;
    } catch (error) {
      console.error('فشل تسجيل الدخول:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('organization');
    localStorage.removeItem('companyId');

    setToken('');
    setUsername('');
    setOrganization('');
    setcompanyId('');
  };

  return (
    <AuthContext.Provider value={{ token, username, organization, companyId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
