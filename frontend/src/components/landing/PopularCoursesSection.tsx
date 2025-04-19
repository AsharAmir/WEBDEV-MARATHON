import React, { useState, useEffect } from "react";
import { Star, Clock, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Course } from "../../types";
import { coursesAPI } from "../../services/api";

const PopularCoursesSection: React.FC = () => {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const courses = (await coursesAPI.getAll({
          sortBy: "popular",
          limit: 3,
        })) as Course[];
        setPopularCourses(courses);
      } catch (error) {
        console.error("Error fetching popular courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Most Popular Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Discover our highest rated and most enrolled courses from top
              tutors around the world.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-6 md:mt-0 flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All Courses
            <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-tr-lg">
          {course.level}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          {course.categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-gray-700 font-medium">{course.rating}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{course.duration}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">
              {course.totalStudents.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
          <img
            src={course.tutorAvatar}
            alt={course.tutorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-gray-500">Instructor</p>
            <p className="text-gray-800 font-medium">{course.tutorName}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Link
          to={`/courses/${course._id}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PopularCoursesSection;
