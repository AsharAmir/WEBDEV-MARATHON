import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { Course } from "../../types";
import { coursesAPI } from "../../services/api";
import CourseModal from "./CourseModal";

const CreatedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCreatedCourses = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await coursesAPI.getCreatedCourses();
        setCourses(data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch created courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatedCourses();
  }, []);

  const handleDelete = async (courseId: string) => {
    try {
      await coursesAPI.delete(courseId);
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err: any) {
      setError(err?.message || "Failed to delete course");
    }
  };

  const handleCreateSuccess = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
  };

  const handleUpdateSuccess = (updatedCourse: Course) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No courses created
          </h3>
          <p className="mt-1 text-gray-500">
            Create your first course to start teaching!
          </p>
        </div>
      ) : (
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingCourse(course);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(course.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {course.totalStudents} students
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CourseModal
          course={{
            id: "",
            title: "",
            description: "",
            thumbnail: "",
            price: 0,
            level: "beginner",
            category: "",
            tutorId: "",
            tutorName: "",
            tutorAvatar: "",
            rating: 0,
            totalStudents: 0,
            createdAt: "",
            updatedAt: "",
            lessons: [],
            categories: [],
            duration: "",
          }}
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {editingCourse && (
        <CourseModal
          course={editingCourse}
          mode="edit"
          onClose={() => setEditingCourse(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default CreatedCourses;
