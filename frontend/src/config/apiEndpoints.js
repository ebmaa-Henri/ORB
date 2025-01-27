const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("API_URL is not defined. Check .env file.");
}

const ENDPOINTS = {
  login: `${API_URL}/login`,
  invoices : `${API_URL}/invoices`,
  clientInvoices: (clientId) => `${API_URL}/invoices/clients/${clientId}`,
  accounts : `${API_URL}/accounts`,
  clientAccounts: (clientId) => `${API_URL}/accounts/clients/${clientId}`,
  profiles : `${API_URL}/profiles`,
  userData : `${API_URL}/users/data`,
  logout : `${API_URL}/logout`,
  records : `${API_URL}/records`,
  clientInfo : `${API_URL}/client/info`,
};

export default ENDPOINTS;
