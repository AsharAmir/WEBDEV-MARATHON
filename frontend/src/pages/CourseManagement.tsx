import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { coursesAPI } from "../services/api";
import type { Course, Lesson } from "../types/course";
import { Plus, Edit, Trash, Video } from "lucide-react";
import { toast } from "react-hot-toast";

const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
    order: 0,
  });
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  useEffect(() => {
    const fetchTutorCourses = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error("User not found");
        }

        const user = JSON.parse(userStr);
        if (user.role !== "tutor") {
          throw new Error("Access denied. Tutor role required.");
        }

        const tutorId = user._id || user.id;
        if (!tutorId) {
          throw new Error("Invalid tutor ID. Please log out and log in again.");
        }

        const tutorCourses = await coursesAPI.getTutorCourses(tutorId);
        setCourses(tutorCourses as Course[]);
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

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("User not found");

      const user = JSON.parse(userStr);
      const tutorId = user._id || user.id;
      if (!tutorId) {
        throw new Error("Invalid tutor ID. Please log out and log in again.");
      }

      const newCourse = await coursesAPI.create({
        ...courseData,
        tutorId: tutorId,
        tutorName: user.name,
      });

      setCourses([...courses, newCourse as Course]);
      setSelectedCourse(newCourse as Course);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse?._id) return;

    try {
      const updatedCourse = await coursesAPI.update(selectedCourse._id, {
        ...selectedCourse,
        lessons: selectedCourse.lessons || [],
      });
      setCourses(
        courses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
      );
      setSelectedCourse(null);
      toast.success("Course updated successfully");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await coursesAPI.delete(courseId);
      setCourses(courses.filter((course) => course._id !== courseId));
      if (selectedCourse?._id === courseId) {
        setSelectedCourse(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  };

  const handleAddLesson = async () => {
    if (!selectedCourse?._id) return;

    try {
      const newLesson = {
        title: lessonTitle,
        content: lessonContent,
        duration: parseInt(lessonDuration),
        order: (selectedCourse.lessons?.length || 0) + 1,
      };

      const updatedCourse = await coursesAPI.addLesson(
        selectedCourse._id,
        newLesson
      );
      setCourses(
        courses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
      );
      setSelectedCourse(updatedCourse);
      setLessonTitle("");
      setLessonContent("");
      setLessonDuration("");
      toast.success("Lesson added successfully");
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error("Failed to add lesson");
    }
  };

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <button
          onClick={() => {
            setSelectedCourse(null);
            setIsEditing(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span>Create Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className={`p-4 rounded-lg border ${
                  selectedCourse?._id === course._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsEditing(true);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Editor */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedCourse ? "Edit Course" : "Create Course"}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const courseData = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    price: Number(formData.get("price")),
                    level: formData.get("level") as Course["level"],
                    categories: (formData.get("categories") as string).split(
                      ","
                    ),
                  };

                  if (selectedCourse) {
                    handleUpdateCourse();
                  } else {
                    handleCreateCourse(courseData);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedCourse?.title}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedCourse?.description}
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={selectedCourse?.price}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    name="level"
                    defaultValue={selectedCourse?.level}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="categories"
                    defaultValue={selectedCourse?.categories.join(",")}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {selectedCourse ? "Update Course" : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          ) : selectedCourse ? (
            <div className="space-y-6">
              {/* Course Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedCourse.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedCourse.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${selectedCourse.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-medium capitalize">
                      {selectedCourse.level}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Lessons</h3>
                  <button
                    onClick={() =>
                      setNewLesson({
                        title: "",
                        description: "",
                        duration: "",
                        videoUrl: "",
                        order: selectedCourse.lessons?.length || 0,
                      })
                    }
                    className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                {newLesson.title && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleAddLesson();
                    }}
                    className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newLesson.title}
                          onChange={(e) =>
                            setNewLesson({
                              ...newLesson,
                              title: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={newLesson.description}
                          onChange={(e) =>
                            setNewLesson({
                              ...newLesson,
                              description: e.target.value,
                            })
                          }
                          required
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Duration
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={newLesson.duration}
                          onChange={(e) =>
                            setNewLesson({
                              ...newLesson,
                              duration: e.target.value,
                            })
                          }
                          required
                          placeholder="e.g., 30 minutes"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Video URL
                        </label>
                        <input
                          type="url"
                          name="videoUrl"
                          value={newLesson.videoUrl}
                          onChange={(e) =>
                            setNewLesson({
                              ...newLesson,
                              videoUrl: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() =>
                            setNewLesson({
                              title: "",
                              description: "",
                              duration: "",
                              videoUrl: "",
                              order: 0,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Add Lesson
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {selectedCourse.lessons &&
                    selectedCourse.lessons.map((lesson, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Video className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-sm text-gray-500">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const updatedLessons = [
                                ...selectedCourse.lessons,
                              ];
                              updatedLessons.splice(index, 1);
                              handleUpdateCourse();
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Select a course to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
