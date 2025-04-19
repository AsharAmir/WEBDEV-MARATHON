export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  avatar?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
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
  content: string;
  userId: string;
  courseId: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  sortBy?: 'popular' | 'rating' | 'newest' | 'price-low' | 'price-high';
} 