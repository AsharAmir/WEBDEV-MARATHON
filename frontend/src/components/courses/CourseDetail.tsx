import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coursesAPI } from "../../services/api";
import { Course } from "../../types/course";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          throw new Error("Course ID is required");
        }
        const courseData = (await coursesAPI.getById(courseId)) as Course;
        console.log("Fetched course data:", courseData);
        console.log("Lessons array:", courseData.lessons);
        if (Array.isArray(courseData.lessons)) {
          courseData.lessons.forEach((lesson, index) => {
            console.log(`Lesson ${index + 1}:`, lesson);
          });
        }
        setCourse(courseData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch course details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || "Course not found"}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-2 text-lg text-gray-600">{course.description}</p>
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm text-gray-500">Level: {course.level}</span>
          <span className="text-sm text-gray-500">
            Duration: {course.duration}
          </span>
          <span className="text-sm text-gray-500">
            Students: {course.totalStudents}
          </span>
          <span className="text-sm text-gray-500">
            Rating: {course.rating}/5
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="prose max-w-none">
              <p>{course.content}</p>
            </div>
          </section>

          {/* What You'll Learn */}
          {course.learningObjectives &&
            course.learningObjectives.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  What You'll Learn
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {/* Course Curriculum */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            {(() => {
              console.log("Rendering course content section");
              console.log("Course object:", course);
              console.log("Lessons array in render:", course.lessons);

              return (
                <div className="space-y-4">
                  {Array.isArray(course.lessons) &&
                  course.lessons.length > 0 ? (
                    course.lessons.map((lesson: any, index: number) => {
                      console.log(`Rendering lesson ${index}:`, lesson);
                      return (
                        <div
                          key={lesson._id || `lesson-${index}`}
                          className="border rounded-lg overflow-hidden bg-white shadow-sm"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-3">
                                  Lesson {index + 1}
                                </span>
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {lesson.title || `Lesson ${index + 1}`}
                                  </h3>
                                  <p className="text-gray-600 mt-1">
                                    {lesson.description ||
                                      "No description available"}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                                {typeof lesson.duration === "number"
                                  ? `${lesson.duration} min`
                                  : lesson.duration || "Duration not set"}
                              </span>
                            </div>
                            {lesson.videoUrl && (
                              <div className="mt-4">
                                <video
                                  className="w-full rounded"
                                  src={lesson.videoUrl}
                                  controls
                                  preload="metadata"
                                />
                              </div>
                            )}
                            {lesson.status === "processing" && (
                              <div className="mt-2 text-yellow-600 text-sm">
                                Video is being processed...
                              </div>
                            )}
                            {lesson.status === "failed" && (
                              <div className="mt-2 text-red-600 text-sm">
                                Video processing failed
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No lessons available yet</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </section>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2">
                {course.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Target Audience */}
          {course.targetAudience && course.targetAudience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Who This Course is For
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                {course.targetAudience.map((audience, index) => (
                  <li key={index}>{audience}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Instructor */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Instructor</h2>
            <div className="flex items-center mb-4">
              {course.tutorAvatar ? (
                <img
                  src={course.tutorAvatar}
                  alt={course.tutorName}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">
                    {course.tutorName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="ml-4">
                <h3 className="font-medium">{course.tutorName}</h3>
                {course.tutorTitle && (
                  <p className="text-sm text-gray-600">{course.tutorTitle}</p>
                )}
              </div>
            </div>
            {course.tutorBio && (
              <p className="text-gray-600">{course.tutorBio}</p>
            )}
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Course Info</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Categories</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {course.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Created</h3>
                <p className="text-gray-600">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Last Updated</h3>
                <p className="text-gray-600">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
