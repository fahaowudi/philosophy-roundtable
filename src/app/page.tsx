"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PhilosophersShowcase } from "@/components/landing/PhilosophersShowcase";
import { TopicsSection } from "@/components/landing/TopicsSection";
import { Footer } from "@/components/landing/Footer";
import { UpdateNotice } from "@/components/UpdateNotice";

export default function LandingPage() {
  useEffect(() => {
    document.body.classList.add("landing-bg");
    return () => document.body.classList.remove("landing-bg");
  }, []);

  return (
    <div className="min-h-dvh font-sans">
      <UpdateNotice />
      <HeroSection />
      <HowItWorks />
      <PhilosophersShowcase />
      <TopicsSection />
      <Footer />
    </div>
  );
}
