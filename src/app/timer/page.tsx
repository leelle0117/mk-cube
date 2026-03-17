"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SolveRecord {
  id: number;
  time: number;
  date: Date;
  scramble: string;
  penalty?: "+2" | "DNF";
}

const MOVES = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];

function generateScramble(): string {
  const scramble: string[] = [];
  let lastFace = "";
  let secondLastFace = "";

  for (let i = 0; i < 20; i++) {
    let move: string;
    do {
      move = MOVES[Math.floor(Math.random() * MOVES.length)];
    } while (
      move[0] === lastFace ||
      (move[0] === secondLastFace && isOpposite(move[0], lastFace))
    );

    secondLastFace = lastFace;
    lastFace = move[0];
    scramble.push(move);
  }

  return scramble.join(" ");
}

function isOpposite(a: string, b: string): boolean {
  const pairs: Record<string, string> = { R: "L", L: "R", U: "D", D: "U", F: "B", B: "F" };
  return pairs[a] === b;
}

function formatTime(ms: number): string {
  if (ms < 0) return "DNF";
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
  }
  return seconds.toFixed(2);
}

function calcAverage(times: number[], count: number): number | null {
  if (times.length < count) return null;
  const recent = times.slice(-count);
  const sorted = [...recent].sort((a, b) => a - b);
  // Remove best and worst
  const trimmed = sorted.slice(1, -1);
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
}

export default function TimerPage() {
  const [state, setState] = useState<"idle" | "holding" | "ready" | "running" | "stopped">("idle");
  const [time, setTime] = useState(0);
  const [scramble, setScramble] = useState("");
  const [records, setRecords] = useState<SolveRecord[]>([]);
  const [holdStart, setHoldStart] = useState(0);
  const startTimeRef = useRef(0);
  const animFrameRef = useRef(0);
  const holdTimerRef = useRef<NodeJS.Timeout>(undefined);

  // Generate initial scramble
  useEffect(() => {
    setScramble(generateScramble());
    // Load records from localStorage
    const saved = localStorage.getItem("cube-timer-records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecords(parsed.map((r: SolveRecord) => ({ ...r, date: new Date(r.date) })));
      } catch { /* ignore */ }
    }
  }, []);

  // Save records to localStorage
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem("cube-timer-records", JSON.stringify(records));
    }
  }, [records]);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    setState("running");

    const tick = () => {
      setTime(performance.now() - startTimeRef.current);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTimer = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    const finalTime = performance.now() - startTimeRef.current;
    setTime(finalTime);
    setState("stopped");

    const newRecord: SolveRecord = {
      id: Date.now(),
      time: finalTime,
      date: new Date(),
      scramble: scramble,
    };
    setRecords((prev) => [...prev, newRecord]);
    setScramble(generateScramble());
  }, [scramble]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();

      if (state === "running") {
        stopTimer();
        return;
      }

      if (state === "idle" || state === "stopped") {
        setHoldStart(performance.now());
        setState("holding");
        holdTimerRef.current = setTimeout(() => {
          setState("ready");
        }, 300);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }

      if (state === "ready") {
        setTime(0);
        startTimer();
      } else if (state === "holding") {
        setState(time > 0 ? "stopped" : "idle");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [state, startTimer, stopTimer, time]);

  // Touch handler for mobile
  const handleTouchStart = useCallback(() => {
    if (state === "running") {
      stopTimer();
      return;
    }
    if (state === "idle" || state === "stopped") {
      setHoldStart(performance.now());
      setState("holding");
      holdTimerRef.current = setTimeout(() => {
        setState("ready");
      }, 300);
    }
  }, [state, stopTimer]);

  const handleTouchEnd = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (state === "ready") {
      setTime(0);
      startTimer();
    } else if (state === "holding") {
      setState(time > 0 ? "stopped" : "idle");
    }
  }, [state, startTimer, time]);

  const validTimes = records
    .filter((r) => !r.penalty || r.penalty !== "DNF")
    .map((r) => (r.penalty === "+2" ? r.time + 2000 : r.time));

  const best = validTimes.length > 0 ? Math.min(...validTimes) : null;
  const ao5 = calcAverage(validTimes, 5);
  const ao12 = calcAverage(validTimes, 12);
  const ao100 = calcAverage(validTimes, 100);

  const deleteRecord = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const togglePenalty = (id: number, penalty: "+2" | "DNF") => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, penalty: r.penalty === penalty ? undefined : penalty } : r
      )
    );
  };

  const clearAll = () => {
    if (confirm("모든 기록을 삭제하시겠습니까?")) {
      setRecords([]);
      localStorage.removeItem("cube-timer-records");
    }
  };

  const timerColor =
    state === "holding"
      ? "text-[#e94560]"
      : state === "ready"
      ? "text-[#00b894]"
      : state === "running"
      ? "text-white"
      : "text-gray-200";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        <span className="text-2xl mr-2">⏱️</span>
        스피드큐빙 타이머
      </h1>

      {/* Scramble */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-4 mb-6 text-center">
        <div className="text-xs text-gray-500 mb-2">스크램블</div>
        <div className="font-mono text-lg text-[#e94560] tracking-wider">
          {scramble}
        </div>
        <button
          onClick={() => setScramble(generateScramble())}
          className="mt-2 text-xs text-gray-500 hover:text-white transition-colors"
        >
          새 스크램블 생성
        </button>
      </div>

      {/* Timer Display */}
      <div
        className="bg-card-bg border border-card-border rounded-2xl p-12 mb-6 text-center select-none cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`font-mono text-7xl md:text-8xl font-bold transition-colors ${timerColor}`}>
          {formatTime(time)}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          {state === "idle" && "스페이스바를 길게 누르세요 (모바일: 화면 터치)"}
          {state === "holding" && "계속 누르고 계세요..."}
          {state === "ready" && "놓으면 시작!"}
          {state === "running" && "아무 키나 눌러서 정지"}
          {state === "stopped" && "스페이스바로 다시 시작"}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "솔브", value: records.length.toString() },
          { label: "Best", value: best !== null ? formatTime(best) : "-" },
          { label: "Ao5", value: ao5 !== null ? formatTime(ao5) : "-" },
          { label: "Ao12", value: ao12 !== null ? formatTime(ao12) : "-" },
          { label: "Ao100", value: ao100 !== null ? formatTime(ao100) : "-" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card-bg border border-card-border rounded-xl p-3 text-center"
          >
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="font-mono font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Records List */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-card-border">
          <h3 className="font-semibold text-white">기록</h3>
          {records.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-[#e94560] transition-colors"
            >
              전체 삭제
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            아직 기록이 없습니다. 스페이스바를 눌러 시작하세요!
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-xs border-b border-card-border">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">시간</th>
                  <th className="px-4 py-2 text-left hidden md:table-cell">스크램블</th>
                  <th className="px-4 py-2 text-right">액션</th>
                </tr>
              </thead>
              <tbody>
                {[...records].reverse().map((record, i) => (
                  <tr
                    key={record.id}
                    className="border-b border-card-border/50 hover:bg-white/5"
                  >
                    <td className="px-4 py-2 text-gray-500">{records.length - i}</td>
                    <td className="px-4 py-2 font-mono font-bold text-white">
                      {record.penalty === "DNF"
                        ? "DNF"
                        : record.penalty === "+2"
                        ? `${formatTime(record.time + 2000)}+`
                        : formatTime(record.time)}
                    </td>
                    <td className="px-4 py-2 text-gray-500 font-mono text-xs hidden md:table-cell truncate max-w-xs">
                      {record.scramble}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePenalty(record.id, "+2")}
                          className={`px-2 py-0.5 rounded text-xs transition-colors ${
                            record.penalty === "+2"
                              ? "bg-[#fdcb6e]/20 text-[#fdcb6e]"
                              : "text-gray-600 hover:text-gray-400"
                          }`}
                        >
                          +2
                        </button>
                        <button
                          onClick={() => togglePenalty(record.id, "DNF")}
                          className={`px-2 py-0.5 rounded text-xs transition-colors ${
                            record.penalty === "DNF"
                              ? "bg-[#e94560]/20 text-[#e94560]"
                              : "text-gray-600 hover:text-gray-400"
                          }`}
                        >
                          DNF
                        </button>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="px-2 py-0.5 rounded text-xs text-gray-600 hover:text-[#e94560] transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Usage Guide */}
      <div className="mt-6 bg-card-bg border border-card-border rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-3">사용법</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-medium mb-2">타이머</h4>
            <ul className="space-y-1">
              <li>• <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">Space</kbd> 길게 누르기 → 초록색 되면 놓기 → 시작</li>
              <li>• <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">Space</kbd> 다시 누르기 → 정지</li>
              <li>• 모바일: 화면 터치로 동일하게 작동</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">기록 관리</h4>
            <ul className="space-y-1">
              <li>• <strong>+2</strong>: 2초 페널티 (미스얼라인먼트)</li>
              <li>• <strong>DNF</strong>: Did Not Finish (미완성)</li>
              <li>• <strong>Ao5/Ao12</strong>: 최근 5/12개 중 최고/최저 제외 평균</li>
              <li>• 기록은 브라우저에 자동 저장됩니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
