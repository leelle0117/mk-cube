"use client";

import { useState } from "react";
import Link from "next/link";
import AlgorithmCard from "./AlgorithmCard";
import type { Level } from "@/data/types";

interface LevelPageProps {
  level: Level;
}

export default function LevelPage({ level }: LevelPageProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const currentStep = level.steps[activeStep];

  // Filter algorithms by search
  const filteredAlgorithms = searchQuery
    ? currentStep.algorithms.filter(
        (alg) =>
          alg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alg.algorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alg.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentStep.algorithms;

  // Count total algorithms
  const totalAlgorithms = level.steps.reduce(
    (sum, step) => sum + step.algorithms.length,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-accent transition-colors mb-4 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          홈으로
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: level.color }}>
              {level.title}
            </h1>
            <p className="text-gray-400 max-w-2xl">{level.description}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-card-bg border border-card-border rounded-xl px-4 py-2 text-center">
              <div className="text-gray-500">목표 시간</div>
              <div className="font-bold text-white">{level.targetTime}</div>
            </div>
            <div className="bg-card-bg border border-card-border rounded-xl px-4 py-2 text-center">
              <div className="text-gray-500">알고리즘</div>
              <div className="font-bold text-white">{totalAlgorithms}개</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {level.steps.map((step, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveStep(i);
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeStep === i
                  ? "text-white shadow-lg"
                  : "bg-card-bg border border-card-border text-gray-400 hover:text-white hover:border-gray-600"
              }`}
              style={
                activeStep === i
                  ? { backgroundColor: level.color }
                  : undefined
              }
            >
              <span className="mr-1.5 opacity-70">Step {i + 1}</span>
              {step.title.replace(/Step \d+:\s*/, "")}
            </button>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-6">
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">{currentStep.title}</h2>
          <p className="text-gray-400 leading-relaxed">{currentStep.description}</p>

          {currentStep.tips && currentStep.tips.length > 0 && (
            <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-xl">
              <h4 className="text-sm font-semibold text-accent mb-2">핵심 팁</h4>
              <ul className="space-y-1">
                {currentStep.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search */}
        {currentStep.algorithms.length > 3 && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="알고리즘 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-card-bg border border-card-border rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        )}

        {/* Algorithms */}
        <div className="space-y-4">
          {filteredAlgorithms.map((alg, i) => (
            <AlgorithmCard key={i} algorithm={alg} index={i} />
          ))}
          {filteredAlgorithms.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Navigation between steps */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-card-border">
        <button
          onClick={() => {
            setActiveStep(Math.max(0, activeStep - 1));
            setSearchQuery("");
          }}
          disabled={activeStep === 0}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-card-bg border border-card-border text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← 이전 단계
        </button>
        <span className="text-sm text-gray-600">
          {activeStep + 1} / {level.steps.length}
        </span>
        <button
          onClick={() => {
            setActiveStep(Math.min(level.steps.length - 1, activeStep + 1));
            setSearchQuery("");
          }}
          disabled={activeStep === level.steps.length - 1}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-card-bg border border-card-border text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          다음 단계 →
        </button>
      </div>

      {/* Level navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        {level.id > 1 && (
          <Link
            href={`/level/${level.id - 1}`}
            className="text-sm text-gray-500 hover:text-accent transition-colors"
          >
            ← 이전 레벨
          </Link>
        )}
        {level.id < 4 && (
          <Link
            href={`/level/${level.id + 1}`}
            className="text-sm text-gray-500 hover:text-accent transition-colors"
          >
            다음 레벨 →
          </Link>
        )}
      </div>
    </div>
  );
}
