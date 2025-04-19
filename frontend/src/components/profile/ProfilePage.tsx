import React, { useState, useEffect } from "react";
import { User, Mail, Edit2, Save } from "lucide-react";
import { authAPI } from "../../services/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor";
  avatar?: string;
  bio?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setProfile(user);
          setFormData({
            name: user.name,
            email: user.email,
            bio: user.bio || "",
          });
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      // Here you would typically call an API to update the profile
      // For now, we'll just update the local storage
      if (profile) {
        const updatedProfile: UserProfile = {
          ...profile,
          name: formData.name,
          bio: formData.bio,
        };
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isEditing ? (
              <div className="flex items-center">
                <Save className="w-5 h-5 mr-1" />
                Save Changes
              </div>
            ) : (
              <div className="flex items-center">
                <Edit2 className="w-5 h-5 mr-1" />
                Edit Profile
              </div>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  profile.name
                )}
              </h3>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900">{profile.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">
                  {profile.bio || "No bio provided"}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
