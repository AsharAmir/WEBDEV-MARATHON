import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EnrollButton from "../components/courses/EnrollButton";
import { coursesAPI, enrollmentsAPI } from "../services/api";
import type { Course } from "../types/course";

interface User {
  id: string;
  role: "student" | "tutor";
  name: string;
  email: string;
}

interface ApiCourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  categories: string[];
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  totalStudents: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  duration: string; // API returns duration as string
  content?: string;
  requirements?: string[];
  objectives?: string[];
}

interface Enrollment {
  courseId: {
    _id: string;
  };
}

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Effect for loading user data - runs once on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // Effect for fetching course details - depends on id only
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        const apiData = (await coursesAPI.getById(id)) as unknown as ApiCourse;
        // Convert API data to match Course type
        const courseData: Course = {
          ...apiData,
          duration: apiData.duration || "",
        };
        setCourse(courseData);
      } catch (err) {
        setError("Failed to load course details");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Effect for checking enrollment status - depends on both id and user
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!id || !user) {
        setIsEnrolled(false);
        return;
      }

      try {
        const enrollments =
          (await enrollmentsAPI.getMyEnrollments()) as Enrollment[];
        const enrolled = enrollments.some(
          (enrollment: Enrollment) => enrollment.courseId._id === id
        );
        setIsEnrolled(enrolled);
      } catch (err) {
        console.error("Error checking enrollment:", err);
        setIsEnrolled(false);
      }
    };

    checkEnrollment();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">{error || "Course not found"}</div>
      </div>
    );
  }

  const handleEnrollmentComplete = () => {
    setIsEnrolled(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Info */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          <div className="aspect-video mb-6">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">About This Course</h2>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">
                ${course.price}
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-gray-600">Level:</span>
                <span className="ml-2 font-medium capitalize">
                  {course.level}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Students:</span>
                <span className="ml-2 font-medium">{course.totalStudents}</span>
              </div>
            </div>

            {/* Show different content based on enrollment status */}
            {user && user.role === "student" && (
              <div className="mt-6">
                {isEnrolled ? (
                  <div className="text-center">
                    <button
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg"
                      disabled
                    >
                      Enrolled
                    </button>
                    <a
                      href={`/courses/${course._id}/learn`}
                      className="block mt-4 text-blue-600 hover:underline"
                    >
                      Start Learning
                    </a>
                  </div>
                ) : (
                  <EnrollButton
                    courseId={course._id}
                    price={course.price}
                    onEnrollmentComplete={handleEnrollmentComplete}
                  />
                )}
              </div>
            )}

            {/* Show message if user is not logged in */}
            {!user && (
              <div className="mt-6 text-center text-gray-600">
                Please{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  log in
                </a>{" "}
                to enroll in this course.
              </div>
            )}

            {/* Show message if user is a tutor */}
            {user && user.role === "tutor" && (
              <div className="mt-6 text-center text-gray-600">
                Tutors cannot enroll in courses.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
