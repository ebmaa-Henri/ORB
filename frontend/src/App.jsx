import './App.css';
import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Logout } from './components/index'
import { UserContext } from './context/UserContext';
import { Login, Dashboard, ProtectedLayout, Tools, TimeSheet, Profiles, ProfileDetails, AccountDetails, InvoiceDetails, ClientAccounts, ClientInvoices, PersonRecords, PersonRecordDetails, ClientInfo, NewInvoice } from './pages/index';

function App() {
  const { user } = useContext(UserContext);


  return (

      <Routes>
        {/* If the user is logged in, redirect to dashboard; else, show login */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        {/* Secure routes, not really, as jwt check only runs if 'user'contact is set, */}
        <Route element={user ? <ProtectedLayout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools" element={<Tools />} />
          
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profiles/:profileId" element={<ProfileDetails />} />

          <Route path="/client/info" element={<ClientInfo />} />

          <Route path="/accounts" element={<ClientAccounts />} />
          <Route path="/accounts/:accountId" element={<AccountDetails />} />

          <Route path="/invoices" element={<ClientInvoices />} />
          {/* <Route path="/invoices/:invoiceId" element={<InvoiceDetails />} /> */}
          <Route path="/invoices/:invoiceId" element={<InvoiceDetails />} />
          <Route path="/invoices/new/:accountId" element={<InvoiceDetails />} />
          {/* <Route path="/invoices/new-invoice/:accountId" component={<InvoiceDetails />} /> */}
          
          {/* <Route path="/invoices/new/:accountId" element={<NewInvoice />} /> */}

          <Route path="/records" element={<PersonRecords />} />
          <Route path="/records/:recordId" element={<PersonRecordDetails />} />

          <Route path="/time" element={<TimeSheet />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* Catch-all route to redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

  );
}

export default App;
