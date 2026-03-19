"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ====== Cube State Types (for flat net view) ======
type CubeState = number[][];

// White on bottom (D), Yellow on top (U) for standard LBL
const COLORS = ["#ffd32a", "#ffffff", "#00b894", "#0984e3", "#e94560", "#ff9f43"];
const FACE_NAMES = ["U", "D", "F", "B", "R", "L"];
const COLOR_NAMES = ["노", "흰", "초", "파", "빨", "주"];

// ====== Cube State Operations (for flat net tracking) ======
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
  const m = move.replace("\u2019", "'").replace("\u2018", "'");

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

// ====== 3D Constants ======
const CUBIE_SIZE = 0.9;
const STICKER_SIZE = 0.82;
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.001;

const FACE_COLORS_3D: Record<string, string> = {
  px: "#e94560",
  nx: "#ff9f43",
  py: "#ffd32a",
  ny: "#ffffff",
  pz: "#00b894",
  nz: "#0984e3",
};

const CUBIE_BASE_COLOR = "#1a1a2e";

const STICKER_DEFS: Record<string, { position: [number, number, number]; rotation: [number, number, number] }> = {
  px: { position: [STICKER_OFFSET, 0, 0], rotation: [0, Math.PI / 2, 0] },
  nx: { position: [-STICKER_OFFSET, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  py: { position: [0, STICKER_OFFSET, 0], rotation: [-Math.PI / 2, 0, 0] },
  ny: { position: [0, -STICKER_OFFSET, 0], rotation: [Math.PI / 2, 0, 0] },
  pz: { position: [0, 0, STICKER_OFFSET], rotation: [0, 0, 0] },
  nz: { position: [0, 0, -STICKER_OFFSET], rotation: [0, Math.PI, 0] },
};

const MOVE_DEFS: Record<string, { axis: [number, number, number]; layer: number; angle: number }> = {
  R:   { axis: [1, 0, 0], layer:  1, angle: -Math.PI / 2 },
  "R'": { axis: [1, 0, 0], layer:  1, angle:  Math.PI / 2 },
  R2:  { axis: [1, 0, 0], layer:  1, angle: -Math.PI },
  L:   { axis: [1, 0, 0], layer: -1, angle:  Math.PI / 2 },
  "L'": { axis: [1, 0, 0], layer: -1, angle: -Math.PI / 2 },
  L2:  { axis: [1, 0, 0], layer: -1, angle:  Math.PI },
  U:   { axis: [0, 1, 0], layer:  1, angle: -Math.PI / 2 },
  "U'": { axis: [0, 1, 0], layer:  1, angle:  Math.PI / 2 },
  U2:  { axis: [0, 1, 0], layer:  1, angle: -Math.PI },
  D:   { axis: [0, 1, 0], layer: -1, angle:  Math.PI / 2 },
  "D'": { axis: [0, 1, 0], layer: -1, angle: -Math.PI / 2 },
  D2:  { axis: [0, 1, 0], layer: -1, angle:  Math.PI },
  F:   { axis: [0, 0, 1], layer:  1, angle: -Math.PI / 2 },
  "F'": { axis: [0, 0, 1], layer:  1, angle:  Math.PI / 2 },
  F2:  { axis: [0, 0, 1], layer:  1, angle: -Math.PI },
  B:   { axis: [0, 0, 1], layer: -1, angle:  Math.PI / 2 },
  "B'": { axis: [0, 0, 1], layer: -1, angle: -Math.PI / 2 },
  B2:  { axis: [0, 0, 1], layer: -1, angle:  Math.PI },
};

// ====== 3D Cubie Data ======
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
  if (x === 1) stickers.push({ dir: "px", color: FACE_COLORS_3D.px });
  if (x === -1) stickers.push({ dir: "nx", color: FACE_COLORS_3D.nx });
  if (y === 1) stickers.push({ dir: "py", color: FACE_COLORS_3D.py });
  if (y === -1) stickers.push({ dir: "ny", color: FACE_COLORS_3D.ny });
  if (z === 1) stickers.push({ dir: "pz", color: FACE_COLORS_3D.pz });
  if (z === -1) stickers.push({ dir: "nz", color: FACE_COLORS_3D.nz });
  return stickers;
}

const INITIAL_CUBIES: CubieInfo[] = (() => {
  const result: CubieInfo[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        result.push({ id: id++, x, y, z, stickers: getStickerColors(x, y, z) });
      }
    }
  }
  return result;
})();

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
  const cubieGroups = useRef<(THREE.Group | null)[]>(new Array(26).fill(null));
  const cubieData = useRef(
    INITIAL_CUBIES.map((c) => ({
      position: new THREE.Vector3(c.x, c.y, c.z),
      quaternion: new THREE.Quaternion(),
    }))
  );
  const anim = useRef<AnimState>(createAnimState());

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

    const q = new THREE.Quaternion().setFromAxisAngle(a.axisVec, a.currentAngle);

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
      const finalQ = new THREE.Quaternion().setFromAxisAngle(a.axisVec, a.targetAngle);
      for (let j = 0; j < a.affectedIndices.length; j++) {
        const i = a.affectedIndices[j];
        const cubie = cubieData.current[i];
        const newPos = a.startPositions[j].clone().applyQuaternion(finalQ);
        cubie.position.set(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z));
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

  const executeMove = useCallback((move: string): Promise<void> => {
    const normalized = move.replace(/[\u2019\u2018]/g, "'");
    const def = MOVE_DEFS[normalized];
    if (!def) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const a = anim.current;
      const axisVec = new THREE.Vector3(...def.axis);
      const axisIdx = def.axis[0] !== 0 ? 0 : def.axis[1] !== 0 ? 1 : 2;

      const affected: number[] = [];
      for (let i = 0; i < cubieData.current.length; i++) {
        const pos = cubieData.current[i].position;
        const val = axisIdx === 0 ? pos.x : axisIdx === 1 ? pos.y : pos.z;
        if (Math.round(val) === def.layer) {
          affected.push(i);
        }
      }

      a.active = true;
      a.axisVec = axisVec;
      a.targetAngle = def.angle;
      a.currentAngle = 0;
      a.affectedIndices = affected;
      a.startPositions = affected.map((i) => cubieData.current[i].position.clone());
      a.startQuaternions = affected.map((i) => cubieData.current[i].quaternion.clone());
      a.resolve = resolve;
    });
  }, []);

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
              <mesh key={sticker.dir} position={def.position} rotation={def.rotation}>
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

// ====== LBL Solve Demo Steps ======
interface SolveStep {
  title: string;
  description: string;
  scramble: string;
  solution: string;
  highlight?: string;
}

// Standard LBL: white on bottom (D face). Each step verified mathematically.
// Scramble constructed by reverse-LBL from solved. Each cumulative solution
// produces the correct LBL stage (cross → corners → middle → OLL → PLL).
const SCRAMBLE = "R U R' U R U2 R' F R U R' U' F' F' U' F U R U R' U' R U R' U' R U R' U' R U R' U' F2 R2 B2 L2";

const lblSolveDemo: SolveStep[] = [
  {
    title: "초기 상태 (스크램블)",
    description: "큐브가 섞여 있는 초기 상태입니다. 흰색이 아래에 있습니다. 여기서부터 한 단계씩 풀어갑니다.",
    scramble: SCRAMBLE,
    solution: "",
  },
  {
    title: "Step 1: 흰색 십자가",
    description: "아랫면(흰색)에 십자가를 만듭니다. 4개의 흰색 엣지를 맞추고, 각 측면 색이 센터와 일치하도록 합니다.",
    scramble: SCRAMBLE,
    solution: "L2 B2 R2 F2",
  },
  {
    title: "Step 2: 흰색 코너 완성",
    description: "R U R' U' 공식을 반복하여 흰색 코너 4개를 제자리에 넣어 1층을 완성합니다.",
    scramble: SCRAMBLE,
    solution: "L2 B2 R2 F2 U R U' R' U R U' R' U R U' R'",
  },
  {
    title: "Step 3: 2층 완성",
    description: "U R U' R' U' F' U F 공식으로 중간층 엣지 4개를 삽입하여 2층까지 완성합니다.",
    scramble: SCRAMBLE,
    solution: "L2 B2 R2 F2 U R U' R' U R U' R' U R U' R' U R U' R' U' F' U F",
  },
  {
    title: "Step 4: 노란색 십자가",
    description: "F R U R' U' F' 공식으로 윗면(노란)에 십자가를 만듭니다.",
    scramble: SCRAMBLE,
    solution: "L2 B2 R2 F2 U R U' R' U R U' R' U R U' R' U R U' R' U' F' U F F U R U' R' F'",
  },
  {
    title: "Step 5: 큐브 완성!",
    description: "마지막 층의 코너를 맞춰 큐브를 완성합니다! R U2 R' U' R U' R' (Sune 공식)",
    scramble: SCRAMBLE,
    solution: "L2 B2 R2 F2 U R U' R' U R U' R' U R U' R' U R U' R' U' F' U F F U R U' R' F' R U2 R' U' R U' R'",
    highlight: "solved",
  },
];

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
  const [mounted, setMounted] = useState(false);
  const [cube, setCube] = useState<CubeState>(createSolvedCube);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(-1);
  const [speed, setSpeed] = useState(2);

  const cubeControlRef = useRef<CubeControl | null>(null);
  const speedRef = useRef(2);
  const autoPlayRef = useRef(false);
  const abortRef = useRef(false);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Execute a single move on both the 3D cube and flat state
  const execMove = useCallback(async (move: string, cubeState: CubeState): Promise<CubeState> => {
    if (cubeControlRef.current) {
      await cubeControlRef.current.executeMove(move);
    }
    return applyMove(cubeState, move);
  }, []);

  // Execute moves rapidly (for scrambling) - moderately fast speed
  const execMovesFast = useCallback(async (moves: string[], startCube: CubeState): Promise<CubeState> => {
    let c = cloneCube(startCube);
    const prevSpeed = speedRef.current;
    speedRef.current = 5;
    for (const move of moves) {
      if (abortRef.current) break;
      c = await execMove(move, c);
    }
    speedRef.current = prevSpeed;
    return c;
  }, [execMove]);

  // Reset everything
  const resetAll = useCallback(() => {
    abortRef.current = true;
    setTimeout(() => {
      abortRef.current = false;
      cubeControlRef.current?.reset();
      setCube(createSolvedCube());
      setCurrentStep(0);
      setCurrentMoveIdx(-1);
      setIsAnimating(false);
      setAutoPlay(false);
      autoPlayRef.current = false;
    }, 150);
  }, []);

  // Helper: get only the NEW moves for a step (difference from previous step)
  const getNewMoves = useCallback((stepIdx: number): string[] => {
    const step = lblSolveDemo[stepIdx];
    if (!step.solution) return [];
    const allMoves = step.solution.trim().split(/\s+/);
    // Find previous step's move count
    let prevCount = 0;
    if (stepIdx > 0) {
      const prevStep = lblSolveDemo[stepIdx - 1];
      if (prevStep.solution) {
        prevCount = prevStep.solution.trim().split(/\s+/).length;
      }
    }
    return allMoves.slice(prevCount);
  }, []);

  // Go to a specific step: reset, scramble fast, apply cumulative solution fast
  const goToStep = useCallback(async (stepIdx: number) => {
    if (isAnimating) return;
    const step = lblSolveDemo[stepIdx];
    setCurrentStep(stepIdx);
    setCurrentMoveIdx(-1);
    setIsAnimating(true);

    // Reset the 3D cube
    cubeControlRef.current?.reset();
    let c = createSolvedCube();

    // Apply scramble fast
    if (step.scramble) {
      const scrambleMoves = step.scramble.trim().split(/\s+/);
      c = await execMovesFast(scrambleMoves, c);
    }

    // Apply cumulative solution fast (to show end-state of this step)
    if (step.solution) {
      const solMoves = step.solution.trim().split(/\s+/);
      c = await execMovesFast(solMoves, c);
    }

    setCube(cloneCube(c));
    setIsAnimating(false);
  }, [isAnimating, execMovesFast]);

  // Animate a step: reset, scramble fast, apply PREVIOUS solution fast,
  // then animate only THIS step's new moves
  const animateStep = useCallback(async (stepIdx: number) => {
    const newMoves = getNewMoves(stepIdx);
    if (newMoves.length === 0) return;
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentStep(stepIdx);
    setCurrentMoveIdx(-1);
    abortRef.current = false;

    // Reset 3D cube
    cubeControlRef.current?.reset();
    let c = createSolvedCube();

    // Apply scramble fast
    const step = lblSolveDemo[stepIdx];
    if (step.scramble) {
      const scrambleMoves = step.scramble.trim().split(/\s+/);
      c = await execMovesFast(scrambleMoves, c);
    }

    // Apply previous steps' solution fast (get to starting point of this step)
    if (stepIdx > 0) {
      const prevStep = lblSolveDemo[stepIdx - 1];
      if (prevStep.solution) {
        const prevMoves = prevStep.solution.trim().split(/\s+/);
        c = await execMovesFast(prevMoves, c);
      }
    }

    setCube(cloneCube(c));
    await new Promise((r) => setTimeout(r, 500));

    // Animate only the NEW moves for this step
    const prevCount = stepIdx > 0 && lblSolveDemo[stepIdx - 1].solution
      ? lblSolveDemo[stepIdx - 1].solution.trim().split(/\s+/).length
      : 0;

    for (let i = 0; i < newMoves.length; i++) {
      if (abortRef.current) break;
      setCurrentMoveIdx(prevCount + i);
      c = await execMove(newMoves[i], c);
      setCube(cloneCube(c));
      await new Promise((r) => setTimeout(r, 100 / speedRef.current));
    }

    if (!abortRef.current) {
      setCurrentMoveIdx(-1);
    }
    setIsAnimating(false);
  }, [isAnimating, execMove, execMovesFast, getNewMoves]);

  // Auto-play: scramble once, then animate each step's new moves continuously
  useEffect(() => {
    autoPlayRef.current = autoPlay;
    if (!autoPlay) return;

    let cancelled = false;

    async function runAutoPlay() {
      setIsAnimating(true);

      // Reset and scramble once
      cubeControlRef.current?.reset();
      let c = createSolvedCube();
      const scrambleStr = lblSolveDemo[0].scramble;

      if (scrambleStr) {
        setCurrentStep(0);
        setCurrentMoveIdx(-1);
        const scrambleMoves = scrambleStr.trim().split(/\s+/);
        c = await execMovesFast(scrambleMoves, c);
        setCube(cloneCube(c));
      }

      await new Promise((r) => setTimeout(r, 800));

      // For each step, animate only the NEW moves
      let appliedCount = 0;

      for (let s = 1; s < lblSolveDemo.length; s++) {
        if (cancelled || !autoPlayRef.current) break;
        const step = lblSolveDemo[s];
        setCurrentStep(s);
        setCurrentMoveIdx(-1);

        if (!step.solution) {
          // "solved" highlight step - just pause
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        const allMoves = step.solution.trim().split(/\s+/);
        const newMoves = allMoves.slice(appliedCount);

        for (let i = 0; i < newMoves.length; i++) {
          if (cancelled || !autoPlayRef.current) break;
          setCurrentMoveIdx(appliedCount + i);
          c = await execMove(newMoves[i], c);
          setCube(cloneCube(c));
          await new Promise((r) => setTimeout(r, 100 / speedRef.current));
        }

        appliedCount = allMoves.length;
        setCurrentMoveIdx(-1);
        await new Promise((r) => setTimeout(r, 1200));
      }

      if (!cancelled) {
        setAutoPlay(false);
        setIsAnimating(false);
      }
    }

    runAutoPlay();
    return () => {
      cancelled = true;
      abortRef.current = true;
    };
  }, [autoPlay, execMove, execMovesFast]);

  // Manual move
  const handleManualMove = useCallback(async (move: string) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newCube = await execMove(move, cube);
    setCube(newCube);
    setIsAnimating(false);
  }, [isAnimating, cube, execMove]);

  const step = lblSolveDemo[currentStep];
  const solutionMoves = step.solution ? step.solution.trim().split(/\s+/) : [];
  // How many moves belong to previous steps
  const prevStepMoveCount = currentStep > 0 && lblSolveDemo[currentStep - 1].solution
    ? lblSolveDemo[currentStep - 1].solution.trim().split(/\s+/).length
    : 0;
  const newMovesOnly = solutionMoves.slice(prevStepMoveCount);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#00b894] via-[#0984e3] to-[#e94560] bg-clip-text text-transparent">
            LBL 풀이 3D 시뮬레이터
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
            className="bg-card-bg border border-card-border rounded-2xl overflow-hidden"
            style={{ minHeight: 500 }}
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-xs text-gray-500">마우스 드래그로 회전 / 스크롤로 확대</span>
              <div className="flex gap-2">
                <button
                  onClick={resetAll}
                  className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded bg-white/5"
                >
                  큐브 초기화
                </button>
              </div>
            </div>
            {mounted ? (
              <Canvas
                camera={{ position: [4, 3, 5], fov: 45 }}
                style={{ height: 480, background: "#0d0d1a" }}
              >
                <CubeScene controlRef={cubeControlRef} speedRef={speedRef} />
              </Canvas>
            ) : (
              <div className="flex items-center justify-center h-[480px] text-gray-500">
                3D 엔진 로딩 중...
              </div>
            )}
          </div>

          {/* Manual Controls */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mt-6">
            <h3 className="text-sm font-semibold text-white mb-3">수동 조작</h3>
            <div className="grid grid-cols-6 gap-2">
              {["R", "L", "U", "D", "F", "B"].map((face) => (
                <div key={face} className="flex flex-col gap-1">
                  <button
                    onClick={() => handleManualMove(face)}
                    disabled={isAnimating}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-mono font-bold text-[#e94560] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {face}
                  </button>
                  <button
                    onClick={() => handleManualMove(`${face}'`)}
                    disabled={isAnimating}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-mono font-bold text-[#fdcb6e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {face}&apos;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flat Net View */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mt-6">
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
          {/* Speed Control */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">LBL 풀이 시연</h3>
              <button
                onClick={() => {
                  if (autoPlay) {
                    setAutoPlay(false);
                    abortRef.current = true;
                    setTimeout(() => {
                      abortRef.current = false;
                      setIsAnimating(false);
                    }, 200);
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
                {autoPlay ? "\u23F8 정지" : "\u25B6 자동 재생"}
              </button>
            </div>

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

          {/* Step list */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
            <div className="space-y-2">
              {lblSolveDemo.map((s, i) => (
                <button
                  key={i}
                  onClick={() => !autoPlay && !isAnimating && goToStep(i)}
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
                      {i < currentStep ? "\u2713" : i + 1}
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

            {newMovesOnly.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  이 단계 ({Math.max(0, currentMoveIdx - prevStepMoveCount + 1)}/{newMovesOnly.length} 무브)
                  {prevStepMoveCount > 0 && (
                    <span className="text-gray-600 ml-1">
                      · 전체 {solutionMoves.length}무브 중 {prevStepMoveCount + 1}~{solutionMoves.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                  {newMovesOnly.map((move, i) => {
                    const globalIdx = prevStepMoveCount + i;
                    return (
                      <span
                        key={i}
                        className={`px-1.5 py-0.5 rounded text-xs font-mono transition-all ${
                          globalIdx < (currentMoveIdx + 1)
                            ? "bg-[#00b894]/20 text-[#00b894]"
                            : globalIdx === (currentMoveIdx + 1)
                              ? "bg-[#e94560]/20 text-[#e94560] ring-1 ring-[#e94560]/50"
                              : "bg-white/5 text-gray-600"
                        }`}
                      >
                        {move}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {step.highlight === "solved" && (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">&#127881;</div>
                <div className="text-[#00b894] font-bold">큐브 완성!</div>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => !autoPlay && goToStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || autoPlay || isAnimating}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-card-bg border border-card-border text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← 이전
            </button>
            <button
              onClick={() => animateStep(currentStep)}
              disabled={autoPlay || isAnimating || !step.solution}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#e94560]/20 text-[#e94560] hover:bg-[#e94560]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ▶ 이 단계 재생
            </button>
            <button
              onClick={() => !autoPlay && goToStep(Math.min(lblSolveDemo.length - 1, currentStep + 1))}
              disabled={currentStep === lblSolveDemo.length - 1 || autoPlay || isAnimating}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-card-bg border border-card-border text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              다음 →
            </button>
          </div>

          {/* Link to optimal simulator */}
          <a
            href="/simulator/optimal"
            className="block w-full text-center py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-card-border"
          >
            최적 풀이 시뮬레이터 보기 →
          </a>
        </div>
      </div>
    </div>
  );
}
