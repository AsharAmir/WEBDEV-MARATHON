import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import TutorDashboard from "../pages/TutorDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {user.role === "tutor" ? <TutorDashboard /> : <StudentDashboard />}
    </div>
  );
};

export default DashboardPage;
