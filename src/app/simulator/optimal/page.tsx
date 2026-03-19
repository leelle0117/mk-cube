"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

// ====== Constants ======
const CUBIE_SIZE = 0.9;
const STICKER_SIZE = 0.82;
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.001;

const FACE_COLORS: Record<string, string> = {
  px: "#e94560", // Red (Right, +x)
  nx: "#ff9f43", // Orange (Left, -x)
  py: "#ffffff", // White (Up, +y)
  ny: "#ffd32a", // Yellow (Down, -y)
  pz: "#00b894", // Green (Front, +z)
  nz: "#0984e3", // Blue (Back, -z)
};

const CUBIE_BASE_COLOR = "#1a1a2e";

const STICKER_DEFS: Record<
  string,
  { position: [number, number, number]; rotation: [number, number, number] }
> = {
  px: { position: [STICKER_OFFSET, 0, 0], rotation: [0, Math.PI / 2, 0] },
  nx: { position: [-STICKER_OFFSET, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  py: { position: [0, STICKER_OFFSET, 0], rotation: [-Math.PI / 2, 0, 0] },
  ny: { position: [0, -STICKER_OFFSET, 0], rotation: [Math.PI / 2, 0, 0] },
  pz: { position: [0, 0, STICKER_OFFSET], rotation: [0, 0, 0] },
  nz: { position: [0, 0, -STICKER_OFFSET], rotation: [0, Math.PI, 0] },
};

// Move definitions: axis vector, layer filter value, rotation angle
const MOVE_DEFS: Record<
  string,
  { axis: [number, number, number]; layer: number; angle: number }
> = {
  R: { axis: [1, 0, 0], layer: 1, angle: -Math.PI / 2 },
  "R'": { axis: [1, 0, 0], layer: 1, angle: Math.PI / 2 },
  R2: { axis: [1, 0, 0], layer: 1, angle: -Math.PI },
  L: { axis: [1, 0, 0], layer: -1, angle: Math.PI / 2 },
  "L'": { axis: [1, 0, 0], layer: -1, angle: -Math.PI / 2 },
  L2: { axis: [1, 0, 0], layer: -1, angle: Math.PI },
  U: { axis: [0, 1, 0], layer: 1, angle: -Math.PI / 2 },
  "U'": { axis: [0, 1, 0], layer: 1, angle: Math.PI / 2 },
  U2: { axis: [0, 1, 0], layer: 1, angle: -Math.PI },
  D: { axis: [0, 1, 0], layer: -1, angle: Math.PI / 2 },
  "D'": { axis: [0, 1, 0], layer: -1, angle: -Math.PI / 2 },
  D2: { axis: [0, 1, 0], layer: -1, angle: Math.PI },
  F: { axis: [0, 0, 1], layer: 1, angle: -Math.PI / 2 },
  "F'": { axis: [0, 0, 1], layer: 1, angle: Math.PI / 2 },
  F2: { axis: [0, 0, 1], layer: 1, angle: -Math.PI },
  B: { axis: [0, 0, 1], layer: -1, angle: Math.PI / 2 },
  "B'": { axis: [0, 0, 1], layer: -1, angle: -Math.PI / 2 },
  B2: { axis: [0, 0, 1], layer: -1, angle: Math.PI },
};

// ====== Cubie Data ======
interface StickerInfo {
  dir: string;
  color: string;
}

interface CubieInfo {
  id: number;
  x: number;
  y: number;
  z: number;
  stickers: StickerInfo[];
}

function getStickerColors(x: number, y: number, z: number): StickerInfo[] {
  const stickers: StickerInfo[] = [];
  if (x === 1) stickers.push({ dir: "px", color: FACE_COLORS.px });
  if (x === -1) stickers.push({ dir: "nx", color: FACE_COLORS.nx });
  if (y === 1) stickers.push({ dir: "py", color: FACE_COLORS.py });
  if (y === -1) stickers.push({ dir: "ny", color: FACE_COLORS.ny });
  if (z === 1) stickers.push({ dir: "pz", color: FACE_COLORS.pz });
  if (z === -1) stickers.push({ dir: "nz", color: FACE_COLORS.nz });
  return stickers;
}

const INITIAL_CUBIES: CubieInfo[] = (() => {
  const result: CubieInfo[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        result.push({
          id: id++,
          x,
          y,
          z,
          stickers: getStickerColors(x, y, z),
        });
      }
    }
  }
  return result;
})();

// ====== Scramble Generation ======
function generateScramble(length = 20): string[] {
  const faces = ["R", "L", "U", "D", "F", "B"];
  const modifiers = ["", "'", "2"];
  const opposite: Record<string, string> = {
    R: "L",
    L: "R",
    U: "D",
    D: "U",
    F: "B",
    B: "F",
  };
  const moves: string[] = [];
  let lastFace = "";
  let secondLastFace = "";

  for (let i = 0; i < length; i++) {
    let face: string;
    do {
      face = faces[Math.floor(Math.random() * faces.length)];
    } while (
      face === lastFace ||
      (face === opposite[lastFace] && lastFace === secondLastFace)
    );
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    moves.push(face + modifier);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return moves;
}

function normalizeMoves(movesStr: string): string[] {
  return movesStr
    .replace(/[\u2019\u2018]/g, "'")
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
}

// ====== Animation State ======
interface AnimState {
  active: boolean;
  axisVec: THREE.Vector3;
  targetAngle: number;
  currentAngle: number;
  affectedIndices: number[];
  startPositions: THREE.Vector3[];
  startQuaternions: THREE.Quaternion[];
  resolve: (() => void) | null;
}

function createAnimState(): AnimState {
  return {
    active: false,
    axisVec: new THREE.Vector3(),
    targetAngle: 0,
    currentAngle: 0,
    affectedIndices: [],
    startPositions: [],
    startQuaternions: [],
    resolve: null,
  };
}

// ====== Cube Control Interface ======
interface CubeControl {
  executeMove: (move: string) => Promise<void>;
  reset: () => void;
}

// ====== Three.js Cube Scene ======
function CubeScene({
  controlRef,
  speedRef,
}: {
  controlRef: React.MutableRefObject<CubeControl | null>;
  speedRef: React.MutableRefObject<number>;
}) {
  const cubieGroups = useRef<(THREE.Group | null)[]>(
    new Array(26).fill(null)
  );
  const cubieData = useRef(
    INITIAL_CUBIES.map((c) => ({
      position: new THREE.Vector3(c.x, c.y, c.z),
      quaternion: new THREE.Quaternion(),
    }))
  );
  const anim = useRef<AnimState>(createAnimState());

  // Animation loop
  useFrame((_, delta) => {
    const a = anim.current;
    if (!a.active) return;

    const speed = speedRef.current * 3;
    const step = speed * delta;
    const remaining = a.targetAngle - a.currentAngle;

    let done = false;
    if (Math.abs(remaining) <= Math.abs(step) + 0.005) {
      a.currentAngle = a.targetAngle;
      done = true;
    } else {
      a.currentAngle += Math.sign(remaining) * Math.abs(step);
    }

    const q = new THREE.Quaternion().setFromAxisAngle(
      a.axisVec,
      a.currentAngle
    );

    for (let j = 0; j < a.affectedIndices.length; j++) {
      const i = a.affectedIndices[j];
      const group = cubieGroups.current[i];
      if (!group) continue;

      const pos = a.startPositions[j].clone().applyQuaternion(q);
      group.position.copy(pos);

      const rot = q.clone().multiply(a.startQuaternions[j]);
      group.quaternion.copy(rot);
    }

    if (done) {
      const finalQ = new THREE.Quaternion().setFromAxisAngle(
        a.axisVec,
        a.targetAngle
      );
      for (let j = 0; j < a.affectedIndices.length; j++) {
        const i = a.affectedIndices[j];
        const cubie = cubieData.current[i];
        const newPos = a.startPositions[j].clone().applyQuaternion(finalQ);
        cubie.position.set(
          Math.round(newPos.x),
          Math.round(newPos.y),
          Math.round(newPos.z)
        );
        cubie.quaternion.copy(finalQ.clone().multiply(a.startQuaternions[j]));

        const group = cubieGroups.current[i];
        if (group) {
          group.position.copy(cubie.position);
          group.quaternion.copy(cubie.quaternion);
        }
      }

      a.active = false;
      a.resolve?.();
    }
  });

  const executeMove = useCallback(
    (move: string): Promise<void> => {
      const normalized = move.replace(/[\u2019\u2018]/g, "'");
      const def = MOVE_DEFS[normalized];
      if (!def) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const a = anim.current;
        const axisVec = new THREE.Vector3(...def.axis);
        const axisIdx =
          def.axis[0] !== 0 ? 0 : def.axis[1] !== 0 ? 1 : 2;

        const affected: number[] = [];
        for (let i = 0; i < cubieData.current.length; i++) {
          const pos = cubieData.current[i].position;
          const val =
            axisIdx === 0 ? pos.x : axisIdx === 1 ? pos.y : pos.z;
          if (Math.round(val) === def.layer) {
            affected.push(i);
          }
        }

        a.active = true;
        a.axisVec = axisVec;
        a.targetAngle = def.angle;
        a.currentAngle = 0;
        a.affectedIndices = affected;
        a.startPositions = affected.map((i) =>
          cubieData.current[i].position.clone()
        );
        a.startQuaternions = affected.map((i) =>
          cubieData.current[i].quaternion.clone()
        );
        a.resolve = resolve;
      });
    },
    []
  );

  const reset = useCallback(() => {
    anim.current = createAnimState();
    cubieData.current = INITIAL_CUBIES.map((c) => ({
      position: new THREE.Vector3(c.x, c.y, c.z),
      quaternion: new THREE.Quaternion(),
    }));
    cubieGroups.current.forEach((group, i) => {
      if (group) {
        const data = cubieData.current[i];
        group.position.copy(data.position);
        group.quaternion.identity();
      }
    });
  }, []);

  useEffect(() => {
    controlRef.current = { executeMove, reset };
  }, [controlRef, executeMove, reset]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} />
      <directionalLight position={[-3, -2, -5]} intensity={0.3} />

      {INITIAL_CUBIES.map((cubie, i) => (
        <group
          key={cubie.id}
          ref={(el) => {
            cubieGroups.current[i] = el;
            if (el && !el.userData.initialized) {
              el.position.set(cubie.x, cubie.y, cubie.z);
              el.userData.initialized = true;
            }
          }}
        >
          <mesh>
            <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
            <meshStandardMaterial color={CUBIE_BASE_COLOR} roughness={0.3} />
          </mesh>
          {cubie.stickers.map((sticker) => {
            const def = STICKER_DEFS[sticker.dir];
            return (
              <mesh
                key={sticker.dir}
                position={def.position}
                rotation={def.rotation}
              >
                <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
                <meshStandardMaterial color={sticker.color} roughness={0.2} />
              </mesh>
            );
          })}
        </group>
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={12}
        enableDamping={true}
        dampingFactor={0.1}
      />
    </>
  );
}

// ====== Main Page ======
type Phase =
  | "idle"
  | "initializing"
  | "scrambling"
  | "scrambled"
  | "computing"
  | "solving"
  | "solved";

export default function OptimalSolverPage() {
  const [mounted, setMounted] = useState(false);
  const [solverReady, setSolverReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("initializing");
  const [scrambleMoves, setScrambleMoves] = useState<string[]>([]);
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(-1);
  const [speed, setSpeed] = useState(2);
  const [showingScramble, setShowingScramble] = useState(false);

  const cubeControlRef = useRef<CubeControl | null>(null);
  const speedRef = useRef(2);
  const abortRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cubeJSRef = useRef<any>(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize cubejs solver
  useEffect(() => {
    async function init() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod: any = await import("cubejs");
        const CubeJS = mod.default || mod;
        await new Promise((r) => setTimeout(r, 100));
        CubeJS.initSolver();
        cubeJSRef.current = CubeJS;
        setSolverReady(true);
        setPhase("idle");
      } catch (e) {
        console.error("Solver init failed:", e);
        setPhase("idle");
      }
    }
    init();
  }, []);

  const handleScramble = useCallback(async () => {
    if (!cubeControlRef.current) return;

    abortRef.current = true;
    await new Promise((r) => setTimeout(r, 100));
    abortRef.current = false;

    cubeControlRef.current.reset();

    const moves = generateScramble(20);
    setScrambleMoves(moves);
    setSolutionMoves([]);
    setCurrentMoveIdx(-1);
    setShowingScramble(true);
    setPhase("scrambling");

    const prevSpeed = speedRef.current;
    speedRef.current = 10;

    for (let i = 0; i < moves.length; i++) {
      if (abortRef.current) break;
      setCurrentMoveIdx(i);
      await cubeControlRef.current.executeMove(moves[i]);
    }

    speedRef.current = prevSpeed;
    setPhase("scrambled");
    setCurrentMoveIdx(-1);
    setShowingScramble(false);
  }, []);

  const handleSolve = useCallback(async () => {
    if (!cubeControlRef.current || !cubeJSRef.current) return;

    setPhase("computing");
    await new Promise((r) => setTimeout(r, 50));

    try {
      const CubeJS = cubeJSRef.current;
      const cube = new CubeJS();
      cube.move(scrambleMoves.join(" "));
      const solutionStr: string = cube.solve();

      if (!solutionStr || solutionStr.trim() === "") {
        setPhase("solved");
        setSolutionMoves([]);
        return;
      }

      const moves = normalizeMoves(solutionStr);
      setSolutionMoves(moves);
      setCurrentMoveIdx(-1);
      setShowingScramble(false);
      setPhase("solving");

      for (let i = 0; i < moves.length; i++) {
        if (abortRef.current) break;
        setCurrentMoveIdx(i);
        await cubeControlRef.current.executeMove(moves[i]);
        await new Promise((r) => setTimeout(r, 300 / speedRef.current));
      }

      if (!abortRef.current) {
        setPhase("solved");
      }
    } catch (e) {
      console.error("Solve failed:", e);
      setPhase("scrambled");
    }
  }, [scrambleMoves]);

  const handleReset = useCallback(() => {
    abortRef.current = true;
    setTimeout(() => {
      abortRef.current = false;
      cubeControlRef.current?.reset();
      setPhase(solverReady ? "idle" : "initializing");
      setScrambleMoves([]);
      setSolutionMoves([]);
      setCurrentMoveIdx(-1);
      setShowingScramble(false);
    }, 150);
  }, [solverReady]);

  const isAnimating = phase === "scrambling" || phase === "solving";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#e94560] via-[#533483] to-[#0984e3] bg-clip-text text-transparent">
            최적 풀이 3D 시뮬레이터
          </span>
        </h1>
        <p className="text-gray-400">
          Kociemba 2-Phase 알고리즘으로 최소 회전수에 가까운 풀이를 3D
          애니메이션으로 확인하세요
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: 3D Canvas */}
        <div>
          <div
            className="bg-card-bg border border-card-border rounded-2xl overflow-hidden"
            style={{ minHeight: 500 }}
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-xs text-gray-500">
                마우스 드래그로 회전 / 스크롤로 확대
              </span>
            </div>
            {mounted ? (
              <Canvas
                camera={{ position: [4, 3, 5], fov: 45 }}
                style={{ height: 480, background: "#0d0d1a" }}
              >
                <CubeScene
                  controlRef={cubeControlRef}
                  speedRef={speedRef}
                />
              </Canvas>
            ) : (
              <div className="flex items-center justify-center h-[480px] text-gray-500">
                3D 엔진 로딩 중...
              </div>
            )}
          </div>

          {/* Algorithm comparison */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mt-6">
            <h3 className="text-sm font-bold text-white mb-3">
              풀이법별 회전수 비교
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-gray-500 text-xs mb-1">
                  God&apos;s Number
                </div>
                <div className="text-[#e94560] font-bold text-lg">20</div>
                <div className="text-gray-600 text-xs">
                  어떤 상태든 20회 이내
                </div>
              </div>
              <div className="bg-[#00b894]/5 border border-[#00b894]/20 rounded-xl p-3">
                <div className="text-[#00b894] text-xs mb-1 font-semibold">
                  Kociemba (현재)
                </div>
                <div className="text-[#00b894] font-bold text-lg">~19</div>
                <div className="text-gray-600 text-xs">거의 최적해</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-gray-500 text-xs mb-1">CFOP</div>
                <div className="text-gray-400 font-bold text-lg">~55</div>
                <div className="text-gray-600 text-xs">스피드큐빙</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-gray-500 text-xs mb-1">LBL</div>
                <div className="text-gray-400 font-bold text-lg">~100+</div>
                <div className="text-gray-600 text-xs">초급자용</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls Panel */}
        <div>
          {/* Solver Status & Actions */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-2.5 h-2.5 rounded-full ${solverReady ? "bg-[#00b894]" : "bg-yellow-500 animate-pulse"}`}
              />
              <span className="text-sm font-medium text-white">
                {solverReady ? "솔버 준비됨" : "솔버 초기화 중..."}
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={handleScramble}
                disabled={isAnimating || phase === "computing"}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#533483]/30 text-[#a855f7] hover:bg-[#533483]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                스크램블
              </button>
              <button
                onClick={handleSolve}
                disabled={phase !== "scrambled" || !solverReady}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#00b894]/20 text-[#00b894] hover:bg-[#00b894]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {phase === "computing" ? "계산 중..." : "최적 풀기"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                리셋
              </button>
            </div>

            {/* Speed Control */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>풀이 속도</span>
                <span className="text-white font-mono">{speed}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-[#e94560]"
              />
            </div>
          </div>

          {/* Scramble Moves */}
          {scrambleMoves.length > 0 && (
            <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-[#a855f7]">
                  스크램블
                </h4>
                <span className="text-xs text-gray-500">
                  {scrambleMoves.length}회전
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {scrambleMoves.map((move, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 rounded text-xs font-mono transition-all ${
                      showingScramble && i <= currentMoveIdx
                        ? "bg-[#a855f7]/20 text-[#a855f7]"
                        : showingScramble && i === currentMoveIdx + 1
                          ? "bg-[#e94560]/20 text-[#e94560] ring-1 ring-[#e94560]/50"
                          : "bg-white/5 text-gray-500"
                    }`}
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Solution Moves */}
          {solutionMoves.length > 0 && (
            <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-[#00b894]">
                  최적 풀이
                </h4>
                <span className="text-xs font-bold text-[#00b894]">
                  {solutionMoves.length}회전
                </span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                {solutionMoves.map((move, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 rounded text-xs font-mono transition-all ${
                      !showingScramble && i <= currentMoveIdx
                        ? "bg-[#00b894]/20 text-[#00b894]"
                        : !showingScramble && i === currentMoveIdx + 1
                          ? "bg-[#e94560]/20 text-[#e94560] ring-1 ring-[#e94560]/50"
                          : "bg-white/5 text-gray-500"
                    }`}
                  >
                    {move}
                  </span>
                ))}
              </div>
              {phase === "solved" && (
                <div className="mt-3 pt-3 border-t border-white/5 text-center">
                  <div className="text-[#00b894] font-bold text-sm">
                    {solutionMoves.length}회전으로 풀이 완료!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Phase Status */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
            <div className="text-center">
              {phase === "idle" && (
                <div className="text-gray-400 text-sm">
                  &ldquo;스크램블&rdquo; 버튼을 눌러 시작하세요
                </div>
              )}
              {phase === "initializing" && (
                <div className="text-yellow-500 text-sm animate-pulse">
                  솔버를 초기화하고 있습니다...
                </div>
              )}
              {phase === "scrambling" && (
                <div className="text-[#a855f7] text-sm animate-pulse">
                  큐브를 섞는 중... ({currentMoveIdx + 1}/{scrambleMoves.length}
                  )
                </div>
              )}
              {phase === "scrambled" && (
                <div className="text-white text-sm">
                  &ldquo;최적 풀기&rdquo; 버튼으로 풀이를 시작하세요
                </div>
              )}
              {phase === "computing" && (
                <div className="text-yellow-500 text-sm animate-pulse">
                  최적 풀이를 계산 중...
                </div>
              )}
              {phase === "solving" && (
                <div className="text-[#00b894] text-sm animate-pulse">
                  풀이 진행 중... ({currentMoveIdx + 1}/{solutionMoves.length})
                </div>
              )}
              {phase === "solved" && (
                <div className="text-[#00b894] text-sm font-bold">
                  풀이 완료!
                </div>
              )}
            </div>
          </div>

          {/* Link to LBL simulator */}
          <Link
            href="/simulator"
            className="block w-full text-center py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-card-border"
          >
            LBL 풀이 시뮬레이터 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
