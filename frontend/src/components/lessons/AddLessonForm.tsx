import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { coursesAPI } from "../../services/api";
import { Loader2 } from "lucide-react";

interface AddLessonFormProps {
  courseId: string;
}

interface LessonStatus {
  status:
    | "processing"
    | "transcribing"
    | "summarizing"
    | "completed"
    | "failed";
  message?: string;
}

interface AddLessonResponse {
  lessonId: string;
  status: LessonStatus["status"];
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({ courseId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<
    LessonStatus["status"] | null
  >(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkProcessingStatus = async () => {
      if (lessonId) {
        try {
          const status = (await coursesAPI.getLessonStatus(
            courseId,
            lessonId
          )) as LessonStatus;
          setProcessingStatus(status.status);

          if (status.status === "completed" || status.status === "failed") {
            clearInterval(intervalId);
            if (status.status === "completed") {
              navigate(`/courses/${courseId}`);
            }
          }
        } catch (err) {
          console.error("Failed to check processing status:", err);
        }
      }
    };

    if (lessonId) {
      intervalId = setInterval(checkProcessingStatus, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [lessonId, courseId, navigate]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size must be less than 100MB");
        return;
      }
      // Check file type
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return;
      }
      setVideo(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) {
      setError("Please select a video file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = (await coursesAPI.addLesson(courseId, {
        title,
        description,
        video,
      })) as AddLessonResponse;

      setLessonId(response.lessonId);
      setProcessingStatus("processing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add lesson");
      setLoading(false);
    }
  };

  const renderStatus = () => {
    if (!processingStatus) return null;

    const statusMessages = {
      processing: "Processing video and generating transcription...",
      transcribing: "Transcribing video...",
      summarizing: "Generating summary and notes...",
      completed: "Processing completed!",
      failed: "Processing failed. Please try again.",
    };

    const message =
      statusMessages[processingStatus as keyof typeof statusMessages] ||
      processingStatus;

    return (
      <div
        className={`mt-4 p-4 rounded-lg ${
          processingStatus === "failed"
            ? "bg-red-100 text-red-700"
            : processingStatus === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        <div className="flex items-center">
          {processingStatus !== "completed" &&
            processingStatus !== "failed" && (
              <Loader2 className="animate-spin mr-2" size={18} />
            )}
          <span>{message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Lesson</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {renderStatus()}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Lesson Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={loading || !!processingStatus}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={loading || !!processingStatus}
          />
        </div>

        <div>
          <label
            htmlFor="video"
            className="block text-sm font-medium text-gray-700"
          >
            Video File
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
            disabled={loading || !!processingStatus}
          />
          <p className="mt-1 text-sm text-gray-500">
            Maximum file size: 100MB. Supported formats: MP4, MOV, AVI, WMV
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading || !!processingStatus}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !!processingStatus}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Adding Lesson..." : "Add Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLessonForm;
