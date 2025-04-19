import React from "react";
import { useParams, Navigate } from "react-router-dom";
import AddLessonForm from "../components/lessons/AddLessonForm";

const AddLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Redirect if not logged in or not a tutor
  if (!user._id || user.role !== "tutor") {
    return <Navigate to="/login" replace />;
  }

  if (!courseId) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AddLessonForm courseId={courseId} />
    </div>
  );
};

export default AddLessonPage;
