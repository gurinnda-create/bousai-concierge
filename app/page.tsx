"use client";

import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';
import { UserInput, BousaiItem } from './types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [input, setInput] = useState<UserInput | null>(null);
  const [items, setItems] = useState<BousaiItem[]>([]);

  const handleSubmit = async (userInput: UserInput) => {
    setInput(userInput);
    setStep('loading');

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInput),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${res.status}`);
      }

      const data = await res.json();
      setItems(data);
      setStep('result');
    } catch (e: any) {
      console.error("Failed to get recommendations", e);
      alert(`エラーが発生しました: ${e.message}`);
      setStep('form');
    }
  };

  const handleRestart = () => {
    setStep('form');
    setInput(null);
    setItems([]);
  };

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-400 via-red-400 to-orange-500"
          >
            <InputForm onSubmit={handleSubmit} />
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-500"
          >
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mb-8" />
            <h2 className="text-2xl font-bold text-white mb-2">AIが分析中...</h2>
            <p className="text-white/80">
              {input?.familySize}人家族に最適な防災グッズを選定しています
            </p>
          </motion.div>
        )}

        {step === 'result' && input && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ResultView
              items={items}
              input={input}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
