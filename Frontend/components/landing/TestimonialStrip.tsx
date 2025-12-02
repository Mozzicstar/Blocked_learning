"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Smart Contract Dev",
    content: "BlockedLearning helped me transition from Web2 to Web3 in just 4 weeks. The AI mentor is a game changer.",
    avatar: "AC"
  },
  {
    name: "Sarah Jones",
    role: "NFT Artist",
    content: "Finally, a platform where I own my learning credentials. The on-chain verification helped me land my first DAO role.",
    avatar: "SJ"
  },
  {
    name: "Mike Ross",
    role: "DeFi Strategist",
    content: "The quality of content here is unmatched. Plus, earning crypto while learning keeps me motivated.",
    avatar: "MR"
  }
];

export default function TestimonialStrip() {
  return (
    <section className="w-full py-24 bg-[#0B0F1A] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Builders
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative group hover:bg-white/10 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10 group-hover:text-cyan-500/20 transition-colors" />
              
              <div className="flex items-center gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-cyan-500/30">
                  <AvatarFallback className="bg-cyan-900 text-cyan-200">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-cyan-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
