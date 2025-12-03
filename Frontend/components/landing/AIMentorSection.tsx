"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  Sparkles,
  User,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AIMentorSection() {
  const [typingStep, setTypingStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#0B0F1A]">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>24/7 Intelligent Support</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Stuck on a Smart Contract? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Ask Your AI Mentor.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Get instant feedback on your code, security audits for your Solana
              programs, and personalized learning paths generated just for you.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4 items-start max-w-md mx-auto lg:mx-0"
            >
              {[
                "Real-time code analysis & debugging",
                "Smart contract security vulnerability checks",
                "Personalized curriculum based on your goals",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Chat Interface Visual */}
          <div className="flex-1 w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-[#111625] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>AI Mentor Active</span>
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-6 flex flex-col gap-6 min-h-[400px]">
                {/* User Message */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="self-end max-w-[85%]"
                >
                  <div className="flex items-end gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                      <User className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tr-sm p-4 text-sm text-cyan-100">
                      <p>
                        How do I prevent re-entrancy attacks in my Solana
                        program?
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* AI Response */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 }}
                  className="self-start max-w-[95%]"
                >
                  <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="bg-[#1A1F2E] border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-300 w-full">
                      <p className="mb-3">
                        In Solana, re-entrancy is less common than in EVM
                        because programs are stateless, but you should still
                        follow the{" "}
                        <span className="text-purple-400 font-mono">
                          Checks-Effects-Interactions
                        </span>{" "}
                        pattern.
                      </p>

                      {/* Code Snippet */}
                      <div className="bg-black/50 rounded-lg p-3 font-mono text-xs border border-white/5 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-2 text-gray-500">
                          <span className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" /> lib.rs
                          </span>
                          <span className="text-[10px]">Rust</span>
                        </div>
                        <code className="block text-gray-300">
                          <span className="text-pink-400">pub fn</span>{" "}
                          <span className="text-yellow-400">withdraw</span>(ctx:
                          Context&lt;Withdraw&gt;, amount: u64) -&gt;
                          Result&lt;()&gt; &#123;
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-gray-500">// 1. Checks</span>
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-cyan-400">require!</span>
                          (ctx.accounts.user.balance &gt;= amount, ...);
                          <br />
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-gray-500">// 2. Effects</span>
                          <br />
                          &nbsp;&nbsp;ctx.accounts.user.balance -= amount;
                          <br />
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-gray-500">
                            // 3. Interactions
                          </span>
                          <br />
                          &nbsp;&nbsp;...
                          <br />
                          &#125;
                        </code>

                        {/* Scanning Effect */}
                        <motion.div
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute left-0 right-0 h-[1px] bg-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
