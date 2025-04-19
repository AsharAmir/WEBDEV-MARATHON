import React from "react";
import CourseList from "../components/courses/CourseList";

const CoursesPage: React.FC = () => {
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <CourseList />
    </div>
  );
};

export default CoursesPage;
