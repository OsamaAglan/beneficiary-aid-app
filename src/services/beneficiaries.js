
import axios from 'axios';

const API_URL = 'https://your-api-endpoint.com/api';

export const getBeneficiaries = () => {
  // Replace with actual API endpoint
  return axios.get(`${API_URL}/Beneficiaries`);
};
