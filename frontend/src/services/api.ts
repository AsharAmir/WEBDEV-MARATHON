import { Course, CourseFilters, Lesson } from '../types';
import { uploadMedia } from '../components/Uploadtosupabase/uploadmedia';

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
  
  // Initialize headers
  const headers = new Headers(options.headers);
  
  // Add authorization if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Only add Content-Type for JSON requests
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  console.log(`Making ${options.method || 'GET'} request to ${endpoint}`, {
    headers: Object.fromEntries(headers.entries()),
    body: options.body instanceof FormData 
      ? 'FormData object' 
      : options.body ? JSON.parse(options.body as string) : undefined
  });

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error Response:', error);
      throw new Error(error.message || 'Something went wrong');
    }

    const data = await response.json();
    console.log(`Response from ${endpoint}:`, data);
    return data;
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

  addLesson: async (courseId: string, lessonData: { 
    title: string;
    description: string;
    duration: string;
    videoUrl: string;
    videoFileName?: string;
  }): Promise<Course> => {
    console.log('Adding lesson:', { courseId, lessonData });
    
    const payload = {
      title: lessonData.title,
      description: lessonData.description,
      duration: lessonData.duration,
      videoUrl: lessonData.videoUrl,
      fileName: lessonData.videoFileName
    };

    console.log('Sending to backend:', payload);
    
    // The response will now be the updated course with populated lessons
    const updatedCourse = await request<Course>(`/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    console.log('Updated course with new lesson:', updatedCourse);
    return updatedCourse;
  },

  updateLesson: (courseId: string, lessonId: string, lessonData: any) =>
    request(`/courses/${courseId}/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    }),

  deleteLesson: (courseId: string, lessonId: string) =>
    request(`/courses/${courseId}/lessons/${lessonId}`, {
      method: 'DELETE',
    }),

  getLessonStatus: (courseId: string, lessonId: string) =>
    request(`/courses/${courseId}/lessons/${lessonId}/status`),
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