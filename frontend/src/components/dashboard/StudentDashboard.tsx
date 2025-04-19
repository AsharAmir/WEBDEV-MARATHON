import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  Play,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { enrollmentsAPI } from "../../services/api";
import type { Course } from "../../types/course";
import type { Enrollment } from "../../services/api";

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("enrolled");
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = (await enrollmentsAPI.getMyEnrollments()) as Enrollment[];
        setEnrollments(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch enrollments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Filter enrollments based on search
  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.courseId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total learning time
  const totalLearningTime = enrollments.reduce((total, enrollment) => {
    // Assuming each lesson is 30 minutes
    return total + (enrollment.progress / 100) * 30;
  }, 0);

  // Calculate completed lessons
  const completedLessons = enrollments.filter(
    (enrollment) => enrollment.progress === 100
  ).length;
  const totalLessons = enrollments.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-600">Track your learning progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {enrollments.length}
              </h2>
              <p className="text-gray-600">Enrolled Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {Math.round(totalLearningTime)}h
              </h2>
              <p className="text-gray-600">Total Learning Time</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {completedLessons}/{totalLessons}
              </h2>
              <p className="text-gray-600">Completed Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Active</h2>
              <p className="text-gray-600">Learning Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your courses..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "enrolled"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Enrolled Courses
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "progress"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "completed"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Completed
          </button>
        </nav>
      </div>

      {/* Courses Grid */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="relative">
                <img
                  src={enrollment.courseId.thumbnail}
                  alt={enrollment.courseId.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-white text-sm font-medium">
                      Progress: {enrollment.progress}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Link
                  to={`/courses/${enrollment.courseId._id}`}
                  className="group"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {enrollment.courseId.title}
                  </h3>
                </Link>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Instructor: {enrollment.courseId.tutorName}</span>
                </div>

                <div className="relative w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <Link
                    to={`/courses/${enrollment.courseId._id}/learn`}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <Play className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Continue Learning
                        </h5>
                        <p className="text-xs text-gray-500">
                          Resume your progress
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "No results match your search criteria."
              : "You haven't enrolled in any courses yet."}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
