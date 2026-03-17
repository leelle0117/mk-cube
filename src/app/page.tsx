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

const notationGuide = [
  { move: "R", desc: "오른면 시계 90°" },
  { move: "R'", desc: "오른면 반시계 90°" },
  { move: "R2", desc: "오른면 180°" },
  { move: "L", desc: "왼면 시계 90°" },
  { move: "U", desc: "윗면 시계 90°" },
  { move: "D", desc: "아랫면 시계 90°" },
  { move: "F", desc: "앞면 시계 90°" },
  { move: "B", desc: "뒷면 시계 90°" },
  { move: "M", desc: "중간층 (L방향)" },
  { move: "x", desc: "큐브 전체 (R방향)" },
  { move: "y", desc: "큐브 전체 (U방향)" },
  { move: "z", desc: "큐브 전체 (F방향)" },
];

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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
          {notationGuide.map((n) => (
            <div
              key={n.move}
              className="bg-card-bg border border-card-border rounded-xl p-3 text-center hover:border-[#e94560]/30 transition-colors"
            >
              <div className="text-lg font-mono font-bold text-[#e94560] mb-1">{n.move}</div>
              <div className="text-xs text-gray-500">{n.desc}</div>
            </div>
          ))}
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
        <p className="mt-1">알고리즘 출처: CFOP Method (Jessica Fridrich)</p>
      </footer>
    </div>
  );
}
