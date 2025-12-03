"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Plasma from "@/components/Plasma";

export default function CTA() {
  return (
    <section className="relative w-full py-32 overflow-hidden bg-[#0B0F1A] flex items-center justify-center">
      {/* Background Plasma */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50">
        <Plasma />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto p-12 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-cyan-500/10 text-cyan-400">
            <Rocket className="w-6 h-6" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to Start Your Journey?
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers and creators building the future of the internet. 
            Connect your wallet and start learning today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-10 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-10 text-lg border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105"
            >
              Become a Creator
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
