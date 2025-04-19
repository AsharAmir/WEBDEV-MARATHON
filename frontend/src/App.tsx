import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage.tsx";
import CoursesPage from "./pages/CoursesPage.tsx";
import CourseDetailPage from "./pages/CourseDetailPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import CreateCoursePage from "./pages/CreateCoursePage.tsx";
import LearnPage from "./pages/LearnPage";
import CourseManagement from "./pages/CourseManagement";
import AddLessonPage from "./pages/AddLessonPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:courseId/learn" element={<LearnPage />} />
            <Route
              path="/courses/:courseId/add-lesson"
              element={<AddLessonPage />}
            />
            <Route path="/create-course" element={<CreateCoursePage />} />
            <Route path="/manage-courses" element={<CourseManagement />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
