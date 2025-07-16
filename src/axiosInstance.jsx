// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.59:5051/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ اختبر أين تم التخزين (تلقائي حسب "تذكرني")
    const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;

    const token = storage.getItem('accessToken');
    const companyId = storage.getItem('companyId');

    // ✅ أضف التوكن في الهيدر
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // ✅ أضف كود الشركة أيضًا
    if (companyId) {
      config.headers['companyId'] = companyId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
