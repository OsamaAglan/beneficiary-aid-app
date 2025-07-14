
import React from 'react';
import ReactDOM from 'react-dom/client';
import Beneficiaries from './pages/Beneficiaries';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider  } from './context/AuthProvider ';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AuthProvider>
  <Beneficiaries />
    </AuthProvider>

   
  </React.StrictMode>
);
