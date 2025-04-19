import React from "react";
import { Navigate } from "react-router-dom";
import CourseModal from "../components/courses/CourseModal";

const CreateCoursePage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.id || user.role !== "tutor") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create New Course
      </h1>
      <CourseModal
        course={{
          id: "",
          title: "",
          description: "",
          thumbnail: "",
          price: 0,
          level: "beginner",
          category: "",
          tutorId: user.id,
          tutorName: user.name,
          tutorAvatar: user.avatar || "",
          rating: 0,
          totalStudents: 0,
          createdAt: "",
          updatedAt: "",
          lessons: [],
          categories: [],
          duration: "",
        }}
        mode="create"
        onClose={() => window.history.back()}
        onSuccess={(newCourse) => {
          window.location.href = `/courses/${newCourse.id}`;
        }}
      />
    </div>
  );
};

export default CreateCoursePage;
