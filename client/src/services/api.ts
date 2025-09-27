import axios from 'axios'

// Create a custom Axios instance
const api = axios.create({
  baseURL: 'https://expense-tracker-0b3c.onrender.com/api/v1/',
  // baseURL: 'http://localhost:5000/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    // STEP: check if error is 401 and retry hasn't been attempted yet
    if (error.response && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // STEP: Attempt to refresh the token and save the token to localStorage if it exist
      try {
        const response = await api.get('/auth/refresh-token', { withCredentials: true })
        const token = response.data.data.accessToken
        localStorage.setItem('token', token)
        originalRequest.headers['Authorization'] = 'Bearer ' + token
        return api(originalRequest)
      } catch (error) {
        // STEP: If refresh fails, clear token and redirect to login
        console.error('Token refresh failed:', error)
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
