import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import EnrollButton from "../components/courses/EnrollButton";
import CourseChat from "../components/courses/CourseChat";
import { coursesAPI, enrollmentsAPI } from "../services/api";
import type { Course, Lesson } from "../types/course";
import { Plus } from "lucide-react";

// Add type declarations at the top of the file
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
  tutorId: {
    _id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  tutorName: string;
  tutorAvatar?: string;
  totalStudents: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  duration: string;
  content?: string;
  requirements?: string[];
  objectives?: string[];
  lessons: Lesson[];
  __v: number;
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
  const [transcripts, setTranscripts] = useState<{ [key: string]: string }>({});
  const speechRecognitionRefs = useRef<{
    [key: string]: {
      recognition: any;
      isActive: boolean;
    };
  }>({});

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
          lessons: apiData.lessons || [],
          __v: apiData.__v,
          tutorAvatar: apiData.tutorAvatar || "",
          thumbnail: apiData.thumbnail || "",
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

  const startTranscription = (
    lessonId: string,
    videoElement: HTMLVideoElement
  ) => {
    if (speechRecognitionRefs.current[lessonId]) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let transcript = "";
    recognition.onresult = (event: any) => {
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setTranscripts((prev) => ({
        ...prev,
        [lessonId]: transcript,
      }));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (speechRecognitionRefs.current[lessonId]) {
        delete speechRecognitionRefs.current[lessonId];
      }
    };

    videoElement.onplay = () => {
      const recognitionState = speechRecognitionRefs.current[lessonId];
      if (recognitionState && !recognitionState.isActive) {
        try {
          recognition.start();
          recognitionState.isActive = true;
        } catch (error) {
          console.error("Failed to start speech recognition:", error);
        }
      }
    };

    videoElement.onpause = () => {
      const recognitionState = speechRecognitionRefs.current[lessonId];
      if (recognitionState && recognitionState.isActive) {
        try {
          recognition.stop();
          recognitionState.isActive = false;
        } catch (error) {
          console.error("Failed to stop speech recognition:", error);
        }
      }
    };

    videoElement.onended = () => {
      const recognitionState = speechRecognitionRefs.current[lessonId];
      if (recognitionState && recognitionState.isActive) {
        try {
          recognition.stop();
          recognitionState.isActive = false;
        } catch (error) {
          console.error("Failed to stop speech recognition:", error);
        }
      }
    };

    speechRecognitionRefs.current[lessonId] = {
      recognition,
      isActive: false,
    };
  };

  const stopTranscription = (lessonId: string) => {
    const recognitionState = speechRecognitionRefs.current[lessonId];
    if (recognitionState) {
      if (recognitionState.isActive) {
        try {
          recognitionState.recognition.stop();
        } catch (error) {
          console.error("Failed to stop speech recognition:", error);
        }
      }
      delete speechRecognitionRefs.current[lessonId];
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      Object.keys(speechRecognitionRefs.current).forEach((lessonId) => {
        stopTranscription(lessonId);
      });
    };
  }, []);

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

  const isTutor = user?.role === "tutor" && user?.id === course.tutorId._id;

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

          {/* Course Content */}
          {(isEnrolled || isTutor) &&
            course.lessons &&
            course.lessons.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson._id}
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
                                {lesson.title}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {lesson.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                            {lesson.duration} min
                          </span>
                        </div>
                        {lesson.videoUrl && (
                          <div className="mt-4">
                            <video
                              className="w-full rounded"
                              src={lesson.videoUrl}
                              controls
                              preload="metadata"
                              ref={(videoElement) => {
                                if (videoElement) {
                                  startTranscription(lesson._id, videoElement);
                                }
                              }}
                            />
                            {/* Real-time Transcription */}
                            <div className="mt-4 border-t pt-4">
                              <h4 className="text-md font-semibold mb-2">
                                Live Transcription
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-60 overflow-y-auto">
                                {transcripts[lesson._id] ||
                                  "Play the video to see real-time transcription"}
                              </div>
                            </div>
                            {/* Summary Section */}
                            {transcripts[lesson._id] && (
                              <div className="mt-4 border-t pt-4">
                                <h4 className="text-md font-semibold mb-2">
                                  Key Points
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                                  {transcripts[lesson._id]
                                    .split(".")
                                    .slice(0, 3)
                                    .join(". ")}
                                </div>
                              </div>
                            )}
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
                  ))}
                </div>
              </div>
            )}

          {/* Course Chat - Only show for enrolled students or tutors */}
          {user && (isEnrolled || user.role === "tutor") && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Course Discussion</h2>
              <CourseChat courseId={course._id} />
            </div>
          )}
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

            {/* Show different content based on user role and enrollment status */}
            {isTutor ? (
              <div className="mt-6">
                <Link
                  to={`/courses/${course._id}/add-lesson`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Lesson
                </Link>
              </div>
            ) : user?.role === "student" ? (
              <div className="mt-6">
                {isEnrolled ? (
                  <div className="text-center">
                    <button
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg"
                      disabled
                    >
                      Enrolled
                    </button>
                    <Link
                      to={`/courses/${course._id}/learn`}
                      className="block mt-4 text-blue-600 hover:underline"
                    >
                      Start Learning
                    </Link>
                  </div>
                ) : (
                  <EnrollButton
                    courseId={course._id}
                    price={course.price}
                    onEnrollmentComplete={handleEnrollmentComplete}
                  />
                )}
              </div>
            ) : !user ? (
              <div className="mt-6 text-center text-gray-600">
                Please{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  log in
                </Link>{" "}
                to enroll in this course.
              </div>
            ) : (
              <div className="mt-6 text-center text-gray-600">
                Tutors cannot enroll in courses.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Requirements */}
      {course.requirements && course.requirements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Requirements</h2>
          <ul className="list-disc list-inside space-y-2">
            {course.requirements.map((req, index) => (
              <li key={index} className="text-gray-700">
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course Objectives */}
      {course.objectives && course.objectives.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
          <ul className="list-disc list-inside space-y-2">
            {course.objectives.map((obj, index) => (
              <li key={index} className="text-gray-700">
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
