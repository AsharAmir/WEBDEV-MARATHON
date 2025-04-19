// // Type definitions for the EdTech platform

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'student' | 'tutor';
//   avatar?: string;
//   bio?: string;
// }

// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   tutorId: string;
//   tutorName: string;
//   tutorAvatar?: string;
//   price: number;
//   rating: number;
//   totalStudents: number;
//   lessons: Lesson[];
//   categories: string[];
//   level: 'beginner' | 'intermediate' | 'advanced';
//   duration: string; // e.g., "4h 30m"
// }

// export interface Lesson {
//   id: string;
//   title: string;
//   description: string;
//   videoUrl: string;
//   duration: string; // e.g., "10:30"
//   transcript?: string;
// }

// export interface ChatMessage {
//   id: string;
//   userId: string;
//   userName: string;
//   userAvatar?: string;
//   courseId: string;
//   content: string;
//   timestamp: Date;
// }

// Type definitions for the EdTech platform

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
  videoUrl?: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  rating: number;
  totalStudents: number;
  createdAt?: string;
  updatedAt?: string;
  lessons: Lesson[];
  categories?: string[];
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration?: string;
  order: number;
  status: 'processing' | 'completed' | 'failed';
  transcription?: string;
  summary?: string;
  notes?: string;
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