import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  BookOpen,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Course, CourseFilters } from "../../types/course";
import { coursesAPI } from "../../services/api";

const categories = [
  "All Categories",
  "Computer Science",
  "AI",
  "Machine Learning",
  "Web Development",
  "Data Science",
  "Business",
  "Marketing",
];

const CourseList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState<CourseFilters["sortBy"]>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError("");

        const filters: CourseFilters = {};
        if (selectedCategory !== "All Categories") {
          filters.category = selectedCategory;
        }
        if (selectedLevel !== "All Levels") {
          filters.level = selectedLevel;
        }
        if (searchTerm) {
          filters.search = searchTerm;
        }
        if (sortBy) {
          filters.sortBy = sortBy;
        }

        console.log("Fetching courses with filters:", filters);
        const data = await coursesAPI.getAll(filters);
        console.log("Received courses:", data);
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load courses. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, selectedLevel, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          All Courses
        </h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Levels">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as CourseFilters["sortBy"])
                }
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading courses...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-8">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-600 font-semibold">
                    ${course.price}
                  </span>
                  <span className="text-sm text-gray-500">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={course.tutorAvatar || "/default-avatar.png"}
                      alt={course.tutorName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      {course.tutorName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {course.totalStudents} students
                    </span>
                    <span className="text-sm text-yellow-500">
                      {course.rating} ★
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3">
                <Link
                  to={`/courses/${course._id}`}
                  className="block text-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
