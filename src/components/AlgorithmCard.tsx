"use client";

import { useState } from "react";
import { SingleFace } from "./CubeVisualizer";
import type { Algorithm } from "@/data/types";

interface AlgorithmCardProps {
  algorithm: Algorithm;
  index?: number;
}

export default function AlgorithmCard({ algorithm, index }: AlgorithmCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyAlgorithm = () => {
    navigator.clipboard.writeText(algorithm.algorithm);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5 hover:border-accent/30 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {index !== undefined && (
              <span className="text-xs font-mono bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                #{index + 1}
              </span>
            )}
            <h3 className="font-semibold text-white">{algorithm.name}</h3>
            {algorithm.probability && (
              <span className="text-xs text-gray-500">
                ({algorithm.probability})
              </span>
            )}
          </div>

          {/* Algorithm notation */}
          <div className="algorithm-text mb-3 flex items-center gap-2">
            <code className="flex-1">{algorithm.algorithm}</code>
            <button
              onClick={copyAlgorithm}
              className="shrink-0 text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
              title="복사"
            >
              {copied ? "✓" : "📋"}
            </button>
          </div>

          {/* Move count */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span>무브 수: {algorithm.moveCount}</span>
            {algorithm.fingerTrick && (
              <span className="text-success">핑거트릭 가능</span>
            )}
          </div>

          {/* Description */}
          {algorithm.description && (
            <p className="text-sm text-gray-400 leading-relaxed">
              {algorithm.description}
            </p>
          )}

          {/* Tips - expandable */}
          {algorithm.tips && algorithm.tips.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
              >
                <span>{expanded ? "▼" : "▶"}</span>
                팁 & 트릭 ({algorithm.tips.length})
              </button>
              {expanded && (
                <ul className="mt-2 space-y-1">
                  {algorithm.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Cube face visualization */}
        {algorithm.facePattern && (
          <div className="shrink-0">
            <SingleFace
              colors={algorithm.facePattern}
              size={64}
              label={algorithm.patternLabel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
