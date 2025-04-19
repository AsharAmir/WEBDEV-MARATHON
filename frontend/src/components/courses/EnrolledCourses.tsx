import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, X } from "lucide-react";
import { Course } from "../../types";
import { coursesAPI } from "../../services/api";

interface EnrolledCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    thumbnail: string;
    tutorName: string;
  };
  progress: number;
  enrolledAt: string;
}

const EnrolledCourses: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch("/api/enrollments/my-enrollments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch enrollments");
        }

        const data = await response.json();
        setEnrollments(data);
      } catch (err) {
        setError("Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleUnenroll = async (courseId: string) => {
    try {
      await coursesAPI.unenroll(courseId);
      setEnrollments(
        enrollments.filter((enrollment) => enrollment.courseId._id !== courseId)
      );
    } catch (err: any) {
      setError(err?.message || "Failed to unenroll from course");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }

  if (enrollments.length === 0) {
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
      {enrollments.map((enrollment) => (
        <div
          key={enrollment._id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <img
            src={enrollment.courseId.thumbnail}
            alt={enrollment.courseId.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">
              {enrollment.courseId.title}
            </h3>
            <p className="text-gray-600 mb-2">
              By {enrollment.courseId.tutorName}
            </p>
            <div className="mb-2">
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-600 rounded"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {enrollment.progress}% Complete
              </p>
            </div>
            <Link
              to={`/courses/${enrollment.courseId._id}`}
              className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              View Course
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleUnenroll(enrollment.courseId._id);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnrolledCourses;
