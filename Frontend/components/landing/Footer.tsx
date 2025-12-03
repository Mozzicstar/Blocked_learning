"use client";

import { Twitter, Github, Disc, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#05070e] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              Blocked<span className="text-cyan-400">Learning</span>
            </h3>
            <p className="text-gray-500 leading-relaxed">
              The first decentralized education platform where you own your achievements.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Courses</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Mentorship</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Creators</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Pricing</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Community</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Help Center</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-all">
                <Disc className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2025 BlockedLearning. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-600">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
