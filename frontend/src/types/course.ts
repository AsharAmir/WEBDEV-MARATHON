export interface Course {
  _id: string;  // MongoDB uses _id
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  tutorId: {
    _id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  tutorName: string;
  tutorAvatar: string;
  tutorTitle?: string;
  tutorBio?: string;
  totalStudents: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  duration: string;
  content?: string;    // Course content/curriculum
  requirements?: string[]; // Course requirements
  objectives?: string[];   // Course objectives
  learningObjectives?: string[];   // Learning objectives
  targetAudience?: string[]; // Target audience
  lessons: Lesson[];
  modules?: Module[]; // Course modules
  __v: number;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  status?: 'processing' | 'failed' | 'completed';
  transcription?: string;
  summary?: string;
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