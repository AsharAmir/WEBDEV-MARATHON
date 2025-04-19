"use client";

import SimpleHero from "@/components/landing/SimpleHero";
import SimpleFeatures from "@/components/landing/SimpleFeatures";
import SimpleStats from "@/components/landing/SimpleStats";
import SimpleNavbar from "@/components/landing/SimpleNavbar";

const LandingPage = () => {
  return (
    <div className="bg-gray-50">
      <SimpleNavbar />

      {/* Hero Section */}
      <section className="relative">
        <SimpleHero />
      </section>

      {/* Features Section */}
      <section id="features">
        <SimpleFeatures />
      </section>

      {/* Stats Section */}
      <section id="stats">
        <SimpleStats />
      </section>
    </div>
  );
};

export default LandingPage;
