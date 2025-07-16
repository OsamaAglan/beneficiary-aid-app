import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');
  const [companyId, setCompanyId] = useState('');

  // 🔄 تحميل البيانات عند التهيئة من localStorage أو sessionStorage
  useEffect(() => {
    const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;

    setToken(storage.getItem('accessToken') || '');
    setUsername(storage.getItem('username') || '');
    setOrganization(storage.getItem('organization') || '');
    setCompanyId(storage.getItem('companyId') || '');
  }, []);

  const login = async (usernameInput, passwordInput, companyIdInput, rememberMe) => {
    try {
      const response = await fetch('http://192.168.1.59:5051/api/Users/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          loginName: usernameInput,
          loginPassword: passwordInput,
          companyId: companyIdInput,
          userAgent: navigator.userAgent
        }),
      });

      if (!response.ok) throw new Error('فشل تسجيل الدخول');

      const data = await response.json();
      const userData = data.data?.[0];

      if (!userData?.accessToken) throw new Error('الرمز غير موجود في الاستجابة');

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem('accessToken', userData.accessToken);
      storage.setItem('username', userData.userName || usernameInput);
      storage.setItem('organization', userData.organization || 'جمعية البر');
      storage.setItem('companyId', companyIdInput);

      // تحديث الحالة في الذاكرة
      setToken(userData.accessToken);
      setUsername(userData.userName || usernameInput);
      setOrganization(userData.organization || 'جمعية البر');
      setCompanyId(companyIdInput);

      return true;
    } catch (error) {
      console.error('خطأ أثناء تسجيل الدخول:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();

    setToken('');
    setUsername('');
    setOrganization('');
    setCompanyId('');
  };

  return (
    <AuthContext.Provider value={{ token, username, organization, companyId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
