'use client';

import { useState, useEffect } from 'react';
import { Github, BarChart3, Zap, TrendingUp, Code2, Star, Users, CheckCircle, ArrowRight, Sparkles, Brain, Briefcase, Trophy, Clock, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import PortfolioPreview from './PortfolioPreview';

interface LandingPageV2Props {
  onSignIn: () => void;
}

export default function LandingPageV2({ onSignIn }: LandingPageV2Props) {
  const [isDark, setIsDark] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm sticky top-0 z-50 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl">GitVue</span>
              <span className="ml-4 px-2 py-1 bg-blue-600/10 text-blue-600 text-xs rounded-full">
                ⭐ 2.4k GitHub Stars
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {isDark ? '🌞' : '🌙'}
              </button>
              <button
                onClick={onSignIn}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
              >
                Start Building Your Portfolio
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600 border border-blue-600/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Turn Your Coding Time Into Career Growth
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Build Your Developer Portfolio
            <br />
            While You Code
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className={`text-xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            GitVue transforms your GitHub activity into career-advancing insights and 
            a stunning portfolio - automatically. Get AI-powered coaching and showcase 
            your coding journey to recruiters.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={onSignIn}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              <Github className="mr-2" />
              Start Building Your Portfolio
            </button>
            <button className={`px-8 py-4 rounded-lg text-lg font-semibold border-2 ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
              See Live Demo
            </button>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              5-minute setup
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-purple-500 mr-2" />
              GitHub OAuth only
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Indicators */}
      <section className={`py-12 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl font-bold text-blue-600">2.4M+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Commits Analyzed</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl font-bold text-purple-600">500K+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pull Requests</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl font-bold text-green-600">15K+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Developers</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl font-bold text-orange-600">99.9%</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features - Portfolio Focus */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Career Growth Platform</h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            More than analytics - it's your personal coding coach and portfolio builder
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Auto Portfolio Generation</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Transform your GitHub activity into a stunning developer portfolio. 
              Perfect for job hunting and client acquisition.
            </p>
            <div className="mt-4 flex items-center text-blue-600">
              <span className="text-sm font-medium">See examples</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Coaching Insights</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Get personalized productivity tips and skill development recommendations 
              based on your coding patterns.
            </p>
            <div className="mt-4 flex items-center text-purple-600">
              <span className="text-sm font-medium">Learn more</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Career Growth Tracking</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor your skill development, set SMART goals, and track your 
              progress toward career milestones.
            </p>
            <div className="mt-4 flex items-center text-green-600">
              <span className="text-sm font-medium">View metrics</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <PortfolioPreview isDark={isDark} />

      {/* Pricing with Decoy Effect */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Choose the plan that fits your career goals
            </p>
            <div className="inline-flex items-center p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-md transition-all ${!isAnnual ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-md transition-all ${isAnnual ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}`}
              >
                Annual
                <span className="ml-2 text-xs text-green-600">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Starter Plan */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} ${selectedPlan === 'starter' ? 'ring-2 ring-blue-600' : ''}`}
              onClick={() => setSelectedPlan('starter')}
            >
              <h3 className="text-lg font-semibold mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? '7.8' : '9.8'}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/mo</span>
                <div className="text-xs text-gray-500 mt-1">約¥{isAnnual ? '1,170' : '1,470'} (税込)</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">1 Project</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Basic Analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">7-day History</span>
                </li>
              </ul>
              <button className={`w-full py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                Select Plan
              </button>
            </motion.div>

            {/* Decoy Plan */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} ${selectedPlan === 'basic' ? 'ring-2 ring-blue-600' : ''}`}
              onClick={() => setSelectedPlan('basic')}
            >
              <h3 className="text-lg font-semibold mb-2">Basic</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? '7.8' : '9.8'}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/mo</span>
                <div className="text-xs text-gray-500 mt-1">約¥{isAnnual ? '1,170' : '1,470'} (税込)</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">3 Projects</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Basic Analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">30-day History</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Email Reports</span>
                </li>
              </ul>
              <button className={`w-full py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                Select Plan
              </button>
            </motion.div>

            {/* Target Plan - Professional */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl p-6 ${isDark ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} ring-2 ring-blue-600 relative`}
              onClick={() => setSelectedPlan('professional')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  BEST VALUE
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? '7.8' : '9.8'}</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                <div className="text-xs text-gray-300 mt-1">約¥{isAnnual ? '1,170' : '1,470'} (税込)</div>
                {isAnnual && <span className="text-green-600 text-sm">Save $24/year</span>}
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">10 Projects</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">AI Coaching</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">Portfolio Generator</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">Unlimited History</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">Priority Support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">API Access</span>
                </li>
              </ul>
              <button 
                onClick={onSignIn}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Start Free Trial
              </button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} ${selectedPlan === 'enterprise' ? 'ring-2 ring-blue-600' : ''}`}
              onClick={() => setSelectedPlan('enterprise')}
            >
              <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$99</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/mo</span>
                <div className="text-xs text-gray-500 mt-1">約¥14,850 (税込)</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Unlimited Projects</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Custom Integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Team Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">SLA Support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">SSO/SAML</span>
                </li>
              </ul>
              <button className={`w-full py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Loved by Developers Worldwide</h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of developers advancing their careers with GitVue
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center mb-4">
              <img src="https://i.pravatar.cc/150?img=1" alt="Sarah Chen" className="w-12 h-12 rounded-full mr-3" />
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-gray-500">Senior Developer at Meta</div>
              </div>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              "GitVue's portfolio generator helped me land my dream job. The AI insights 
              showed me exactly where to improve my coding habits."
            </p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center mb-4">
              <img src="https://i.pravatar.cc/150?img=2" alt="Mike Johnson" className="w-12 h-12 rounded-full mr-3" />
              <div>
                <div className="font-semibold">Mike Johnson</div>
                <div className="text-sm text-gray-500">Full Stack Developer</div>
              </div>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              "The AI coaching feature is like having a senior developer mentor. 
              My productivity increased by 40% in just 2 months."
            </p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center mb-4">
              <img src="https://i.pravatar.cc/150?img=3" alt="Lisa Park" className="w-12 h-12 rounded-full mr-3" />
              <div>
                <div className="font-semibold">Lisa Park</div>
                <div className="text-sm text-gray-500">Freelance Developer</div>
              </div>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              "Best $9.8 I spend each month. The portfolio alone has gotten me 
              3 new clients. ROI is incredible!"
            </p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Accelerate Your Career?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join 15,000+ developers using GitVue to showcase their work and grow their careers
          </p>
          <button
            onClick={onSignIn}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Free Trial Now
          </button>
          <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No credit card required • 5-minute setup • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}