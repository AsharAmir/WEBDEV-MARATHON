import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User } from 'lucide-react';

const CallToActionSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Image side */}
          <div className="lg:w-1/2">
            <img 
              src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Students learning online" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
          
          {/* Content side */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students and tutors on our platform. Whether you want to learn new skills or share your knowledge, LearnBeyond has everything you need.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <BookOpen className="text-blue-600 w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">For Students</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Access to 500+ premium courses</li>
                  <li>• Real-time chat with expert tutors</li>
                  <li>• AI-powered learning assistance</li>
                  <li>• Certificates upon completion</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <User className="text-purple-600 w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">For Tutors</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Reach students globally</li>
                  <li>• Powerful course creation tools</li>
                  <li>• Analytics and student insights</li>
                  <li>• Competitive revenue sharing</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-center"
              >
                Join as Student
              </Link>
              
              <Link 
                to="/signup?role=tutor" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-center"
              >
                Join as Tutor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;