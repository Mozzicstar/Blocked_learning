"use client";

import { motion } from "framer-motion";
import { Bot, ShieldCheck, Coins, UserCircle, FileCode, Globe } from "lucide-react";
import Aurora from "@/components/Aurora";

const features = [
  {
    icon: Bot,
    title: "AI-Assisted Learning",
    description: "Get real-time help from our AI mentor, CheckMate, trained on thousands of smart contracts.",
    color: "text-cyan-400",
  },
  
  {
    icon: ShieldCheck,
    title: "On-Chain Validation",
    description: "Every course completion is verified and stored on the blockchain as immutable proof of skill.",
    color: "text-purple-400",
  },
  {
    icon: Coins,
    title: "Earn While You Learn",
    description: "Creators earn crypto directly for their content, and learners get rewarded for progress.",
    color: "text-yellow-400",
  },
  {
    icon: UserCircle,
    title: "Decentralized Profile",
    description: "Build your on-chain resume. Your achievements belong to you, not a centralized platform.",
    color: "text-pink-400",
  },
  {
    icon: FileCode,
    title: "Smart Contract Audits",
    description: "Learn to write secure code with automated auditing tools built right into the platform.",
    color: "text-green-400",
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    description: "Access courses from top developers worldwide without geographical restrictions.",
    color: "text-blue-400",
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative w-full py-24 bg-[#0B0F1A] overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
        <Aurora
          colorStops={["#00D5FF", "#6C2EFF", "#00D5FF"]}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Why BlockedLearning?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            We combine the power of AI mentorship with the trust of blockchain technology to create the ultimate learning environment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
            >
              <div className={`mb-6 p-3 rounded-lg bg-white/5 w-fit ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
