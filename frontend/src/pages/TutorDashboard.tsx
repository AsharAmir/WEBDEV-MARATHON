import React, { useState, useEffect } from "react";
import { coursesAPI } from "../services/api";
import type { Course } from "../types/course";

interface EnrolledStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
  progress: number;
}

interface TutorCourse extends Course {
  enrollments: EnrolledStudent[];
}

const TutorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorCourses = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error("User not found");
        }

        const user = JSON.parse(userStr);
        console.log("User object:", user);
        console.log("User _id:", user._id);
        console.log("User id:", user.id);
        console.log("User keys:", Object.keys(user));

        if (user.role !== "tutor") {
          throw new Error("Access denied. Tutor role required.");
        }

        // Use either _id or id field, whichever is available
        const tutorId = user._id || user.id;
        if (!tutorId) {
          throw new Error("Invalid tutor ID. Please log out and log in again.");
        }

        const tutorCourses = (await coursesAPI.getTutorCourses(
          tutorId
        )) as TutorCourse[];
        setCourses(tutorCourses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTutorCourses();
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      {courses.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven't created any courses yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-600">{course.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${course.price}</p>
                  <p className="text-gray-500">{course.level}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Enrolled Students
                </h3>
                {course.enrollments.length === 0 ? (
                  <p className="text-gray-500">No students enrolled yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrolled Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {course.enrollments.map((student) => (
                          <tr key={student.studentId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.studentName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.studentEmail}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(
                                student.enrolledAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {student.progress}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;
