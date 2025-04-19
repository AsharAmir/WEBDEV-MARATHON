import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import EnrollButton from "../components/courses/EnrollButton";
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
  const speechRecognitionRefs = useRef<{ [key: string]: any }>({});

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
    // If recognition already exists for this lesson, don't create a new one
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
      // Clean up on error
      if (speechRecognitionRefs.current[lessonId]) {
        delete speechRecognitionRefs.current[lessonId];
      }
    };

    let isRecognitionActive = false;
    videoElement.onplay = () => {
      if (!isRecognitionActive) {
        try {
          recognition.start();
          isRecognitionActive = true;
        } catch (error) {
          console.error("Failed to start speech recognition:", error);
        }
      }
    };

    videoElement.onpause = () => {
      if (isRecognitionActive) {
        try {
          recognition.stop();
          isRecognitionActive = false;
        } catch (error) {
          console.error("Failed to stop speech recognition:", error);
        }
      }
    };

    videoElement.onended = () => {
      if (isRecognitionActive) {
        try {
          recognition.stop();
          isRecognitionActive = false;
        } catch (error) {
          console.error("Failed to stop speech recognition:", error);
        }
      }
    };

    speechRecognitionRefs.current[lessonId] = recognition;
  };

  const stopTranscription = (lessonId: string) => {
    if (speechRecognitionRefs.current[lessonId]) {
      speechRecognitionRefs.current[lessonId].stop();
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
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Level: {course.level}</span>
                <span>•</span>
                <span>{course.totalStudents} students</span>
                <span>•</span>
                <span>Rating: {course.rating}/5</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ${course.price}
              </div>
              {isTutor ? (
                <Link
                  to={`/courses/${course._id}/add-lesson`}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Lesson
                </Link>
              ) : (
                <EnrollButton
                  courseId={course._id}
                  price={course.price}
                  isEnrolled={isEnrolled}
                  onEnrollmentComplete={handleEnrollmentComplete}
                />
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Course Content</h2>
          {course.lessons && course.lessons.length > 0 ? (
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
                        {/* Summary Section - We'll generate this from the transcription */}
                        {transcripts[lesson._id] && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="text-md font-semibold mb-2">
                              Key Points
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                              {/* You can add AI-generated summary here if needed */}
                              {/* For now, we'll show the first few sentences */}
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
          ) : (
            <p className="text-gray-500">No lessons available yet.</p>
          )}
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
    </div>
  );
};

export default CourseDetailPage;
