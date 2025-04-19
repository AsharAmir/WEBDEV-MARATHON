import React from "react";

const AboutPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 text-center">
          About EdTech
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              At EdTech, we believe that education should be accessible,
              engaging, and effective for everyone. Our mission is to transform
              the way people learn by leveraging cutting-edge technology and
              innovative teaching methods to create an immersive learning
              experience.
            </p>

            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              What Sets Us Apart
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  Interactive Learning
                </h3>
                <p className="text-gray-700">
                  Our platform offers interactive courses that engage students
                  through multimedia content, quizzes, and hands-on projects.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  Expert Instructors
                </h3>
                <p className="text-gray-700">
                  Learn from industry professionals and experienced educators
                  who are passionate about sharing their knowledge.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  Flexible Learning
                </h3>
                <p className="text-gray-700">
                  Study at your own pace with our flexible course structure that
                  adapts to your schedule and learning style.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  Community Support
                </h3>
                <p className="text-gray-700">
                  Join a vibrant community of learners and educators who support
                  each other's growth and success.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Founded in 2024, EdTech emerged from a simple yet powerful idea:
              to make quality education accessible to everyone, everywhere. What
              started as a small team of passionate educators and technologists
              has grown into a global platform serving thousands of learners
              worldwide.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, we continue to innovate and expand our offerings, always
              keeping our core mission in focus: empowering individuals through
              education and technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
