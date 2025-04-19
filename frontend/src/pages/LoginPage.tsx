import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link
          to="/"
          className="flex items-center justify-center text-3xl font-bold text-blue-600"
        >
          <BookOpen className="h-8 w-8 mr-2" />
          LearnBeyond
        </Link>
        <h2 className="mt-2 text-center text-lg text-gray-600">
          Log in to your account to continue your learning journey
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
