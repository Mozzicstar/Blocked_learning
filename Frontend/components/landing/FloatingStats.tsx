"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import FloatingLines from "@/components/FloatingLines";

const stats = [
  {
    label: "Active Learners",
    value: 15000,
    suffix: "+",
    prefix: "",
  },
  {
    label: "SOL Earned by Creators",
    value: 1200,
    suffix: "",
    prefix: "+",
  },
  {
    label: "Blockchain Courses",
    value: 47,
    suffix: "+",
    prefix: "",
  },
  {
    label: "Certificates Issued",
    value: 8500,
    suffix: "",
    prefix: "",
  },
];

export default function FloatingStats() {
  return (
    <section className="relative w-full py-20 bg-[#0B0F1A] overflow-hidden border-y border-white/5">
      {/* Background Floating Lines */}
      {/* <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
        <FloatingLines />
      </div> */}
      {/* Note: FloatingLines might be heavy or need specific props. If it fails, we can comment it out or adjust. */}
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-cyan-500/30 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-2 font-mono">
                {stat.prefix}
                <CountUp end={stat.value} duration={2.5} separator="," />
                {stat.suffix}
              </div>
              <div className="text-sm md:text-base text-cyan-400 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
