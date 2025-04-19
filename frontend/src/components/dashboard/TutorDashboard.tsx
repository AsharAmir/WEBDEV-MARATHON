import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Users, BookOpen, BarChart, DollarSign, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCourses } from '../../data/mockData';

const TutorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  
  // Filter courses for this tutor (using id '1' as example)
  const tutorCourses = mockCourses.filter(course => course.tutorId === '1');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutor Dashboard</h1>
        <p className="text-gray-600">Manage your courses and students</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{tutorCourses.length}</h2>
              <p className="text-gray-600">Active Courses</p>
            </div>
          </div>
          <div className="mt-2">
            <Link to="/create-course" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              Create New Course
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {tutorCourses.reduce((total, course) => total + course.totalStudents, 0)}
              </h2>
              <p className="text-gray-600">Total Students</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-green-500">↑ 12%</span> from last month
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">$1,247.00</h2>
              <p className="text-gray-600">Monthly Revenue</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-green-500">↑ 8%</span> from last month
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full mr-4">
              <BarChart className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">4.8/5.0</h2>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Based on {tutorCourses.reduce((total, course) => total + course.totalStudents, 0)} reviews
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'courses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'earnings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
              <Link
                to="/create-course"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Course
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tutorCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-10 w-16 object-cover rounded mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.categories[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{course.totalStudents}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-500 fill-current mr-1" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="text-sm text-gray-900">{course.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${course.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Student Management</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              View and manage all students enrolled in your courses. Track their progress and communicate directly.
            </p>
          </div>
        )}
        
        {activeTab === 'earnings' && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Earnings Dashboard</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Track your revenue, view payment history, and manage your payout preferences.
            </p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Course Analytics</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Gain insights into student engagement, course popularity, and areas for improvement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;