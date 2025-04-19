import React from 'react';
import { Video, MessageSquare, Brain, Users, BarChart, Zap } from 'lucide-react';

const features = [
  {
    icon: <Video className="w-10 h-10 text-blue-500" />,
    title: 'High Quality Video Courses',
    description: 'Access professionally produced video content with crystal clear audio and visuals.',
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-purple-500" />,
    title: 'Real-Time Chat',
    description: 'Connect instantly with tutors and fellow students to ask questions and share insights.',
  },
  {
    icon: <Brain className="w-10 h-10 text-indigo-500" />,
    title: 'AI-Generated Transcripts',
    description: 'Get automatic transcripts for all video content, making it easier to search and review.',
  },
  {
    icon: <Users className="w-10 h-10 text-green-500" />,
    title: 'Collaborative Learning',
    description: 'Work together with peers on projects and assignments in a supportive environment.',
  },
  {
    icon: <BarChart className="w-10 h-10 text-amber-500" />,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and progress reports.',
  },
  {
    icon: <Zap className="w-10 h-10 text-red-500" />,
    title: 'Interactive Exercises',
    description: 'Reinforce your learning with hands-on exercises and quizzes designed to test your knowledge.',
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with effective teaching methods to deliver an unparalleled educational experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="mb-4 transform transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;