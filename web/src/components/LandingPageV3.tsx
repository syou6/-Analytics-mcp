'use client';

import { useState, useEffect } from 'react';
import { Github, BarChart3, Zap, TrendingUp, Code2, Star, Users, CheckCircle, ArrowRight, Sparkles, Brain, Briefcase, Trophy, Clock, Shield, Globe, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import PortfolioPreview from './PortfolioPreview';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/translations/landing';

interface LandingPageV3Props {
  onSignIn: () => void;
}

export default function LandingPageV3({ onSignIn }: LandingPageV3Props) {
  const [isDark, setIsDark] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isAnnual, setIsAnnual] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const t = translations[language];

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

  // Price calculations
  const prices = {
    starter: { monthly: 9.8, annual: 7.8 },
    basic: { monthly: 9.8, annual: 7.8 },
    professional: { monthly: 9.8, annual: 7.8 },
    enterprise: { monthly: 99, annual: 99 }
  };

  const jpyRates = {
    starter: { monthly: 1470, annual: 1170 },
    basic: { monthly: 1470, annual: 1170 },
    professional: { monthly: 1470, annual: 1170 },
    enterprise: { monthly: 14850, annual: 14850 }
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
                ⭐ {t.nav.githubStars}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => changeLanguage(language === 'en' ? 'ja' : 'en')}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} flex items-center gap-1`}
              >
                <Languages className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'en' ? 'JP' : 'EN'}</span>
              </button>
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
                {t.nav.startBuilding}
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
              {t.hero.tagline}
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {t.hero.title}
            <br />
            {t.hero.subtitle}
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className={`text-xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {t.hero.description}
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
              {t.hero.ctaMain}
            </button>
            <button className={`px-8 py-4 rounded-lg text-lg font-semibold border-2 ${isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
              {t.hero.ctaSecondary}
            </button>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t.hero.noCreditCard}
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              {t.hero.quickSetup}
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-purple-500 mr-2" />
              {t.hero.githubOAuth}
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
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.trust.commits}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl font-bold text-purple-600">500K+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.trust.pullRequests}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl font-bold text-green-600">15K+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.trust.developers}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl font-bold text-orange-600">99.9%</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.trust.uptime}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features - Portfolio Focus */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t.features.title}</h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.features.subtitle}
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
            <h3 className="text-xl font-semibold mb-2">{t.features.portfolio.title}</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.features.portfolio.description}
            </p>
            <div className="mt-4 flex items-center text-blue-600">
              <span className="text-sm font-medium">{t.features.portfolio.cta}</span>
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
            <h3 className="text-xl font-semibold mb-2">{t.features.coaching.title}</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.features.coaching.description}
            </p>
            <div className="mt-4 flex items-center text-purple-600">
              <span className="text-sm font-medium">{t.features.coaching.cta}</span>
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
            <h3 className="text-xl font-semibold mb-2">{t.features.career.title}</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.features.career.description}
            </p>
            <div className="mt-4 flex items-center text-green-600">
              <span className="text-sm font-medium">{t.features.career.cta}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <PortfolioPreview isDark={isDark} language={language} />

      {/* Pricing with Decoy Effect */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.pricing.title}</h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              {t.pricing.subtitle}
            </p>
            <div className="inline-flex items-center p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-md transition-all ${!isAnnual ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}`}
              >
                {t.pricing.monthly}
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-md transition-all ${isAnnual ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}`}
              >
                {t.pricing.annual}
                <span className="ml-2 text-xs text-green-600">20% {t.pricing.save}</span>
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
              <h3 className="text-lg font-semibold mb-2">{t.pricing.plans.starter.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? prices.starter.annual : prices.starter.monthly}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.pricing.perMonth}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'ja' ? `約¥${isAnnual ? jpyRates.starter.annual : jpyRates.starter.monthly} (税込)` : ''}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {t.pricing.plans.starter.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                {t.pricing.selectPlan}
              </button>
            </motion.div>

            {/* Basic Plan */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} ${selectedPlan === 'basic' ? 'ring-2 ring-blue-600' : ''}`}
              onClick={() => setSelectedPlan('basic')}
            >
              <h3 className="text-lg font-semibold mb-2">{t.pricing.plans.basic.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? prices.basic.annual : prices.basic.monthly}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.pricing.perMonth}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'ja' ? `約¥${isAnnual ? jpyRates.basic.annual : jpyRates.basic.monthly} (税込)` : ''}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {t.pricing.plans.basic.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                {t.pricing.selectPlan}
              </button>
            </motion.div>

            {/* Professional Plan */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl p-6 ${isDark ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} ring-2 ring-blue-600 relative`}
              onClick={() => setSelectedPlan('professional')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  {t.pricing.bestValue}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.pricing.plans.professional.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${isAnnual ? prices.professional.annual : prices.professional.monthly}</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t.pricing.perMonth}</span>
                <div className="text-xs text-gray-300 mt-1">
                  {language === 'ja' ? `約¥${isAnnual ? jpyRates.professional.annual : jpyRates.professional.monthly} (税込)` : ''}
                </div>
                {isAnnual && <span className="text-green-600 text-sm">{language === 'en' ? 'Save $24/year' : '年間$24お得'}</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {t.pricing.plans.professional.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onSignIn}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                {t.pricing.startFreeTrial}
              </button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} ${selectedPlan === 'enterprise' ? 'ring-2 ring-blue-600' : ''}`}
              onClick={() => setSelectedPlan('enterprise')}
            >
              <h3 className="text-lg font-semibold mb-2">{t.pricing.plans.enterprise.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${prices.enterprise.monthly}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.pricing.perMonth}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'ja' ? `約¥${jpyRates.enterprise.monthly} (税込)` : ''}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {t.pricing.plans.enterprise.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                {t.pricing.contactSales}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t.testimonials.title}</h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.testimonials.reviews.map((review, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <img src={`https://i.pravatar.cc/150?img=${i + 1}`} alt={review.name} className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.role}</div>
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                "{review.text}"
              </p>
              <div className="flex items-center">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            {t.cta.title}
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.cta.subtitle}
          </p>
          <button
            onClick={onSignIn}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            {t.cta.button}
          </button>
          <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.cta.terms}
          </p>
        </div>
      </section>
    </div>
  );
}