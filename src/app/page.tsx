import Link from "next/link";

const levels = [
  {
    id: 1,
    title: "Lv.1 입문",
    subtitle: "Layer By Layer",
    description: "처음 큐브를 맞추는 분을 위한 기초 방법. 7단계로 큐브를 완성합니다.",
    targetTime: "2~5분",
    color: "#00b894",
    icon: "🟢",
    algorithms: "7개 단계",
    badge: "START HERE",
  },
  {
    id: 2,
    title: "Lv.2 중급",
    subtitle: "CFOP 기초 (Fridrich)",
    description: "직관적 F2L과 2-Look OLL/PLL로 1분 벽을 깨는 중급 방법.",
    targetTime: "30초~1분",
    color: "#fdcb6e",
    icon: "🟡",
    algorithms: "~15개 공식",
    badge: "POPULAR",
  },
  {
    id: 3,
    title: "Lv.3 고급",
    subtitle: "Full OLL & PLL",
    description: "57개 OLL + 21개 PLL = 78개 알고리즘을 완전히 마스터합니다.",
    targetTime: "15~30초",
    color: "#ff9f43",
    icon: "🟠",
    algorithms: "78개 공식",
    badge: "CHALLENGE",
  },
  {
    id: 4,
    title: "Lv.4 스피드",
    subtitle: "스피드큐빙 최적화",
    description: "핑거트릭, Look-Ahead, Cross+1 등 Sub-15를 위한 고급 테크닉.",
    targetTime: "10~15초",
    color: "#e94560",
    icon: "🔴",
    algorithms: "최적화 기법",
    badge: "EXPERT",
  },
];

// Face colors matching the cube
const FACE_COLOR: Record<string, string> = {
  R: "#e94560", L: "#ff9f43", U: "#ffd32a", D: "#ffffff", F: "#00b894", B: "#0984e3",
};

interface NotationItem {
  move: string;
  face: string;       // which face (R/L/U/D/F/B)
  desc: string;
  dir: "cw" | "ccw" | "180";
  type?: "slice" | "rotation";
}

const notationGuide: NotationItem[] = [
  { move: "R",  face: "R", desc: "오른면 시계 90°",    dir: "cw" },
  { move: "R'", face: "R", desc: "오른면 반시계 90°",  dir: "ccw" },
  { move: "L",  face: "L", desc: "왼면 시계 90°",      dir: "cw" },
  { move: "L'", face: "L", desc: "왼면 반시계 90°",    dir: "ccw" },
  { move: "U",  face: "U", desc: "윗면 시계 90°",      dir: "cw" },
  { move: "U'", face: "U", desc: "윗면 반시계 90°",    dir: "ccw" },
  { move: "D",  face: "D", desc: "아랫면 시계 90°",    dir: "cw" },
  { move: "D'", face: "D", desc: "아랫면 반시계 90°",  dir: "ccw" },
  { move: "F",  face: "F", desc: "앞면 시계 90°",      dir: "cw" },
  { move: "F'", face: "F", desc: "앞면 반시계 90°",    dir: "ccw" },
  { move: "B",  face: "B", desc: "뒷면 시계 90°",      dir: "cw" },
  { move: "B'", face: "B", desc: "뒷면 반시계 90°",    dir: "ccw" },
  { move: "M",  face: "L", desc: "중간층 (L방향)",     dir: "cw", type: "slice" },
  { move: "x",  face: "R", desc: "큐브 전체 (R방향)",  dir: "cw", type: "rotation" },
  { move: "y",  face: "U", desc: "큐브 전체 (U방향)",  dir: "cw", type: "rotation" },
  { move: "z",  face: "F", desc: "큐브 전체 (F방향)",  dir: "cw", type: "rotation" },
];

// 3D isometric cube SVG with highlighted face and rotation arrow
function CubeDiagram({ face, color, dir }: { face: string; color: string; dir: "cw" | "ccw" | "180" }) {
  const mirror = face === "L"; // only L is mirrored
  const frontView = face === "F" || face === "B";

  // Which of the 3 visible faces to highlight
  // R: standard view, right face
  // L: standard view mirrored, right face (appears as left)
  // F: front view (shallow top), left face
  // B: front view (tall top), right face — different from F!
  let hTop = face === "U";
  let hRight = false;
  let hLeft = false;
  const hBottom = face === "D";
  if (!hBottom && !hTop) {
    if (face === "R") hRight = true;
    else if (face === "L") hRight = true; // mirrored → appears as left
    else if (face === "F") hLeft = true;  // left face = front
    else if (face === "B") hRight = true; // right face = back (different from F)
  }

  const topFill = hTop ? color : "#1a1a2e";
  const rightFill = hRight ? color : "#222240";
  const leftFill = hLeft ? color : "#1c1c35";
  const topOp = hTop ? 0.9 : 1;
  const rightOp = hRight ? 0.9 : 1;
  const leftOp = hLeft ? 0.9 : 1;

  // Vertices: all symmetric cubes, but F/B use a slightly different vertical angle
  // Standard (R/L/U/D): balanced top view
  // F view: top face smaller (looking more from the front, less from above)
  // B view: top face larger (looking more from above)
  let VA: number[], VB: number[], VC: number[], VD: number[];
  let VE: number[], VF: number[], VG: number[];

  if (face === "F" || face === "F'") {
    // F: cube rotated slightly right → left face (front, colored) appears wider
    // right=(23,12), left=(-19,12), symmetric-looking cube
    VA = [36, 14]; VB = [59, 26]; VD = [17, 26];
    VC = [40, 38];
    VE = [59, 48]; VF = [40, 60]; VG = [17, 48];
  } else if (face === "B" || face === "B'") {
    // B: same rotation → right face (back, colored) appears narrower
    VA = [36, 5]; VB = [59, 17]; VD = [17, 17];
    VC = [40, 29];
    VE = [59, 47]; VF = [40, 59]; VG = [17, 47];
  } else {
    // Standard symmetric isometric (R/L/U/D)
    VA = [40, 8]; VB = [62, 21]; VD = [18, 21];
    VC = [40, 34];
    VE = [62, 46]; VF = [40, 59]; VG = [18, 46];
  }

  function lerp(p1: number[], p2: number[], t: number): number[] {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  }
  function gridPaths(p0: number[], p1: number[], p2: number[], p3: number[]) {
    const d: string[] = [];
    for (let i = 1; i <= 2; i++) {
      const t = i / 3;
      const a = lerp(p0, p3, t), b = lerp(p1, p2, t);
      d.push(`M${a[0]},${a[1]}L${b[0]},${b[1]}`);
      const c2 = lerp(p0, p1, t), d2 = lerp(p3, p2, t);
      d.push(`M${c2[0]},${c2[1]}L${d2[0]},${d2[1]}`);
    }
    return d.join(" ");
  }
  function pts(ps: number[][]) { return ps.map(p => p.join(",")).join(" "); }

  const topGrid = gridPaths(VA, VB, VC, VD);
  const rightGrid = gridPaths(VB, VE, VF, VC);
  const leftGrid = gridPaths(VD, VC, VF, VG);

  // Arrow positions depend on view type and highlighted face
  let arrowPath = "";
  let arrowHead = "";
  const cw = dir === "cw";
  const is180 = dir === "180";

  if (hTop) {
    arrowPath = cw ? "M48,17 Q50,26 40,28 Q30,26 32,17" : "M32,17 Q30,26 40,28 Q50,26 48,17";
    arrowHead = cw ? "52,19 47,12 44,20" : "28,19 33,12 36,20";
  } else if (hRight) {
    // R face (standard), L face (mirrored), or B face (frontView, right face)
    const cy = (face === "B" || face === "B'") ? 38 : 40;
    const y0 = cy - 10; const y1 = cy + 10;
    arrowPath = cw
      ? `M53,${y0} Q44,${y0+3} 43,${cy} Q44,${y1-3} 53,${y1}`
      : `M53,${y1} Q44,${y1-3} 43,${cy} Q44,${y0+3} 53,${y0}`;
    arrowHead = cw ? `57,${y1+2} 50,${y1+2} 53,${y1-5}` : `57,${y0-2} 50,${y0-2} 53,${y0+5}`;
  } else if (hLeft) {
    // F face (frontView, arrow on left face)
    const cy = frontView ? 44 : 40;
    const y0 = cy - 10; const y1 = cy + 10;
    arrowPath = cw
      ? `M24,${y1} Q33,${y1-3} 34,${cy} Q33,${y0+3} 24,${y0}`
      : `M24,${y0} Q33,${y0+3} 34,${cy} Q33,${y1-3} 24,${y1}`;
    arrowHead = cw ? `20,${y0-2} 27,${y0-2} 24,${y0+5}` : `20,${y1+2} 27,${y1+2} 24,${y1-5}`;
  } else if (hBottom) {
    arrowPath = cw ? "M48,56 Q50,64 40,66 Q30,64 32,56" : "M32,56 Q30,64 40,66 Q50,64 48,56";
    arrowHead = cw ? "52,58 47,52 44,59" : "28,58 33,52 36,59";
  }

  return (
    <svg width="80" height="72" viewBox="0 0 80 72" fill="none" className="shrink-0"
      style={mirror ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* D face indicator (bottom, behind the cube) */}
      {hBottom && (
        <polygon points={pts([VC, VB, VE, VF])} fill={color} opacity="0.15" />
      )}
      {hBottom && (
        <polygon points={pts([VC, VD, VG, VF])} fill={color} opacity="0.1" />
      )}

      {/* Three visible faces */}
      <polygon points={pts([VA, VB, VC, VD])} fill={topFill} opacity={topOp} />
      <polygon points={pts([VB, VE, VF, VC])} fill={rightFill} opacity={rightOp} />
      <polygon points={pts([VD, VC, VF, VG])} fill={leftFill} opacity={leftOp} />

      {/* Grid lines */}
      <path d={topGrid} stroke="white" strokeWidth="0.5" opacity={hTop ? "0.5" : "0.12"} />
      <path d={rightGrid} stroke="white" strokeWidth="0.5" opacity={hRight ? "0.5" : "0.12"} />
      <path d={leftGrid} stroke="white" strokeWidth="0.5" opacity={hLeft ? "0.5" : "0.12"} />

      {/* Face outlines */}
      <polygon points={pts([VA, VB, VC, VD])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <polygon points={pts([VB, VE, VF, VC])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <polygon points={pts([VD, VC, VF, VG])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />

      {/* Highlighted face border */}
      {hTop && <polygon points={pts([VA, VB, VC, VD])} fill="none" stroke={color} strokeWidth="1.5" />}
      {hRight && <polygon points={pts([VB, VE, VF, VC])} fill="none" stroke={color} strokeWidth="1.5" />}
      {hLeft && <polygon points={pts([VD, VC, VF, VG])} fill="none" stroke={color} strokeWidth="1.5" />}
      {hBottom && (
        <>
          <line x1={VC[0]} y1={VC[1]} x2={VF[0]} y2={VF[1]} stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />
          <line x1={VB[0]} y1={VB[1]} x2={VE[0]} y2={VE[1]} stroke={color} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.5" />
        </>
      )}

      {/* Rotation arrow */}
      {arrowPath && (
        <>
          <path d={arrowPath} stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <polygon points={arrowHead} fill="white" />
        </>
      )}
    </svg>
  );
}

// Whole-cube rotation diagram: arrow wraps around the entire cube
function CubeRotationDiagram({ axis, dir }: { axis: "x" | "y" | "z"; dir: "cw" | "ccw" | "180" }) {
  // Same isometric cube but all faces neutral, with a large arrow around the cube
  const A = [40, 8], B = [62, 21], C = [40, 34], D = [18, 21];
  const E = [62, 46], F = [40, 59], G = [18, 46];

  function lerp(p1: number[], p2: number[], t: number): number[] {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  }
  function gridPaths(p0: number[], p1: number[], p2: number[], p3: number[]) {
    const d: string[] = [];
    for (let i = 1; i <= 2; i++) {
      const t = i / 3;
      const a = lerp(p0, p3, t), b = lerp(p1, p2, t);
      d.push(`M${a[0]},${a[1]}L${b[0]},${b[1]}`);
      const c2 = lerp(p0, p1, t), d2 = lerp(p3, p2, t);
      d.push(`M${c2[0]},${c2[1]}L${d2[0]},${d2[1]}`);
    }
    return d.join(" ");
  }
  function pts(ps: number[][]) { return ps.map(p => p.join(",")).join(" "); }

  const topGrid = gridPaths(A, B, C, D);
  const rightGrid = gridPaths(B, E, F, C);
  const leftGrid = gridPaths(D, C, F, G);

  const cw = dir === "cw";

  // Arrow paths that wrap AROUND the cube depending on axis
  let arrowPath = "";
  let arrowHead = "";
  const arrowColor = "#c084fc"; // purple for whole-cube rotation

  if (axis === "y") {
    // Horizontal rotation around Y axis (around the top/bottom)
    arrowPath = cw
      ? "M10,18 Q2,34 10,50 M70,50 Q78,34 70,18"
      : "M70,18 Q78,34 70,50 M10,50 Q2,34 10,18";
    arrowHead = cw ? "7,15 13,15 10,21" : "73,15 67,15 70,21";
  } else if (axis === "x") {
    // Rotation around X axis (left-right axis, tilts forward/back)
    arrowPath = cw
      ? "M57,6 Q70,20 66,40 M23,60 Q10,46 14,26"
      : "M14,6 Q10,20 14,40 M66,60 Q70,46 66,26";
    arrowHead = cw ? "54,3 60,3 57,9" : "11,3 17,3 14,9";
  } else {
    // z: rotation around Z axis (front-back axis, tilts sideways)
    arrowPath = cw
      ? "M24,6 Q10,12 8,28 M56,60 Q70,54 72,38"
      : "M56,6 Q70,12 72,28 M24,60 Q10,54 8,38";
    arrowHead = cw ? "21,4 27,4 24,10" : "53,4 59,4 56,10";
  }

  return (
    <svg width="80" height="72" viewBox="0 0 80 72" fill="none" className="shrink-0">
      {/* Cube faces - all neutral/dim */}
      <polygon points={pts([A, B, C, D])} fill="#1a1a2e" />
      <polygon points={pts([B, E, F, C])} fill="#222240" />
      <polygon points={pts([D, C, F, G])} fill="#1c1c35" />

      {/* Grid lines */}
      <path d={topGrid} stroke="white" strokeWidth="0.5" opacity="0.12" />
      <path d={rightGrid} stroke="white" strokeWidth="0.5" opacity="0.12" />
      <path d={leftGrid} stroke="white" strokeWidth="0.5" opacity="0.12" />

      {/* Outlines */}
      <polygon points={pts([A, B, C, D])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <polygon points={pts([B, E, F, C])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <polygon points={pts([D, C, F, G])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />

      {/* Wrap-around arrow */}
      <path d={arrowPath} stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points={arrowHead} fill={arrowColor} />
    </svg>
  );
}

// Slice (M) diagram: arrow on the middle layer of the cube
function SliceDiagram({ dir }: { dir: "cw" | "ccw" | "180" }) {
  const A = [40, 8], B = [62, 21], C = [40, 34], D = [18, 21];
  const E = [62, 46], F = [40, 59], G = [18, 46];

  function lerp(p1: number[], p2: number[], t: number): number[] {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  }
  function gridPaths(p0: number[], p1: number[], p2: number[], p3: number[]) {
    const d: string[] = [];
    for (let i = 1; i <= 2; i++) {
      const t = i / 3;
      const a = lerp(p0, p3, t), b = lerp(p1, p2, t);
      d.push(`M${a[0]},${a[1]}L${b[0]},${b[1]}`);
      const c2 = lerp(p0, p1, t), d2 = lerp(p3, p2, t);
      d.push(`M${c2[0]},${c2[1]}L${d2[0]},${d2[1]}`);
    }
    return d.join(" ");
  }
  function pts(ps: number[][]) { return ps.map(p => p.join(",")).join(" "); }

  const topGrid = gridPaths(A, B, C, D);
  const rightGrid = gridPaths(B, E, F, C);
  const leftGrid = gridPaths(D, C, F, G);

  // Middle slice on the left face (M = middle layer, L direction)
  // Highlight the center column of the left face
  const sliceColor = "#a855f7";
  const cw = dir === "cw";

  // Center column of the left(front) face: between grid lines at 1/3 and 2/3 along DC direction
  const p0 = lerp(D, C, 1 / 3);
  const p1 = lerp(D, C, 2 / 3);
  const p2 = lerp(G, F, 2 / 3);
  const p3 = lerp(G, F, 1 / 3);

  return (
    <svg width="80" height="72" viewBox="0 0 80 72" fill="none" className="shrink-0">
      {/* Cube faces */}
      <polygon points={pts([A, B, C, D])} fill="#1a1a2e" />
      <polygon points={pts([B, E, F, C])} fill="#222240" />
      <polygon points={pts([D, C, F, G])} fill="#1c1c35" />

      {/* Highlighted slice */}
      <polygon points={pts([p0, p1, p2, p3])} fill={sliceColor} opacity="0.35" />
      <polygon points={pts([p0, p1, p2, p3])} fill="none" stroke={sliceColor} strokeWidth="1.2" />

      {/* Grid lines */}
      <path d={topGrid} stroke="white" strokeWidth="0.5" opacity="0.12" />
      <path d={rightGrid} stroke="white" strokeWidth="0.5" opacity="0.12" />
      <path d={leftGrid} stroke="white" strokeWidth="0.5" opacity="0.15" />

      {/* Outlines */}
      <polygon points={pts([A, B, C, D])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <polygon points={pts([B, E, F, C])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <polygon points={pts([D, C, F, G])} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />

      {/* Arrow on the slice (vertical on left face center) */}
      <path
        d={cw ? "M28,49 Q37,46 38,40 Q37,34 28,31" : "M28,31 Q37,34 38,40 Q37,46 28,49"}
        stroke={sliceColor} strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      <polygon
        points={cw ? "25,29 31,29 28,36" : "25,51 31,51 28,44"}
        fill={sliceColor}
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16 pt-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 grid grid-cols-3 grid-rows-3 gap-1 transform rotate-12 glow-animation rounded-xl p-2 bg-card-bg border border-card-border">
              {["#e94560", "#0984e3", "#00b894", "#ffd32a", "#ffffff", "#ff9f43", "#0984e3", "#e94560", "#00b894"].map(
                (color, i) => (
                  <div key={i} className="rounded-sm" style={{ backgroundColor: color }} />
                )
              )}
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#e94560] via-[#533483] to-[#0984e3] bg-clip-text text-transparent">
            CubeMaster
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-2">루빅스큐브 알고리즘 & 스피드큐빙 가이드</p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          입문자부터 스피드큐버까지, 레벨별로 체계적으로 배우는 루빅스큐브 완전 정복 가이드.
          최적의 알고리즘과 핑거트릭으로 기록을 단축하세요.
        </p>
      </section>

      {/* Level Cards */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">레벨 선택</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/level/${level.id}`}
              className="group block bg-card-bg border border-card-border rounded-2xl p-6 hover:border-opacity-60 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{ borderColor: `${level.color}33` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{level.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#e94560] transition-colors">
                      {level.title}
                    </h3>
                    <p className="text-sm text-gray-500">{level.subtitle}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${level.color}22`,
                    color: level.color,
                  }}
                >
                  {level.badge}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{level.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>목표 시간: <strong className="text-gray-300">{level.targetTime}</strong></span>
                <span>{level.algorithms}</span>
              </div>
              <div
                className="mt-4 h-1 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
                style={{ backgroundColor: level.color }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Timer CTA */}
      <section className="mb-16 text-center">
        <Link
          href="/timer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[#e94560] to-[#533483] text-white px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-transform shadow-lg"
        >
          <span className="text-2xl">⏱️</span>
          스피드큐빙 타이머
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <p className="text-gray-500 text-sm mt-3">스페이스바로 시작, 기록 저장 & 통계 분석</p>
      </section>

      {/* Notation Guide */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">큐브 표기법 (Notation)</h2>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
          큐브 알고리즘에서 사용하는 표기법입니다. {`'`} (프라임)은 반시계 방향, 숫자 2는 180도 회전을 의미합니다.
        </p>

        {/* Main face moves */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
          {notationGuide.filter((n) => !n.type).map((n) => {
            const faceColor = FACE_COLOR[n.face];
            return (
              <div
                key={n.move}
                className="bg-card-bg border border-card-border rounded-xl p-3 hover:scale-[1.03] transition-all group"
                style={{ borderColor: `${faceColor}30` }}
              >
                <div className="flex items-center gap-2">
                  {/* 3D isometric cube diagram */}
                  <CubeDiagram face={n.face} color={faceColor} dir={n.dir} />

                  <div className="flex-1 min-w-0">
                    <span
                      className="text-2xl font-mono font-black leading-none"
                      style={{ color: faceColor }}
                    >
                      {n.move}
                    </span>
                    <div className="text-[11px] text-gray-500 mt-1">{n.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-4xl mx-auto my-8">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-xs text-gray-400 font-semibold tracking-wide">특수 회전</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Slice & whole-cube rotations */}
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {notationGuide.filter((n) => n.type).map((n) => {
            const isSlice = n.type === "slice";
            const tagColor = isSlice ? "#a855f7" : "#c084fc";
            const tagLabel = isSlice ? "Slice" : "Rotation";
            const moveColor = isSlice ? "#a855f7" : "#c084fc";
            return (
              <div
                key={n.move}
                className="bg-card-bg border border-card-border rounded-xl px-3 py-3 flex items-center gap-2"
                style={{ borderColor: `${tagColor}30` }}
              >
                {isSlice ? (
                  <SliceDiagram dir={n.dir} />
                ) : (
                  <CubeRotationDiagram axis={n.move as "x" | "y" | "z"} dir={n.dir} />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono font-black" style={{ color: moveColor }}>
                      {n.move}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${tagColor}20`, color: tagColor }}
                    >
                      {tagLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">{n.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">학습 로드맵</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { phase: "1단계", title: "처음 맞추기", desc: "LBL 방법으로 큐브를 처음 완성 (Lv.1)", time: "1~2주" },
            { phase: "2단계", title: "1분 벽 깨기", desc: "CFOP 기초 + 직관적 F2L 습득 (Lv.2)", time: "1~2개월" },
            { phase: "3단계", title: "30초 벽 깨기", desc: "Full OLL/PLL 암기 완료 (Lv.3)", time: "3~6개월" },
            { phase: "4단계", title: "Sub-15 달성", desc: "핑거트릭 + Look-Ahead 최적화 (Lv.4)", time: "6개월~1년" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-card-bg border border-card-border rounded-xl p-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-[#e94560]/20 flex items-center justify-center text-[#e94560] font-bold text-sm">
                {item.phase}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
              <span className="text-xs text-gray-500 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm pb-8 border-t border-card-border pt-8">
        <p>CubeMaster - 루빅스큐브 마스터 가이드</p>
        <p className="mt-1">배포 : 리앤컴퍼니 이미경</p>
        <p className="mt-1">알고리즘 출처: CFOP Method (Jessica Fridrich)</p>
      </footer>
    </div>
  );
}
