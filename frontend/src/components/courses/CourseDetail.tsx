import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Users, BarChart4, BookOpen, Check, ChevronDown, ShoppingCart, Star } from 'lucide-react';
import { mockCourses } from '../../data/mockData';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  
  // Find course by id
  const course = mockCourses.find(course => course.id === id);
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
        <p className="mt-4 text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses" className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to courses
        </Link>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/courses" className="flex items-center text-blue-200 hover:text-white">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to courses
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Course info */}
            <div>
              <div className="flex gap-2 mb-4">
                {course.categories.slice(0, 3).map((category, idx) => (
                  <span key={idx} className="bg-blue-700 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-blue-100 mb-6">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-blue-200 ml-1">({course.totalStudents} students)</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-300 mr-1" />
                  <span>{course.duration}</span>
                </div>
                
                <div className="flex items-center">
                  <BarChart4 className="h-5 w-5 text-blue-300 mr-1" />
                  <span>{course.level}</span>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <img 
                  src={course.tutorAvatar} 
                  alt={course.tutorName}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-white"
                />
                <div>
                  <p className="text-blue-200">Instructor</p>
                  <p className="font-medium">{course.tutorName}</p>
                </div>
              </div>
              
              <div className="lg:hidden mt-6">
                <Link
                  to={`/enroll/${course.id}`}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Enroll Now - ${course.price.toFixed(2)}
                </Link>
              </div>
            </div>
            
            {/* Preview video placeholder */}
            <div className="relative rounded-xl overflow-hidden bg-blue-800 aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-transparent opacity-70"></div>
              <div className="z-10 text-center">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full inline-flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all mb-4">
                  <Play className="h-12 w-12 text-white fill-current" />
                </div>
                <p className="text-lg font-medium">Watch Course Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Overview section */}
            <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('overview')}
                className="w-full flex justify-between items-center p-4 bg-gray-50 text-left"
              >
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
                  Course Overview
                </h2>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded('overview') ? 'rotate-180' : ''}`} />
              </button>
              
              {isExpanded('overview') && (
                <div className="p-6">
                  <p className="text-gray-700 mb-6">
                    {course.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Master the fundamentals of {course.categories[0]}</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Build real-world projects for your portfolio</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Understand advanced concepts and best practices</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Gain confidence through hands-on exercises</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Requirements</h3>
                  <ul className="list-disc pl-5 text-gray-700 mb-6">
                    <li className="mb-2">Basic computer skills</li>
                    <li className="mb-2">No prior {course.categories[0]} knowledge needed</li>
                    <li>Enthusiasm to learn and practice</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">This course is perfect for:</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li className="mb-2">Beginners with no prior experience</li>
                    <li className="mb-2">Intermediate learners looking to fill knowledge gaps</li>
                    <li>Professionals wanting to stay updated with the latest trends</li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Curriculum section */}
            <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('curriculum')}
                className="w-full flex justify-between items-center p-4 bg-gray-50 text-left"
              >
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
                  Course Curriculum
                </h2>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded('curriculum') ? 'rotate-180' : ''}`} />
              </button>
              
              {isExpanded('curriculum') && (
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-700">
                      <span className="font-medium">{course.lessons.length} lessons</span> • {course.duration} total length
                    </p>
                  </div>
                  
                  {/* Module 1 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2 text-sm">Module 1</span>
                      Introduction to {course.categories[0]}
                    </h3>
                    
                    <div className="space-y-3">
                      {course.lessons.map((lesson, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <Play className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-500">{lesson.description}</p>
                            </div>
                          </div>
                          <span className="text-gray-500 text-sm">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Module 2 (placeholder) */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2 text-sm">Module 2</span>
                      Advanced Topics (Coming Soon)
                    </h3>
                    
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-gray-500 italic">Additional lessons coming soon...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Instructor section */}
            <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('instructor')}
                className="w-full flex justify-between items-center p-4 bg-gray-50 text-left"
              >
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="mr-2 h-6 w-6 text-blue-600" />
                  Instructor
                </h2>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded('instructor') ? 'rotate-180' : ''}`} />
              </button>
              
              {isExpanded('instructor') && (
                <div className="p-6">
                  <div className="flex items-start mb-6">
                    <img 
                      src={course.tutorAvatar} 
                      alt={course.tutorName}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{course.tutorName}</h3>
                      <p className="text-gray-600">Expert in {course.categories.join(', ')}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    Passionate educator with extensive experience in teaching {course.categories[0]}. 
                    Dedicated to making complex concepts easy to understand through practical, 
                    hands-on learning approaches.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-gray-900">${course.price.toFixed(2)}</span>
                </div>
                
                <Link
                  to={`/enroll/${course.id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors mb-4"
                >
                  <ShoppingCart className="inline-block mr-2 h-5 w-5" />
                  Enroll Now
                </Link>
                
                <p className="text-center text-gray-500 text-sm mb-6">30-Day Money-Back Guarantee</p>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">This course includes:</h3>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">{course.duration} of on-demand video</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">{course.lessons.length} lessons</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">Real-time chat with instructor</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BarChart4 className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">Progress tracking</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;