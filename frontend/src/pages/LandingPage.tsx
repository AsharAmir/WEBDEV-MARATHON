import React from "react";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PopularCoursesSection from "../components/landing/PopularCoursesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CallToActionSection from "../components/landing/CallToActionSection";

const LandingPage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <PopularCoursesSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
};

export default LandingPage;
