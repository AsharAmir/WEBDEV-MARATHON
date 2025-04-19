export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  avatar?: string;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  rating: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
  categories: string[];
  duration: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  courseId: string;
  order: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  courseId: string;
  content: string;
  timestamp: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  sortBy?: string;
}

export const authAPI: {
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (name: string, email: string, password: string, role: 'student' | 'tutor') => Promise<AuthResponse>;
  logout: () => Promise<void>;
};

export const coursesAPI: {
  getAll: (filters?: CourseFilters) => Promise<Course[]>;
  getById: (id: string) => Promise<Course>;
  create: (courseData: Omit<Course, 'id'>) => Promise<Course>;
  update: (id: string, courseData: Partial<Course>) => Promise<Course>;
  delete: (id: string) => Promise<{ message: string }>;
  enroll: (courseId: string) => Promise<{ message: string }>;
  unenroll: (courseId: string) => Promise<{ message: string }>;
  getEnrolledCourses: () => Promise<Course[]>;
  getCreatedCourses: () => Promise<Course[]>;
};

export const chatAPI: {
  getMessages: (courseId: string) => Promise<ChatMessage[]>;
  sendMessage: (userId: string, courseId: string, content: string) => Promise<ChatMessage>;
  deleteMessage: (id: string) => Promise<{ message: string }>;
}; 