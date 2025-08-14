'use client';

import { motion } from 'framer-motion';
import { Github, Star, GitFork, Code2, Activity, TrendingUp } from 'lucide-react';

interface PortfolioPreviewProps {
  isDark: boolean;
}

export default function PortfolioPreview({ isDark }: PortfolioPreviewProps) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Transform Your GitHub Into a Stunning Portfolio
        </h2>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Automatically generate a professional portfolio that showcases your best work
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Portfolio Preview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          {/* Portfolio Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Github className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">John Developer</h3>
                <p className="opacity-90">Full Stack Engineer</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span>📍 San Francisco</span>
                  <span>🔗 github.com/johndoe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 grid grid-cols-3 gap-4">
            <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-blue-600">1.2k</div>
              <div className="text-sm text-gray-500">Commits</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-500">PRs Merged</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-500">Stars Earned</div>
            </div>
          </div>

          {/* Top Projects */}
          <div className="p-6 border-t">
            <h4 className="font-semibold mb-4">Featured Projects</h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">awesome-react-app</div>
                    <div className="text-sm text-gray-500">A modern React application with TypeScript</div>
                    <div className="flex items-center space-x-3 mt-2 text-sm">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" /> 234
                      </span>
                      <span className="flex items-center">
                        <GitFork className="w-4 h-4 mr-1" /> 45
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">TypeScript</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">ml-pipeline</div>
                    <div className="text-sm text-gray-500">Scalable machine learning pipeline</div>
                    <div className="flex items-center space-x-3 mt-2 text-sm">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" /> 156
                      </span>
                      <span className="flex items-center">
                        <GitFork className="w-4 h-4 mr-1" /> 23
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Python</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold mb-2">Auto-Generated from GitHub</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Your portfolio updates automatically as you code. No manual updates needed.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold mb-2">Rich Activity Visualizations</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Beautiful charts and graphs that showcase your coding patterns and growth.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold mb-2">Skill & Growth Tracking</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Highlight your expertise and show continuous improvement over time.
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} border border-blue-600/20`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">Ready to impress recruiters?</h4>
                <p className="text-sm opacity-90">Get your portfolio in 5 minutes</p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}