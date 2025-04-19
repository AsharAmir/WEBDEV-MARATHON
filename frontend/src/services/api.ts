import { Course, CourseFilters } from '../types/course';

const API_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

interface ApiCourseResponse extends Course {}

export interface Enrollment {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    thumbnail: string;
    tutorName: string;
  };
  progress: number;
  enrolledAt: string;
}

// Helper function to handle API requests
const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
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
  login: (email: string, password: string) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (name: string, email: string, password: string, role: string) =>
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
  
  getById: (id: string) => request(`/courses/${id}`),
  
  getTutorCourses: (tutorId: string) => 
    request(`/courses/tutor/${tutorId}`),
  
  create: (courseData: any) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
  
  update: (id: string, courseData: any) =>
    request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
  
  delete: (id: string) =>
    request(`/courses/${id}`, {
      method: 'DELETE',
    }),
};

// Enrollments API
export const enrollmentsAPI = {
  getMyEnrollments: () => request('/enrollments/my-enrollments'),

  createPaymentIntent: (courseId: string) =>
    request('/enrollments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),

  completeEnrollment: (courseId: string, paymentIntentId: string) =>
    request('/enrollments/complete-enrollment', {
      method: 'POST',
      body: JSON.stringify({ courseId, paymentIntentId }),
    }),

  getEnrollmentStatus: (courseId: string) =>
    request(`/enrollments/status/${courseId}`),
}; 