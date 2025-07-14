import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [organization, setOrganization] = useState(localStorage.getItem('organization') || '');

  const login = async (usernameInput, passwordInput) => {
    try {
      const response = await fetch('http://192.168.1.59:5051/api/Users/Login', {
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

      if (!userData?.accessToken) throw new Error('الرمز غير موجود في الاستجابة');

      // حفظ البيانات في localStorage
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('username', userData.userName || usernameInput);
      localStorage.setItem('organization', userData.organization || 'جمعية البر');

      // تحديث state
      setToken(userData.accessToken);
      setUsername(userData.userName || usernameInput);
      setOrganization(userData.organization || 'جمعية البر');

      return true;
    } catch (error) {
      console.error('خطأ أثناء تسجيل الدخول:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('organization');
    setToken('');
    setUsername('');
    setOrganization('');
  };

  return (
    <AuthContext.Provider value={{ token, username, organization, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
