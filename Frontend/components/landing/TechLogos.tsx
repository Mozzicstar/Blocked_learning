"use client";

import { motion } from "framer-motion";

const technologies = [
  "Solana",
  "Ethereum",
  "Next.js",
  "IPFS",
  "Arweave",
  "The Graph",
  "Chainlink",
  "Polygon"
];

export default function TechLogos() {
  return (
    <section className="w-full py-10 bg-[#0B0F1A] border-b border-white/5">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-8">
          Powered by industry leading technologies
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-xl md:text-2xl font-bold text-white/40 hover:text-cyan-400 cursor-default transition-colors"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
