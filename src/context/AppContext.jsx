import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');

  const login = async (usernameInput, passwordInput) => {
    try {

   
      const response = await fetch('http://localhost:5051/api/Dashboard/IncompleteDocs', {
        method: 'GET',
       // headers: { 'Content-Type': 'application/json' },
       // body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      if (!response.ok) throw new Error('فشل تسجيل الدخول');

      const data = await response.json();
      localStorage.setItem('accessToken', data.token);
      setToken(data.token);
      setUsername(data.username || usernameInput);
      setOrganization(data.organization || 'جمعية البر');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
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
