import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { coursesAPI } from "../services/api";
import { Course, Lesson } from "../types/course";
import { Plus, Edit, Trash, Video } from "lucide-react";
import { toast } from "react-hot-toast";
import { uploadMedia } from "../components/Uploadtosupabase/uploadmedia";

interface NewLesson {
  title: string;
  description: string;
  videoFile: File | null;
  duration: string;
}

const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: "",
    description: "",
    videoFile: null,
    duration: "",
  });

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
    if (!selectedCourse) return;
    try {
      const updatedCourse = (await coursesAPI.update(
        selectedCourse._id,
        selectedCourse
      )) as Course;
      setCourses(
        courses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );
      setIsEditing(false);
      toast.success("Course updated successfully");
    } catch (error) {
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

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Starting lesson addition with:", {
      courseId: selectedCourse?._id,
      lessonData: {
        ...newLesson,
        videoFile: newLesson.videoFile
          ? {
              name: newLesson.videoFile.name,
              type: newLesson.videoFile.type,
              size: newLesson.videoFile.size,
            }
          : null,
      },
    });

    if (!selectedCourse) {
      toast.error("Please select a course first");
      return;
    }

    if (!newLesson.videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!newLesson.title || !newLesson.description || !newLesson.duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = "lessonUpload";
    try {
      // Show loading state
      toast.loading("Uploading video to Supabase...", { id: toastId });

      // First upload the video to Supabase
      console.log("Uploading video to Supabase...");
      const uploadResult = await uploadMedia(newLesson.videoFile, "video");

      if (uploadResult.error) {
        console.error("Video upload failed:", uploadResult.error);
        throw new Error(`Failed to upload video: ${uploadResult.error}`);
      }

      if (!uploadResult.url) {
        throw new Error("Failed to get video URL from Supabase");
      }

      console.log("Video uploaded successfully:", uploadResult.url);

      // Update loading state
      toast.loading("Creating lesson in database...", { id: toastId });

      // Now create the lesson with the video URL
      const lessonData = {
        title: newLesson.title.trim(),
        description: newLesson.description.trim(),
        duration: newLesson.duration.trim(),
        videoUrl: uploadResult.url,
        videoFileName: newLesson.videoFile.name,
      };

      console.log("Creating lesson with data:", lessonData);

      const updatedCourse = (await coursesAPI.addLesson(
        selectedCourse._id,
        lessonData
      )) as unknown as Course;

      console.log("Lesson created successfully:", updatedCourse);

      // Update the courses list with the new data
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );

      // Update the selected course
      setSelectedCourse(updatedCourse);

      // Reset the form
      setNewLesson({
        title: "",
        description: "",
        videoFile: null,
        duration: "",
      });
      setShowAddLessonForm(false);

      // Show success message
      toast.success("Lesson added successfully", { id: toastId });
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add lesson",
        { id: toastId }
      );
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      await handleUpdateCourse();
    } else {
      await handleCreateCourse(selectedCourse || {});
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
                onClick={() => {
                  setSelectedCourse(course);
                  setIsEditing(false);
                }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                        setIsEditing(true);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course._id);
                      }}
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
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={selectedCourse?.title || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        title: e.target.value,
                      } as Course)
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
                    value={selectedCourse?.description || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        description: e.target.value,
                      } as Course)
                    }
                    required
                    rows={3}
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
                    value={selectedCourse?.duration || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        duration: e.target.value,
                      } as Course)
                    }
                    required
                    placeholder="e.g., 30 minutes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        videoFile: e.target.files?.[0] || null,
                      } as Course)
                    }
                    required
                    className="mt-1 block w-full"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(false);
                      if (!selectedCourse) {
                        setSelectedCourse(null);
                      }
                    }}
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedCourse.title}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddLessonForm(true);
                    }}
                    className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                {showAddLessonForm && (
                  <form
                    onSubmit={handleAddLesson}
                    className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
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
                          Video File
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            setNewLesson({
                              ...newLesson,
                              videoFile: e.target.files?.[0] || null,
                            })
                          }
                          required
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddLessonForm(false);
                            setNewLesson({
                              title: "",
                              description: "",
                              videoFile: null,
                              duration: "",
                            });
                          }}
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
                  {selectedCourse?.lessons &&
                  selectedCourse.lessons.length > 0 ? (
                    selectedCourse.lessons.map(
                      (lesson: Lesson, index: number) => (
                        <div
                          key={lesson._id || `new-lesson-${index}`}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{lesson.title}</h3>
                            <span className="text-sm text-gray-500">
                              {lesson.duration}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">
                            {lesson.description}
                          </p>
                          {lesson.videoUrl && (
                            <div className="mt-4">
                              <video
                                controls
                                className="w-full rounded-lg"
                                src={lesson.videoUrl}
                              />
                            </div>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-center text-gray-500">
                      No lessons available
                    </p>
                  )}
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
