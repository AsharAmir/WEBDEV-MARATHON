import React, { useState } from "react";
import {
  X,
  BookOpen,
  Plus,
  Check,
  Upload,
  Video,
  Image,
  Loader2,
} from "lucide-react";
import { Course } from "../../types";
import { coursesAPI } from "../../services/api";
import { uploadMedia } from "../Uploadtosupabase/uploadmedia.js";

interface CourseModalProps {
  course: Course;
  mode: "enroll" | "create" | "edit";
  onClose: () => void;
  onSuccess?: (course: Course) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({
  course,
  mode,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState(course.thumbnail);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    price: course.price,
    level: course.level,
    category: course.category,
    duration: course.duration || "0h 0m",
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleUploadThumbnail = async () => {
    if (!thumbnailFile) {
      setError("Please select a thumbnail image");
      return null;
    }

    try {
      setIsUploadingThumbnail(true);
      setError("");

      const result = await uploadMedia(thumbnailFile, "image");

      if (result.error) {
        throw new Error(result.error.message || "Failed to upload thumbnail");
      }

      return result.url;
    } catch (err: any) {
      setError(err?.message || "Failed to upload thumbnail");
      return null;
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleUploadVideo = async () => {
    if (!videoFile) {
      setError("Please select a video file");
      return null;
    }

    try {
      setIsUploadingVideo(true);
      setError("");

      const result = await uploadMedia(videoFile, "video");

      if (result.error) {
        throw new Error(result.error.message || "Failed to upload video");
      }

      if (result.url) {
        setVideoUrl(result.url);
      }
      return result.url;
    } catch (err: any) {
      setError(err?.message || "Failed to upload video");
      return null;
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      setError("");
      await coursesAPI.enroll(course.id);
      onSuccess?.(course);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to enroll in course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Upload thumbnail if selected
      let thumbnailUrl = thumbnail;
      if (thumbnailFile) {
        const uploadedUrl = await handleUploadThumbnail();
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        } else {
          throw new Error("Failed to upload thumbnail");
        }
      } else if (!thumbnail) {
        throw new Error("Please upload a course thumbnail");
      }

      // Upload video if selected
      let videoUrlToUse = "";
      if (videoFile) {
        const uploadedUrl = await handleUploadVideo();
        if (uploadedUrl) {
          videoUrlToUse = uploadedUrl;
        } else {
          throw new Error("Failed to upload video");
        }
      }

      // Create a new lesson with the video
      const newLesson = videoUrlToUse
        ? {
            id: Date.now().toString(),
            title: "Introduction",
            description: "Course introduction video",
            videoUrl: videoUrlToUse,
            duration: "0:00",
            courseId: course.id,
            order: 1,
          }
        : null;

      const newCourse = await coursesAPI.create({
        ...formData,
        thumbnail: thumbnailUrl,
        videoUrl: videoUrlToUse,
        tutorId: course.tutorId,
        tutorName: course.tutorName,
        tutorAvatar: course.tutorAvatar,
        rating: 0,
        totalStudents: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessons: newLesson ? [newLesson] : [],
        categories: [formData.category],
      });

      onSuccess?.(newCourse);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Upload thumbnail if selected
      let thumbnailUrl = thumbnail;
      if (thumbnailFile) {
        const uploadedUrl = await handleUploadThumbnail();
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        } else {
          throw new Error("Failed to upload thumbnail");
        }
      }

      // Upload video if selected
      let videoUrlToUse = "";
      if (videoFile) {
        const uploadedUrl = await handleUploadVideo();
        if (uploadedUrl) {
          videoUrlToUse = uploadedUrl;
        } else {
          throw new Error("Failed to upload video");
        }
      }

      // Create a new lesson with the video if uploaded
      const updatedLessons = [...course.lessons];
      if (videoUrlToUse) {
        const newLesson = {
          id: Date.now().toString(),
          title: "New Video",
          description: "New course video",
          videoUrl: videoUrlToUse,
          duration: "0:00",
          courseId: course.id,
          order: updatedLessons.length + 1,
        };
        updatedLessons.push(newLesson);
      }

      const updatedCourse = await coursesAPI.update(course.id, {
        ...formData,
        thumbnail: thumbnailUrl,
        videoUrl: videoUrlToUse || (course as any).videoUrl,
        updatedAt: new Date().toISOString(),
        lessons: updatedLessons,
      });

      onSuccess?.(updatedCourse);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to update course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "enroll"
              ? "Enroll in Course"
              : mode === "create"
              ? "Create New Course"
              : "Edit Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <div className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>{error}</span>
          </div>
        )}

        {mode === "enroll" ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {course.title}
              </h3>
              <p className="text-gray-600 mt-2">
                {course.description.substring(0, 100)}...
              </p>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to enroll in this course?
            </p>
            <button
              onClick={handleEnroll}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Enrolling...
                </span>
              ) : (
                "Enroll Now"
              )}
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "create") {
                handleCreate();
              } else {
                handleUpdate();
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  {thumbnail && (
                    <div className="relative group">
                      <img
                        src={thumbnail}
                        alt="Course thumbnail"
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer p-2 bg-white rounded-full">
                          <Image className="w-5 h-5 text-gray-700" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="hidden"
                            disabled={isUploadingThumbnail}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                  {!thumbnail && (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <Image className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 text-center px-2">
                        {isUploadingThumbnail
                          ? "Uploading..."
                          : "Upload Thumbnail"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        disabled={isUploadingThumbnail}
                      />
                    </label>
                  )}
                </div>
                {thumbnailFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {thumbnailFile.name}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Video
                </label>
                <div className="flex items-center space-x-4">
                  {videoUrl && (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center shadow-md">
                      <Video className="w-12 h-12 text-blue-500" />
                    </div>
                  )}
                  {!videoUrl && (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <Video className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 text-center px-2">
                        {isUploadingVideo ? "Uploading..." : "Upload Video"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        disabled={isUploadingVideo}
                      />
                    </label>
                  )}
                </div>
                {videoFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {videoFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full py-2.5 px-4 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter course description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="e.g., Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 2h 30m"
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploadingThumbnail || isUploadingVideo}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Saving...
                  </>
                ) : mode === "create" ? (
                  "Create Course"
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseModal;
