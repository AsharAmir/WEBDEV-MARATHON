export interface Course {
  _id: string;  // MongoDB uses _id
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  tutorTitle?: string;
  tutorBio?: string;
  totalStudents: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;  // Course thumbnail image URL
  duration?: string;   // Course duration (e.g., "2 hours")
  content?: string;    // Course content/curriculum
  requirements?: string[]; // Course requirements
  learningObjectives?: string[];   // Learning objectives
  targetAudience?: string[]; // Target audience
  lessons?: Lesson[]; // Course lessons
  modules?: Module[]; // Course modules
}

export interface Lesson {
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  order: number;
}

export interface Module {
  title: string;
  description?: string;
  lessons?: Lesson[];
  order: number;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  sortBy?: 'popular' | 'rating' | 'newest' | 'price-low' | 'price-high';
} 