const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apis.docapp.co.in';


const makeRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    // CRITICAL: Automatically sends the HttpOnly cookie with cross-subdomain requests
    credentials: 'include', 
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
      if (
        response.status === 401 || 
        response.status === 403 || 
        (responseData && responseData.error === 'jwt expired')
      ) {
        
        window.location.href = 'https://auth.docapp.co.in';
        return;
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

export const hospitalEndpoints = {
  // Profile Meta Data
  getProfile: () => makeRequest('/api/auth/get-user-data', { method: 'GET' }),
  updateProfile: (data) => makeRequest('/api/auth/profile/complete/hospital_organisation', { method: 'PUT', body: data }),
  changePassword: (newPassword) => makeRequest('/api/auth/change-password', { method: 'PUT', body: { newPassword } }),
  
  // Address Ledger CRUDS
  getAddress: () => makeRequest('/api/address/getAllAddress', { method: 'GET' }),
  addAddress: (address) => makeRequest('/api/address/addAddress', { method: 'POST', body: address }),
  updateAddress: (address) => makeRequest('/api/address/updateAddress', { method: 'PUT', body: address }),
  deleteAddress: (addressId) => makeRequest('/api/address/deleteAddress', { method: 'DELETE', body: { addressId } }),
  
  // Bank Infrastructure
  getBankDetails: () => makeRequest('/api/auth/get/bank-details', { method: 'GET' }),
  uploadBankDetails: (bankData) => makeRequest('/api/auth/upload/bank-details', { method: 'POST', body: bankData }),
  
  // Verification Pipeline
  sendEmailOtp: () => makeRequest('/api/verify/sendEmailOtp', { method: 'POST' }),
  sendMobileOtp: () => makeRequest('/api/verify/sendMobileOtp', { method: 'POST' }),
  verifyOtp: (payload) => makeRequest('/api/verify/verifyEmailMobile', { method: 'PUT', body: payload }),

  // Staff Sub-System Directory
  getStaff: (hospitalId) => makeRequest(`/api/filter/get-hospital-doctors/${hospitalId}`, { method: 'GET' }),

  // Dynamic Staff/Doctor Registry Fetching
  getDoctors: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.verified !== undefined && params.verified !== '') query.append('verified', params.verified);
    if (params.request_status) query.append('request_status', params.request_status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    return makeRequest(`/api/hospital/get-doctors${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // Admission Action Endpoint (Accept / Reject)
  reactToAdmission: (payload) => makeRequest('/api/hospital/react-to-admission', { method: 'PUT', body: payload }),

  getAppointments: (limit = 10, offset = 0) => {
    return makeRequest(`/api/appointment/list-appointments?limit=${limit}&offset=${offset}`, { method: 'GET' });
  },
  setDoctorsSlotConfig: (payload) => makeRequest('/api/hospital/set-doctors-slot-config', { method: 'PUT', body: payload }),

  getDoctorSlotConfig: () => makeRequest('/api/hospital/get-doctors-slot-config', { method: 'GET'})

};