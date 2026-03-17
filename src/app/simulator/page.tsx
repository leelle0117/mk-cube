"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ====== Cube State Types ======
// Each face has 9 stickers: [0-8] in row-major order
// Faces: 0=U(white), 1=D(yellow), 2=F(green), 3=B(blue), 4=R(red), 5=L(orange)
type CubeState = number[][];

const COLORS = ["#ffffff", "#ffd32a", "#00b894", "#0984e3", "#e94560", "#ff9f43"];
const FACE_NAMES = ["U", "D", "F", "B", "R", "L"];
const COLOR_NAMES = ["흰", "노", "초", "파", "빨", "주"];

// ====== Cube Operations ======
function createSolvedCube(): CubeState {
  return Array.from({ length: 6 }, (_, i) => Array(9).fill(i));
}

function cloneCube(cube: CubeState): CubeState {
  return cube.map((face) => [...face]);
}

function rotateFaceCW(face: number[]): number[] {
  return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
}

function rotateFaceCCW(face: number[]): number[] {
  return [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]];
}

function applyMove(cube: CubeState, move: string): CubeState {
  const c = cloneCube(cube);
  const m = move.replace("'", "'");

  switch (m) {
    case "R": {
      c[4] = rotateFaceCW(c[4]);
      const temp = [c[0][2], c[0][5], c[0][8]];
      c[0][2] = c[2][2]; c[0][5] = c[2][5]; c[0][8] = c[2][8];
      c[2][2] = c[1][2]; c[2][5] = c[1][5]; c[2][8] = c[1][8];
      c[1][2] = c[3][6]; c[1][5] = c[3][3]; c[1][8] = c[3][0];
      c[3][6] = temp[0]; c[3][3] = temp[1]; c[3][0] = temp[2];
      break;
    }
    case "R'": {
      c[4] = rotateFaceCCW(c[4]);
      const temp = [c[0][2], c[0][5], c[0][8]];
      c[0][2] = c[3][6]; c[0][5] = c[3][3]; c[0][8] = c[3][0];
      c[3][6] = c[1][2]; c[3][3] = c[1][5]; c[3][0] = c[1][8];
      c[1][2] = c[2][2]; c[1][5] = c[2][5]; c[1][8] = c[2][8];
      c[2][2] = temp[0]; c[2][5] = temp[1]; c[2][8] = temp[2];
      break;
    }
    case "L": {
      c[5] = rotateFaceCW(c[5]);
      const temp = [c[0][0], c[0][3], c[0][6]];
      c[0][0] = c[3][8]; c[0][3] = c[3][5]; c[0][6] = c[3][2];
      c[3][8] = c[1][0]; c[3][5] = c[1][3]; c[3][2] = c[1][6];
      c[1][0] = c[2][0]; c[1][3] = c[2][3]; c[1][6] = c[2][6];
      c[2][0] = temp[0]; c[2][3] = temp[1]; c[2][6] = temp[2];
      break;
    }
    case "L'": {
      c[5] = rotateFaceCCW(c[5]);
      const temp = [c[0][0], c[0][3], c[0][6]];
      c[0][0] = c[2][0]; c[0][3] = c[2][3]; c[0][6] = c[2][6];
      c[2][0] = c[1][0]; c[2][3] = c[1][3]; c[2][6] = c[1][6];
      c[1][0] = c[3][8]; c[1][3] = c[3][5]; c[1][6] = c[3][2];
      c[3][8] = temp[0]; c[3][5] = temp[1]; c[3][2] = temp[2];
      break;
    }
    case "U": {
      c[0] = rotateFaceCW(c[0]);
      const temp = [c[2][0], c[2][1], c[2][2]];
      c[2][0] = c[4][0]; c[2][1] = c[4][1]; c[2][2] = c[4][2];
      c[4][0] = c[3][0]; c[4][1] = c[3][1]; c[4][2] = c[3][2];
      c[3][0] = c[5][0]; c[3][1] = c[5][1]; c[3][2] = c[5][2];
      c[5][0] = temp[0]; c[5][1] = temp[1]; c[5][2] = temp[2];
      break;
    }
    case "U'": {
      c[0] = rotateFaceCCW(c[0]);
      const temp = [c[2][0], c[2][1], c[2][2]];
      c[2][0] = c[5][0]; c[2][1] = c[5][1]; c[2][2] = c[5][2];
      c[5][0] = c[3][0]; c[5][1] = c[3][1]; c[5][2] = c[3][2];
      c[3][0] = c[4][0]; c[3][1] = c[4][1]; c[3][2] = c[4][2];
      c[4][0] = temp[0]; c[4][1] = temp[1]; c[4][2] = temp[2];
      break;
    }
    case "D": {
      c[1] = rotateFaceCW(c[1]);
      const temp = [c[2][6], c[2][7], c[2][8]];
      c[2][6] = c[5][6]; c[2][7] = c[5][7]; c[2][8] = c[5][8];
      c[5][6] = c[3][6]; c[5][7] = c[3][7]; c[5][8] = c[3][8];
      c[3][6] = c[4][6]; c[3][7] = c[4][7]; c[3][8] = c[4][8];
      c[4][6] = temp[0]; c[4][7] = temp[1]; c[4][8] = temp[2];
      break;
    }
    case "D'": {
      c[1] = rotateFaceCCW(c[1]);
      const temp = [c[2][6], c[2][7], c[2][8]];
      c[2][6] = c[4][6]; c[2][7] = c[4][7]; c[2][8] = c[4][8];
      c[4][6] = c[3][6]; c[4][7] = c[3][7]; c[4][8] = c[3][8];
      c[3][6] = c[5][6]; c[3][7] = c[5][7]; c[3][8] = c[5][8];
      c[5][6] = temp[0]; c[5][7] = temp[1]; c[5][8] = temp[2];
      break;
    }
    case "F": {
      c[2] = rotateFaceCW(c[2]);
      const temp = [c[0][6], c[0][7], c[0][8]];
      c[0][6] = c[5][8]; c[0][7] = c[5][5]; c[0][8] = c[5][2];
      c[5][2] = c[1][0]; c[5][5] = c[1][1]; c[5][8] = c[1][2];
      c[1][0] = c[4][6]; c[1][1] = c[4][3]; c[1][2] = c[4][0];
      c[4][0] = temp[0]; c[4][3] = temp[1]; c[4][6] = temp[2];
      break;
    }
    case "F'": {
      c[2] = rotateFaceCCW(c[2]);
      const temp = [c[0][6], c[0][7], c[0][8]];
      c[0][6] = c[4][0]; c[0][7] = c[4][3]; c[0][8] = c[4][6];
      c[4][0] = c[1][2]; c[4][3] = c[1][1]; c[4][6] = c[1][0];
      c[1][0] = c[5][2]; c[1][1] = c[5][5]; c[1][2] = c[5][8];
      c[5][2] = temp[2]; c[5][5] = temp[1]; c[5][8] = temp[0];
      break;
    }
    case "B": {
      c[3] = rotateFaceCW(c[3]);
      const temp = [c[0][0], c[0][1], c[0][2]];
      c[0][0] = c[4][2]; c[0][1] = c[4][5]; c[0][2] = c[4][8];
      c[4][2] = c[1][8]; c[4][5] = c[1][7]; c[4][8] = c[1][6];
      c[1][6] = c[5][0]; c[1][7] = c[5][3]; c[1][8] = c[5][6];
      c[5][0] = temp[2]; c[5][3] = temp[1]; c[5][6] = temp[0];
      break;
    }
    case "B'": {
      c[3] = rotateFaceCCW(c[3]);
      const temp = [c[0][0], c[0][1], c[0][2]];
      c[0][0] = c[5][6]; c[0][1] = c[5][3]; c[0][2] = c[5][0];
      c[5][0] = c[1][6]; c[5][3] = c[1][7]; c[5][6] = c[1][8];
      c[1][6] = c[4][8]; c[1][7] = c[4][5]; c[1][8] = c[4][2];
      c[4][2] = temp[0]; c[4][5] = temp[1]; c[4][8] = temp[2];
      break;
    }
    case "R2":
      return applyMove(applyMove(cube, "R"), "R");
    case "L2":
      return applyMove(applyMove(cube, "L"), "L");
    case "U2":
      return applyMove(applyMove(cube, "U"), "U");
    case "D2":
      return applyMove(applyMove(cube, "D"), "D");
    case "F2":
      return applyMove(applyMove(cube, "F"), "F");
    case "B2":
      return applyMove(applyMove(cube, "B"), "B");
  }
  return c;
}

function applyMoves(cube: CubeState, moves: string): CubeState {
  let c = cloneCube(cube);
  const moveList = moves.trim().split(/\s+/);
  for (const m of moveList) {
    if (m) c = applyMove(c, m);
  }
  return c;
}

// ====== LBL Solve Demo Steps ======
interface SolveStep {
  title: string;
  description: string;
  scramble: string;
  solution: string;
  highlight?: string;
}

const lblSolveDemo: SolveStep[] = [
  {
    title: "초기 상태 (스크램블)",
    description: "큐브가 섞여 있는 초기 상태입니다. 여기서부터 한 단계씩 맞춰봅니다.",
    scramble: "R U' F2 D L' B U2 R' F D' L2 U R2 B' D F' R U' L D2",
    solution: "",
  },
  {
    title: "Step 1: 흰색 십자가",
    description: "흰색 면(U)을 기준으로 4개의 엣지를 맞춰 십자가를 만듭니다. 각 엣지의 측면 색도 센터와 일치해야 합니다.",
    scramble: "R U' F2 D L' B U2 R' F D' L2 U R2 B' D F' R U' L D2",
    solution: "D' R F D2 B' L D' F' L2 D'",
  },
  {
    title: "Step 2: 흰색 코너",
    description: "R U R' U' 공식을 반복하여 흰색 코너 4개를 제자리에 넣어 1층을 완성합니다.",
    scramble: "R U' F2 D L' B U2 R' F D' L2 U R2 B' D F' R U' L D2",
    solution: "D' R F D2 B' L D' F' L2 D' U R U' R' U R U' R' U' F' U' F U' L' U L",
  },
  {
    title: "Step 3: 2층 엣지",
    description: "U R U' R' U' F' U F / U' L' U L U F U' F' 공식으로 중간층 4개 엣지를 삽입합니다.",
    scramble: "R U' F2 D L' B U2 R' F D' L2 U R2 B' D F' R U' L D2",
    solution: "D' R F D2 B' L D' F' L2 D' U R U' R' U R U' R' U' F' U' F U' L' U L U R U' R' U' F' U F U' L' U L U F U' F'",
  },
  {
    title: "Step 4: 노란색 십자가",
    description: "F R U R' U' F' 공식으로 윗면(노란)에 십자가를 만듭니다.",
    scramble: "R U' F2 D L' B U2 R' F D' L2 U R2 B' D F' R U' L D2",
    solution: "D' R F D2 B' L D' F' L2 D' U R U' R' U R U' R' U' F' U' F U' L' U L U R U' R' U' F' U F U' L' U L U F U' F' F R U R' U' F' F R U R' U' F'",
  },
  {
    title: "Step 5~7: 마지막 층 완성",
    description: "엣지 위치 → 코너 위치 → 코너 방향 순서로 마지막 층을 완성합니다. 큐브가 완성됩니다!",
    scramble: "",
    solution: "",
    highlight: "solved",
  },
];

// ====== 3D Cube Component ======
function Cube3D({
  cubeState,
  rotateX,
  rotateY,
  size = 150,
}: {
  cubeState: CubeState;
  rotateX: number;
  rotateY: number;
  size?: number;
}) {
  const half = size / 2;
  const cellSize = size / 3;
  const gap = 2;

  const faces = [
    { face: 0, transform: `rotateX(90deg) translateZ(${half}px)` },   // U
    { face: 1, transform: `rotateX(-90deg) translateZ(${half}px)` },  // D
    { face: 2, transform: `translateZ(${half}px)` },                   // F
    { face: 3, transform: `rotateY(180deg) translateZ(${half}px)` },  // B
    { face: 4, transform: `rotateY(90deg) translateZ(${half}px)` },   // R
    { face: 5, transform: `rotateY(-90deg) translateZ(${half}px)` },  // L
  ];

  return (
    <div
      className="relative mx-auto"
      style={{
        width: size,
        height: size,
        perspective: "800px",
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {faces.map(({ face, transform }) => (
          <div
            key={face}
            className="absolute inset-0 grid grid-cols-3 grid-rows-3 bg-[#111] rounded-lg p-[3px]"
            style={{
              transform,
              backfaceVisibility: "hidden",
              gap: `${gap}px`,
              width: size,
              height: size,
            }}
          >
            {cubeState[face].map((colorIdx, i) => (
              <div
                key={i}
                className="rounded-[3px] transition-colors duration-300"
                style={{
                  backgroundColor: COLORS[colorIdx],
                  width: cellSize - gap - 1,
                  height: cellSize - gap - 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ====== Flat Net View ======
function CubeNet({ cubeState, size = 40 }: { cubeState: CubeState; size?: number }) {
  const gap = 1;

  function FaceGrid({ faceIdx, label }: { faceIdx: number; label: string }) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-[10px] text-gray-500 mb-0.5">{label}</span>
        <div
          className="grid grid-cols-3 bg-[#111] rounded-sm"
          style={{ gap: `${gap}px`, padding: `${gap}px`, width: size, height: size }}
        >
          {cubeState[faceIdx].map((colorIdx, i) => (
            <div
              key={i}
              className="rounded-[1px]"
              style={{ backgroundColor: COLORS[colorIdx] }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <FaceGrid faceIdx={0} label="U" />
      <div className="flex gap-0.5">
        <FaceGrid faceIdx={5} label="L" />
        <FaceGrid faceIdx={2} label="F" />
        <FaceGrid faceIdx={4} label="R" />
        <FaceGrid faceIdx={3} label="B" />
      </div>
      <FaceGrid faceIdx={1} label="D" />
    </div>
  );
}

// ====== Main Page ======
export default function SimulatorPage() {
  const [cube, setCube] = useState<CubeState>(createSolvedCube);
  const [rotateX, setRotateX] = useState(-25);
  const [rotateY, setRotateY] = useState(35);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(-1);
  const [appliedMoves, setAppliedMoves] = useState<string[]>([]);
  const autoPlayRef = useRef(false);

  // Drag to rotate
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setRotateY((prev) => prev + dx * 0.5);
      setRotateX((prev) => Math.max(-90, Math.min(90, prev - dy * 0.5)));
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Touch drag
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.x;
      const dy = touch.clientY - dragStart.y;
      setRotateY((prev) => prev + dx * 0.5);
      setRotateX((prev) => Math.max(-90, Math.min(90, prev - dy * 0.5)));
      setDragStart({ x: touch.clientX, y: touch.clientY });
    },
    [isDragging, dragStart]
  );

  useEffect(() => {
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleTouchMove, handleMouseUp]);

  // Build cube state for current demo step
  const buildStepCube = useCallback((stepIdx: number): CubeState => {
    const step = lblSolveDemo[stepIdx];
    if (step.highlight === "solved") return createSolvedCube();

    let c = createSolvedCube();
    if (step.scramble) {
      c = applyMoves(c, step.scramble);
    }
    if (step.solution) {
      c = applyMoves(c, step.solution);
    }
    return c;
  }, []);

  // Go to step
  const goToStep = useCallback(
    (stepIdx: number) => {
      setCurrentStep(stepIdx);
      setCurrentMoveIdx(-1);
      setAppliedMoves([]);
      setCube(buildStepCube(stepIdx));
    },
    [buildStepCube]
  );

  // Initialize
  useEffect(() => {
    goToStep(0);
  }, [goToStep]);

  // Animate step-by-step solution
  const animateStep = useCallback(
    async (stepIdx: number) => {
      const step = lblSolveDemo[stepIdx];
      if (!step.scramble && !step.solution) return;

      setIsAnimating(true);

      // Start from scrambled state
      let c = createSolvedCube();
      if (step.scramble) {
        c = applyMoves(c, step.scramble);
      }
      setCube(c);
      setCurrentMoveIdx(-1);
      setAppliedMoves([]);

      await new Promise((r) => setTimeout(r, 800));

      if (step.solution) {
        const moves = step.solution.trim().split(/\s+/);
        for (let i = 0; i < moves.length; i++) {
          if (!autoPlayRef.current && !isAnimating) break;
          c = applyMove(c, moves[i]);
          setCube(cloneCube(c));
          setCurrentMoveIdx(i);
          setAppliedMoves(moves.slice(0, i + 1));
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      setIsAnimating(false);
    },
    [isAnimating]
  );

  // Auto-play all steps
  useEffect(() => {
    autoPlayRef.current = autoPlay;
    if (!autoPlay) return;

    let cancelled = false;

    async function runAutoPlay() {
      for (let s = 0; s < lblSolveDemo.length; s++) {
        if (cancelled || !autoPlayRef.current) break;
        setCurrentStep(s);

        const step = lblSolveDemo[s];
        if (step.highlight === "solved") {
          setCube(createSolvedCube());
          setCurrentMoveIdx(-1);
          setAppliedMoves([]);
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        let c = createSolvedCube();
        if (step.scramble) c = applyMoves(c, step.scramble);
        setCube(c);
        setCurrentMoveIdx(-1);
        setAppliedMoves([]);
        await new Promise((r) => setTimeout(r, 1000));

        if (step.solution) {
          const moves = step.solution.trim().split(/\s+/);
          for (let i = 0; i < moves.length; i++) {
            if (cancelled || !autoPlayRef.current) break;
            c = applyMove(c, moves[i]);
            setCube(cloneCube(c));
            setCurrentMoveIdx(i);
            setAppliedMoves(moves.slice(0, i + 1));
            await new Promise((r) => setTimeout(r, 350));
          }
        }

        await new Promise((r) => setTimeout(r, 1500));
      }

      if (!cancelled) {
        setAutoPlay(false);
      }
    }

    runAutoPlay();
    return () => {
      cancelled = true;
    };
  }, [autoPlay]);

  // Manual move buttons
  const handleManualMove = (move: string) => {
    setCube((prev) => applyMove(prev, move));
  };

  const step = lblSolveDemo[currentStep];
  const solutionMoves = step.solution ? step.solution.trim().split(/\s+/) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#00b894] via-[#0984e3] to-[#e94560] bg-clip-text text-transparent">
            3D 큐브 시뮬레이터
          </span>
        </h1>
        <p className="text-gray-400">
          입체적으로 회전하는 큐브로 LBL 풀이 과정을 시각적으로 확인하세요
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: 3D Cube */}
        <div>
          {/* 3D Cube View */}
          <div
            className="bg-card-bg border border-card-border rounded-2xl p-8 mb-6 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ minHeight: 350 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500">마우스 드래그로 회전</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setRotateX(-25); setRotateY(35); }}
                  className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded bg-white/5"
                >
                  시점 초기화
                </button>
                <button
                  onClick={() => setCube(createSolvedCube())}
                  className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded bg-white/5"
                >
                  큐브 초기화
                </button>
              </div>
            </div>
            <Cube3D
              cubeState={cube}
              rotateX={rotateX}
              rotateY={rotateY}
              size={200}
            />
          </div>

          {/* Manual Controls */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">수동 조작</h3>
            <div className="grid grid-cols-6 gap-2">
              {["R", "L", "U", "D", "F", "B"].map((face) => (
                <div key={face} className="flex flex-col gap-1">
                  <button
                    onClick={() => handleManualMove(face)}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-mono font-bold text-[#e94560] transition-colors"
                  >
                    {face}
                  </button>
                  <button
                    onClick={() => handleManualMove(`${face}'`)}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-mono font-bold text-[#fdcb6e] transition-colors"
                  >
                    {face}&apos;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flat Net View */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">전개도</h3>
            <div className="flex justify-center">
              <CubeNet cubeState={cube} size={52} />
            </div>
            <div className="flex justify-center gap-3 mt-3">
              {FACE_NAMES.map((name, i) => (
                <div key={i} className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                  {name}({COLOR_NAMES[i]})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: LBL Demo Panel */}
        <div>
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">LBL 풀이 시연</h3>
              <button
                onClick={() => {
                  if (autoPlay) {
                    setAutoPlay(false);
                  } else {
                    setAutoPlay(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  autoPlay
                    ? "bg-[#e94560] text-white"
                    : "bg-[#00b894]/20 text-[#00b894] hover:bg-[#00b894]/30"
                }`}
              >
                {autoPlay ? "⏸ 정지" : "▶ 자동 재생"}
              </button>
            </div>

            {/* Step list */}
            <div className="space-y-2 mb-4">
              {lblSolveDemo.map((s, i) => (
                <button
                  key={i}
                  onClick={() => !autoPlay && goToStep(i)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                    currentStep === i
                      ? "bg-[#e94560]/20 border border-[#e94560]/40 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep === i
                          ? "bg-[#e94560] text-white"
                          : i < currentStep
                          ? "bg-[#00b894] text-white"
                          : "bg-white/10 text-gray-500"
                      }`}
                    >
                      {i < currentStep ? "✓" : i + 1}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Detail */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
            <h4 className="font-semibold text-[#e94560] mb-2">{step.title}</h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{step.description}</p>

            {solutionMoves.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  풀이 ({currentMoveIdx + 1}/{solutionMoves.length} 무브)
                </div>
                <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                  {solutionMoves.map((move, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-xs font-mono transition-all ${
                        i < (currentMoveIdx + 1)
                          ? "bg-[#00b894]/20 text-[#00b894]"
                          : i === (currentMoveIdx + 1)
                          ? "bg-[#e94560]/20 text-[#e94560] ring-1 ring-[#e94560]/50"
                          : "bg-white/5 text-gray-600"
                      }`}
                    >
                      {move}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step.highlight === "solved" && (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-[#00b894] font-bold">큐브 완성!</div>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => !autoPlay && goToStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || autoPlay}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-card-bg border border-card-border text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← 이전
            </button>
            <button
              onClick={() => !autoPlay && animateStep(currentStep)}
              disabled={autoPlay || !step.solution}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#e94560]/20 text-[#e94560] hover:bg-[#e94560]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ▶ 이 단계 재생
            </button>
            <button
              onClick={() => !autoPlay && goToStep(Math.min(lblSolveDemo.length - 1, currentStep + 1))}
              disabled={currentStep === lblSolveDemo.length - 1 || autoPlay}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-card-bg border border-card-border text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              다음 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
