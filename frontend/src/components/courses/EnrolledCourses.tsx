import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, X } from "lucide-react";
import { Course } from "../../types";
import { coursesAPI } from "../../services/api";

const EnrolledCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await coursesAPI.getEnrolledCourses();
        setCourses(data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch enrolled courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId: string) => {
    try {
      await coursesAPI.unenroll(courseId);
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err: any) {
      setError(err?.message || "Failed to unenroll from course");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No enrolled courses
        </h3>
        <p className="mt-1 text-gray-500">
          Browse our courses to start learning!
        </p>
        <Link
          to="/courses"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <Link to={`/courses/${course.id}`}>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={course.tutorAvatar}
                    alt={course.tutorName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    {course.tutorName}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleUnenroll(course.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EnrolledCourses;
