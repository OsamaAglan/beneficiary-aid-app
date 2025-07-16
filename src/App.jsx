// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Layout from './Layout';
import Assistances from './pages/Assistances';
import AssistanceTypes from './pages/AssistanceTypes';
import Cases from './pages/Beneficiaries';
import BeneficiaryTypes from './pages/BeneficiaryTypes';
import BeneficiaryGroups  from './pages/BeneficiaryGroups';
import DocumentsPage from './pages/DocumentsPage';
import DocumentTypes from './pages/DocumentTypes';
import RequiredDocuments from './pages/RequiredDocuments';
import Dashboard from './pages/Dashboard';
import AssistanceForm from './pages/AssistanceForm';
import BulkAssistances from './components/BulkAssistanceEntry';
import PrivateRoute from './components/PrivateRoute';
import AddBeneficiaryPage from './pages/AddBeneficiaryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/Dashboard" replace />} />
          
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Beneficiaries" element={<Cases />} />
          <Route path="/beneficiaries/new-case" element={<AddBeneficiaryPage mode="new-case" />} />
          <Route path="/beneficiaries/edit-case/:id" element={<AddBeneficiaryPage mode="edit-case" />} />
<Route path="/BeneficiaryGroups" element={<BeneficiaryGroups />} />

          <Route path="/Assistances" element={<Assistances />} />
          <Route path="/assistances/new" element={<AssistanceForm />} />
          <Route path="/assistances/edit/:id" element={<AssistanceForm />} />
          <Route path="/assistances/bulk" element={<BulkAssistances />} />

          <Route path="/AssistanceTypes" element={<AssistanceTypes />} />
          <Route path="/BeneficiaryTypes" element={<BeneficiaryTypes />} />
          <Route path="/DocumentTypes" element={<DocumentTypes />} />
          <Route path="/RequiredDocuments" element={<RequiredDocuments />} />
          <Route path="/DocumentsPage" element={<DocumentsPage />} />
          <Route path="/logout" element={<Logout />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
