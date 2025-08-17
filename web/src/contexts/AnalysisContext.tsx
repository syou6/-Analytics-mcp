'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BrandingAnalysis {
  username: string;
  score: number;
  activeLevel: string;
  strengths: Array<{ title: string; description: string; score: number }>;
  weaknesses: Array<{ title: string; description: string; improvement: string }>;
  recommendations: string[];
  timestamp: number;
}

interface ResumeData {
  username: string;
  content: string;
  skills: string[];
  timestamp: number;
}

interface CodeValueData {
  username: string;
  totalValue: number;
  breakdown: {
    complexity: number;
    experience: number;
    activity: number;
    quality: number;
  };
  details: any;
  timestamp: number;
}

interface AnalysisContextType {
  // 個人ブランディング分析
  brandingAnalysis: BrandingAnalysis | null;
  setBrandingAnalysis: (data: BrandingAnalysis | null) => void;
  
  // AI履歴書
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  
  // コード資産価値
  codeValueData: CodeValueData | null;
  setCodeValueData: (data: CodeValueData | null) => void;
  
  // キャッシュをクリア
  clearCache: () => void;
  
  // データが古いかチェック（1時間以上経過）
  isDataStale: (timestamp: number) => boolean;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const CACHE_DURATION = 60 * 60 * 1000; // 1時間

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [brandingAnalysis, setBrandingAnalysis] = useState<BrandingAnalysis | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [codeValueData, setCodeValueData] = useState<CodeValueData | null>(null);

  const clearCache = () => {
    setBrandingAnalysis(null);
    setResumeData(null);
    setCodeValueData(null);
  };

  const isDataStale = (timestamp: number) => {
    return Date.now() - timestamp > CACHE_DURATION;
  };

  return (
    <AnalysisContext.Provider
      value={{
        brandingAnalysis,
        setBrandingAnalysis,
        resumeData,
        setResumeData,
        codeValueData,
        setCodeValueData,
        clearCache,
        isDataStale,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}