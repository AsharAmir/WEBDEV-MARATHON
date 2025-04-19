import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authAPI.logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
    >
      <LogOut className="mr-2 h-5 w-5" />
      Sign Out
    </button>
  );
};

export default SignOutButton;
