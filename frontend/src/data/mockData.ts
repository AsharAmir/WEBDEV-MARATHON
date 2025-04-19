import { Course, User, ChatMessage } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Professor Chad',
    email: 'chad@learning.com',
    role: 'tutor',
    avatar: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Passionate educator with 10+ years of experience in computer science and AI.',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@student.com',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    email: 'emily@learning.com',
    role: 'tutor',
    avatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Expert in data science and machine learning with a Ph.D. from MIT.',
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Artificial Intelligence',
    description: 'Learn the fundamentals of AI, from basic concepts to advanced applications. This course covers machine learning, neural networks, and practical AI implementation.',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    tutorId: '1',
    tutorName: 'Professor Chad',
    tutorAvatar: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=150',
    price: 49.99,
    rating: 4.8,
    totalStudents: 1245,
    lessons: [
      {
        id: '1-1',
        title: 'What is Artificial Intelligence?',
        description: 'An introduction to the field of AI and its history.',
        videoUrl: 'https://example.com/video1.mp4',
        duration: '15:30',
        transcript: 'Welcome to our first lesson on Artificial Intelligence. In this video, we\'ll explore what AI is and how it has evolved over the decades...'
      },
      {
        id: '1-2',
        title: 'Machine Learning Basics',
        description: 'Understanding the core concepts of machine learning.',
        videoUrl: 'https://example.com/video2.mp4',
        duration: '22:45',
        transcript: 'Machine learning is a subset of AI that focuses on algorithms that can learn from data...'
      }
    ],
    categories: ['Computer Science', 'AI', 'Machine Learning'],
    level: 'beginner',
    duration: '6h 30m'
  },
  {
    id: '2',
    title: 'Advanced Data Science with Python',
    description: 'Master data analysis, visualization, and machine learning using Python and popular libraries like pandas, NumPy, and sklearn.',
    thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
    tutorId: '3',
    tutorName: 'Dr. Emily Chen',
    tutorAvatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150',
    price: 79.99,
    rating: 4.9,
    totalStudents: 832,
    lessons: [
      {
        id: '2-1',
        title: 'Python for Data Science',
        description: 'Essential Python skills for data scientists.',
        videoUrl: 'https://example.com/video3.mp4',
        duration: '28:15',
        transcript: 'In this lesson, we\'ll cover the Python fundamentals you need for data science work...'
      },
      {
        id: '2-2',
        title: 'Data Cleaning and Preparation',
        description: 'Learn how to clean and prepare data for analysis.',
        videoUrl: 'https://example.com/video4.mp4',
        duration: '32:20',
        transcript: 'Data cleaning is often the most time-consuming part of any data science project...'
      }
    ],
    categories: ['Data Science', 'Python', 'Programming'],
    level: 'intermediate',
    duration: '8h 45m'
  },
  {
    id: '3',
    title: 'Web Development Bootcamp',
    description: 'Comprehensive course covering HTML, CSS, JavaScript, and modern frameworks to build responsive websites and web applications.',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600',
    tutorId: '1',
    tutorName: 'Professor Chad',
    tutorAvatar: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=150',
    price: 59.99,
    rating: 4.7,
    totalStudents: 2103,
    lessons: [
      {
        id: '3-1',
        title: 'HTML and CSS Fundamentals',
        description: 'Building blocks of the web.',
        videoUrl: 'https://example.com/video5.mp4',
        duration: '45:10',
        transcript: 'HTML and CSS form the foundation of all websites. In this lesson...'
      },
      {
        id: '3-2',
        title: 'JavaScript Basics',
        description: 'Introduction to JavaScript programming.',
        videoUrl: 'https://example.com/video6.mp4',
        duration: '38:25',
        transcript: 'JavaScript is the programming language of the web. Let\'s explore its core concepts...'
      }
    ],
    categories: ['Web Development', 'Programming', 'HTML/CSS', 'JavaScript'],
    level: 'beginner',
    duration: '12h 20m'
  },
  {
    id: '4',
    title: 'Digital Marketing Essentials',
    description: 'Learn strategic marketing in the digital age, covering SEO, social media, email marketing, and analytics.',
    thumbnail: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=600',
    tutorId: '3',
    tutorName: 'Dr. Emily Chen',
    tutorAvatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150',
    price: 39.99,
    rating: 4.6,
    totalStudents: 1567,
    lessons: [
      {
        id: '4-1',
        title: 'Search Engine Optimization',
        description: 'Boost your website visibility in search results.',
        videoUrl: 'https://example.com/video7.mp4',
        duration: '26:50',
        transcript: 'SEO is crucial for any business with an online presence. In this lesson, we\'ll cover...'
      },
      {
        id: '4-2',
        title: 'Social Media Marketing',
        description: 'Effective strategies for various social platforms.',
        videoUrl: 'https://example.com/video8.mp4',
        duration: '31:15',
        transcript: 'Social media offers incredible opportunities for businesses to connect with their audience...'
      }
    ],
    categories: ['Marketing', 'Digital', 'Business'],
    level: 'beginner',
    duration: '5h 45m'
  }
];

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
    courseId: '1',
    content: 'Hi Professor Chad, I have a question about neural networks from today\'s lesson.',
    timestamp: new Date('2023-06-15T14:30:00')
  },
  {
    id: '2',
    userId: '1',
    userName: 'Professor Chad',
    userAvatar: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=150',
    courseId: '1',
    content: 'Hi Jane! Of course, what would you like to know about neural networks?',
    timestamp: new Date('2023-06-15T14:32:00')
  },
  {
    id: '3',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
    courseId: '1',
    content: 'I\'m struggling to understand how backpropagation works. Could you explain it in simpler terms?',
    timestamp: new Date('2023-06-15T14:35:00')
  },
  {
    id: '4',
    userId: '1',
    userName: 'Professor Chad',
    userAvatar: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=150',
    courseId: '1',
    content: 'Absolutely! Think of backpropagation like learning from mistakes. When the network makes a prediction, it compares it to the correct answer, measures how wrong it was, and then adjusts all the weights in the network to make it a little better next time. It\'s like working backwards from the error to fix each part of the network.',
    timestamp: new Date('2023-06-15T14:40:00')
  }
];