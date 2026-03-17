"use client";

interface CubeVisualizerProps {
  state?: string[][];
  size?: number;
  label?: string;
}

const defaultColors: Record<string, string> = {
  W: "#ffffff",
  Y: "#ffd32a",
  R: "#e94560",
  O: "#ff9f43",
  B: "#0984e3",
  G: "#00b894",
  X: "#333333",
};

// 3x3 flat view of a single face
function Face({ colors, size = 60 }: { colors: string[]; size?: number }) {
  const cellSize = size / 3;
  const gap = 1;

  return (
    <div
      className="grid grid-cols-3 rounded-md overflow-hidden"
      style={{
        width: size,
        height: size,
        gap: `${gap}px`,
        backgroundColor: "#111",
        padding: `${gap}px`,
      }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          className="rounded-[2px]"
          style={{
            width: cellSize - gap * 2,
            height: cellSize - gap * 2,
            backgroundColor: defaultColors[color] || color,
          }}
        />
      ))}
    </div>
  );
}

// Unfolded cube display (cross/T layout)
export default function CubeVisualizer({
  state,
  size = 72,
  label,
}: CubeVisualizerProps) {
  // Default solved state: [U, D, F, B, R, L]
  const defaultState = [
    ["W", "W", "W", "W", "W", "W", "W", "W", "W"], // U
    ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"], // D
    ["G", "G", "G", "G", "G", "G", "G", "G", "G"], // F
    ["B", "B", "B", "B", "B", "B", "B", "B", "B"], // B
    ["R", "R", "R", "R", "R", "R", "R", "R", "R"], // R
    ["O", "O", "O", "O", "O", "O", "O", "O", "O"], // L
  ];

  const faces = state || defaultState;

  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span className="text-xs text-gray-400 mb-1">{label}</span>
      )}
      <div className="flex flex-col items-center" style={{ gap: "2px" }}>
        {/* U face */}
        <div style={{ marginLeft: 0 }}>
          <Face colors={faces[0]} size={size} />
        </div>
        {/* L F R B in a row */}
        <div className="flex" style={{ gap: "2px" }}>
          <Face colors={faces[5]} size={size} />
          <Face colors={faces[2]} size={size} />
          <Face colors={faces[4]} size={size} />
          <Face colors={faces[3]} size={size} />
        </div>
        {/* D face */}
        <div style={{ marginLeft: 0 }}>
          <Face colors={faces[1]} size={size} />
        </div>
      </div>
    </div>
  );
}

// Single face display for algorithm illustrations
export function SingleFace({
  colors,
  size = 80,
  label,
}: {
  colors: string[];
  size?: number;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-xs text-gray-400">{label}</span>}
      <Face colors={colors} size={size} />
    </div>
  );
}
