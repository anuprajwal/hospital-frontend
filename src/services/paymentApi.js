// src/services/paymentApi.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apis.docapp.co.in';

const getCookieToken = () => {
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const makeRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getCookieToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    let responseData = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    }

    if (!response.ok) {
      if (response.status === 401 || (responseData && responseData.error === 'jwt expired')) {
        document.cookie = 'auth_token=; path=/; domain=.docapp.co.in; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.reload();
      }
      const error = new Error(responseData?.message || `HTTP Exception: ${response.status}`);
      error.response = { data: responseData, status: response.status };
      throw error;
    }

    return { data: responseData, status: response.status };
  } catch (error) {
    if (!error.response) {
      error.message = `Network connectivity layer failure: ${error.message}`;
    }
    throw error;
  }
};

export const paymentService = {
  // Hospital KYC & Onboarding Endpoints
  startHospitalOnboarding: (hospitalId, payload) =>
    makeRequest(`/api/kyc/hospital/${hospitalId}/start-onboarding`, {
      method: 'POST',
      body: payload
    }),

  getHospitalOnboardingStatus: (hospitalId) =>
    makeRequest(`/api/kyc/hospital/${hospitalId}/onboarding-status`, {
      method: 'GET'
    }),

  // Patient Payment Order Endpoints
  createOrder: (payload) =>
    makeRequest('/api/payment/order', {
      method: 'POST',
      body: payload
    }),

  verifyPayment: (payload) =>
    makeRequest('/api/payment/verify', {
      method: 'POST',
      body: payload
    })
};