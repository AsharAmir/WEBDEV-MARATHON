import React, { useState } from "react";
import { X, BookOpen, Plus, Check, Upload } from "lucide-react";
import { Course } from "../../types";
import { coursesAPI } from "../../services/api";

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
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

      if (!thumbnail) {
        throw new Error("Please upload a course thumbnail");
      }

      const newCourse = await coursesAPI.create({
        ...formData,
        thumbnail,
        tutorId: course.tutorId,
        tutorName: course.tutorName,
        tutorAvatar: course.tutorAvatar,
        rating: 0,
        totalStudents: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessons: [],
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
      const updatedCourse = await coursesAPI.update(course.id, {
        ...formData,
        thumbnail,
        updatedAt: new Date().toISOString(),
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === "enroll"
              ? "Enroll in Course"
              : mode === "create"
              ? "Create Course"
              : "Edit Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {mode === "enroll" ? (
          <div className="text-center">
            <p className="mb-4">
              Are you sure you want to enroll in this course?
            </p>
            <button
              onClick={handleEnroll}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Enrolling..." : "Enroll Now"}
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Course thumbnail"
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 2h 30m"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Course"
                  : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseModal;
