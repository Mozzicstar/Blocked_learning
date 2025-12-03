"use client";

import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import TechLogos from "@/components/landing/TechLogos";
import TestimonialStrip from "@/components/landing/TestimonialStrip";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import AIMentorSection from "@/components/landing/AIMentorSection";
import FloatingStats from "@/components/landing/FloatingStats";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white selection:bg-cyan-500/30 mx-auto w-full">
      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white">
              B
            </div>
            <span className="text-xl font-bold tracking-tight">
              Blocked<span className="text-cyan-400">Learning</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Courses
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Mentorship
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Creators
            </a>
          </div>

          <button className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
            Launch App
          </button>
        </div>
      </nav>

      <Hero />
      <TechLogos />
      <FeatureGrid />
      <FloatingStats />
      <AIMentorSection />
      <TestimonialStrip />
      <CTA />
      <Footer />
    </main>
  );
}
