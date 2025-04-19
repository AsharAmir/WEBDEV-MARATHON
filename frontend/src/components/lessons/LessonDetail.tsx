import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { coursesAPI } from "../../services/api";
import { Loader2 } from "lucide-react";

interface LessonDetailProps {
  courseId: string;
  lessonId: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  transcription?: string;
  summary?: string;
  notes?: string;
  status:
    | "processing"
    | "transcribing"
    | "summarizing"
    | "completed"
    | "failed";
}

const LessonDetail: React.FC<LessonDetailProps> = ({ courseId, lessonId }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "video" | "transcription" | "summary" | "notes"
  >("video");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = (await coursesAPI.getLessonStatus(
          courseId,
          lessonId
        )) as { lesson: Lesson };
        setLesson(response.lesson);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();

    // If lesson is still processing, poll for updates
    const intervalId = setInterval(async () => {
      if (lesson?.status && !["completed", "failed"].includes(lesson.status)) {
        await fetchLesson();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error || "Lesson not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
        <span className="text-gray-500">{lesson.duration}</span>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("video")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "video"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Video
            </button>
            <button
              onClick={() => setActiveTab("transcription")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "transcription"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              disabled={!lesson.transcription}
            >
              Transcription
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "summary"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              disabled={!lesson.summary}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "notes"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              disabled={!lesson.notes}
            >
              Notes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "video" && (
            <div className="aspect-w-16 aspect-h-9">
              <video
                src={lesson.videoUrl}
                controls
                className="w-full h-full object-cover rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {activeTab === "transcription" && (
            <div className="prose max-w-none">
              {lesson.transcription ? (
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {lesson.transcription}
                </pre>
              ) : (
                <div className="text-gray-500 italic">
                  Transcription not available yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "summary" && (
            <div className="prose max-w-none">
              {lesson.summary ? (
                <div className="text-gray-700">{lesson.summary}</div>
              ) : (
                <div className="text-gray-500 italic">
                  Summary not available yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="prose max-w-none">
              {lesson.notes ? (
                <div className="text-gray-700 whitespace-pre-wrap">
                  {lesson.notes}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Notes not available yet.
                </div>
              )}
            </div>
          )}

          {lesson.status !== "completed" && lesson.status !== "failed" && (
            <div className="mt-4 bg-blue-100 text-blue-700 p-4 rounded-lg flex items-center">
              <Loader2 className="animate-spin mr-2" size={18} />
              <span>
                {lesson.status === "processing"
                  ? "Processing video..."
                  : lesson.status === "transcribing"
                  ? "Generating transcription..."
                  : "Generating summary and notes..."}
              </span>
            </div>
          )}

          {lesson.status === "failed" && (
            <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg">
              Failed to process video. Please try again.
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {lesson.description}
        </p>
      </div>
    </div>
  );
};

export default LessonDetail;
