const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("API_URL is not defined. Check .env file.");
}

const ENDPOINTS = {
  login: `${API_URL}/login`,
  invoices : `${API_URL}/invoices`,
  doctorInvoices: (doctorId) => `${API_URL}/invoices/doctors/${doctorId}`,
  accounts : `${API_URL}/accounts`,
  doctorAccounts: (doctorId) => `${API_URL}/accounts/doctors/${doctorId}`,
  profiles : `${API_URL}/profiles`,
  userData : `${API_URL}/users/data`,
  logout : `${API_URL}/logout`,
  records : `${API_URL}/records`,
};

export default ENDPOINTS;
