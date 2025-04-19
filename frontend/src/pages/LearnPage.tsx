import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { coursesAPI } from "../services/api";
import type { Course, Lesson } from "../types/course";
import { Video, Play, Lock } from "lucide-react";

interface CourseProgress {
  completedLessons: string[];
  progress: number;
}

const LearnPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        if (!courseId) {
          throw new Error("Course ID is required");
        }

        // Fetch course details with lessons
        const courseData = (await coursesAPI.getById(courseId)) as Course;

        // Get progress from localStorage
        const progressStr = localStorage.getItem(`course_progress_${courseId}`);
        const progress: CourseProgress = progressStr
          ? JSON.parse(progressStr)
          : { completedLessons: [], progress: 0 };

        setCourse(courseData);

        // Set current lesson to the first uncompleted lesson or first lesson
        if (courseData.lessons && courseData.lessons.length > 0) {
          const firstUncompletedLesson = courseData.lessons.find(
            (lesson) => !progress.completedLessons.includes(lesson.title)
          );
          setCurrentLesson(firstUncompletedLesson || courseData.lessons[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId]);

  const handleLessonComplete = async () => {
    if (!courseId || !currentLesson) return;

    try {
      // Update progress in localStorage
      const progressStr = localStorage.getItem(`course_progress_${courseId}`);
      const progress: CourseProgress = progressStr
        ? JSON.parse(progressStr)
        : { completedLessons: [], progress: 0 };

      if (!progress.completedLessons.includes(currentLesson.title)) {
        progress.completedLessons.push(currentLesson.title);
        progress.progress =
          (progress.completedLessons.length / (course?.lessons?.length || 1)) *
          100;
        localStorage.setItem(
          `course_progress_${courseId}`,
          JSON.stringify(progress)
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to mark lesson as complete"
      );
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Course Info and Video Player */}
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-gray-600">{course.description}</p>
          </div>

          {currentLesson ? (
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <video
                className="w-full aspect-video"
                controls
                src={currentLesson.videoUrl}
                onEnded={handleLessonComplete}
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600">Select a lesson to start learning</p>
            </div>
          )}
        </div>

        {/* Lessons List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          <div className="space-y-2">
            {course.lessons?.map((lesson) => (
              <button
                key={lesson.title}
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full p-4 rounded-lg flex items-center justify-between ${
                  currentLesson?.title === lesson.title
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-gray-500" />
                  <div className="text-left">
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-500">{lesson.duration}</p>
                  </div>
                </div>
                {lesson.title === currentLesson?.title ? (
                  <Play className="w-5 h-5 text-blue-500" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
