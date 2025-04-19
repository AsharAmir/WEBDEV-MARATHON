const API_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (name, email, password, role) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Courses API
export const coursesAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return request(`/courses?${queryParams}`);
  },
  
  getById: (id) => request(`/courses/${id}`),
  
  create: (courseData) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
  
  update: (id, courseData) =>
    request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
  
  delete: (id) =>
    request(`/courses/${id}`, {
      method: 'DELETE',
    }),

  enroll: (courseId) =>
    request(`/courses/${courseId}/enroll`, {
      method: 'POST',
    }),

  unenroll: (courseId) =>
    request(`/courses/${courseId}/unenroll`, {
      method: 'POST',
    }),

  getEnrolledCourses: () => request('/courses/enrolled'),

  getCreatedCourses: () => request('/courses/created'),
};

// Chat API
export const chatAPI = {
  getMessages: (courseId) => request(`/chat/course/${courseId}`),
  
  sendMessage: (userId, courseId, content) =>
    request('/chat', {
      method: 'POST',
      body: JSON.stringify({ userId, courseId, content }),
    }),
  
  deleteMessage: (id) =>
    request(`/chat/${id}`, {
      method: 'DELETE',
    }),
}; 