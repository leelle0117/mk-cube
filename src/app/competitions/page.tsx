"use client";

import { useState } from "react";

interface Competition {
  name: string;
  nameKr: string;
  date: string;
  location: string;
  locationKr: string;
  type: "world" | "continental" | "national" | "open";
  status: "upcoming" | "registration" | "completed";
  link: string;
  description: string;
}

const competitions: Competition[] = [
  {
    name: "World Rubik's Cube Championship 2025",
    nameKr: "2025 루빅스큐브 월드챔피언십",
    date: "2025년 10월",
    location: "TBA",
    locationKr: "장소 미정",
    type: "world",
    status: "upcoming",
    link: "https://www.worldcubeassociation.org/competitions",
    description:
      "2년마다 개최되는 세계 최대 규모의 루빅스큐브 대회. 3x3, 2x2, 4x4, 블라인드, 원핸드 등 다양한 종목이 진행됩니다.",
  },
  {
    name: "Asian Championship 2026",
    nameKr: "2026 아시안 챔피언십",
    date: "2026년 (일정 미정)",
    location: "Asia",
    locationKr: "아시아 지역",
    type: "continental",
    status: "upcoming",
    link: "https://www.worldcubeassociation.org/competitions",
    description:
      "아시아 지역 최대 큐브 대회. 아시아 각국의 최고 큐버들이 경쟁합니다.",
  },
  {
    name: "Korea Open 2026",
    nameKr: "2026 코리아 오픈",
    date: "2026년 (일정 미정)",
    location: "Seoul, South Korea",
    locationKr: "대한민국 서울",
    type: "national",
    status: "upcoming",
    link: "https://www.worldcubeassociation.org/competitions?region=Korea",
    description:
      "대한민국에서 열리는 WCA 공인 대회. 국내 큐버들의 랭킹 경쟁과 교류의 장.",
  },
];

const worldRecords = [
  {
    event: "3x3x3",
    single: "3.13초",
    holder: "Max Park",
    average: "4.05초",
    avgHolder: "Yiheng Wang",
  },
  {
    event: "2x2x2",
    single: "0.43초",
    holder: "Teodor Zajder",
    average: "1.02초",
    avgHolder: "Zayn Khanani",
  },
  {
    event: "4x4x4",
    single: "16.79초",
    holder: "Max Park",
    average: "19.65초",
    avgHolder: "Max Park",
  },
  {
    event: "3x3 OH",
    single: "5.16초",
    holder: "Max Park",
    average: "7.88초",
    avgHolder: "Max Park",
  },
  {
    event: "3x3 BLD",
    single: "11.10초",
    holder: "Tommy Cherry",
    average: "14.67초",
    avgHolder: "Tommy Cherry",
  },
  {
    event: "Pyraminx",
    single: "0.75초",
    holder: "Dominik Górny",
    average: "1.44초",
    avgHolder: "Tymon Kolasiński",
  },
];

const usefulLinks = [
  {
    name: "World Cube Association (WCA)",
    url: "https://www.worldcubeassociation.org",
    description: "공식 세계큐브협회. 대회 검색, 랭킹, 규정 등",
    icon: "🌍",
  },
  {
    name: "WCA 대회 검색",
    url: "https://www.worldcubeassociation.org/competitions",
    description: "전 세계 WCA 공인 대회 일정 검색",
    icon: "🔍",
  },
  {
    name: "WCA 한국 대회",
    url: "https://www.worldcubeassociation.org/competitions?region=Korea",
    description: "한국에서 열리는 WCA 공인 대회 목록",
    icon: "🇰🇷",
  },
  {
    name: "WCA Live Results",
    url: "https://live.worldcubeassociation.org",
    description: "진행 중인 대회 실시간 결과",
    icon: "📡",
  },
  {
    name: "CubeComps",
    url: "https://cubecomps.cubing.net",
    description: "대회 결과 및 라이브 스코어보드",
    icon: "📊",
  },
  {
    name: "SpeedSolving Forum",
    url: "https://www.speedsolving.com/forum",
    description: "세계 최대 스피드큐빙 커뮤니티 포럼",
    icon: "💬",
  },
  {
    name: "CubeSkills (by Feliks Zemdegs)",
    url: "https://www.cubeskills.com",
    description: "전 세계 챔피언 Feliks의 튜토리얼 사이트",
    icon: "🎓",
  },
  {
    name: "JPerm.net",
    url: "https://jperm.net",
    description: "인기 유튜버 J Perm의 알고리즘 & 튜토리얼",
    icon: "📺",
  },
  {
    name: "알고리즘 DB (AlgDB)",
    url: "https://algdb.net",
    description: "OLL/PLL/ZBLL 등 알고리즘 데이터베이스",
    icon: "🗃️",
  },
  {
    name: "csTimer",
    url: "https://cstimer.net",
    description: "가장 많이 쓰이는 온라인 큐브 타이머",
    icon: "⏱️",
  },
];

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  world: { bg: "bg-[#e94560]/20", text: "text-[#e94560]", label: "월드 챔피언십" },
  continental: { bg: "bg-[#533483]/20", text: "text-[#a78bfa]", label: "대륙 대회" },
  national: { bg: "bg-[#0984e3]/20", text: "text-[#0984e3]", label: "국가 대회" },
  open: { bg: "bg-[#00b894]/20", text: "text-[#00b894]", label: "오픈 대회" },
};

const statusLabels: Record<string, { color: string; label: string }> = {
  upcoming: { color: "text-[#fdcb6e]", label: "예정" },
  registration: { color: "text-[#00b894]", label: "등록 중" },
  completed: { color: "text-gray-500", label: "종료" },
};

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState<"competitions" | "records" | "links">("competitions");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#e94560] to-[#fdcb6e] bg-clip-text text-transparent">
            스피드큐브 월드챔피언 & 대회
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          WCA 공인 대회 일정, 세계 기록, 유용한 링크를 한곳에서 확인하세요.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {[
          { key: "competitions" as const, label: "대회 일정", icon: "🏆" },
          { key: "records" as const, label: "세계 기록", icon: "🥇" },
          { key: "links" as const, label: "유용한 링크", icon: "🔗" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[#e94560] text-white shadow-lg"
                : "bg-card-bg border border-card-border text-gray-400 hover:text-white"
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Competitions Tab */}
      {activeTab === "competitions" && (
        <div className="space-y-6">
          {/* WCA Notice */}
          <div className="bg-[#e94560]/10 border border-[#e94560]/20 rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-300 mb-3">
              모든 공식 대회는 <strong className="text-white">World Cube Association (WCA)</strong>에서 관리됩니다.
              최신 일정과 등록은 WCA 공식 사이트에서 확인하세요.
            </p>
            <a
              href="https://www.worldcubeassociation.org/competitions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e94560] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#ff6b81] transition-colors"
            >
              🌍 WCA 대회 검색 바로가기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Competition Cards */}
          {competitions.map((comp, i) => {
            const typeStyle = typeColors[comp.type];
            const statusStyle = statusLabels[comp.status];
            return (
              <a
                key={i}
                href={comp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card-bg border border-card-border rounded-2xl p-6 hover:border-[#e94560]/30 transition-all group"
              >
                <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                        {typeStyle.label}
                      </span>
                      <span className={`text-xs font-medium ${statusStyle.color}`}>
                        ● {statusStyle.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#e94560] transition-colors">
                      {comp.nameKr}
                    </h3>
                    <p className="text-sm text-gray-500">{comp.name}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-[#e94560] transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 mb-3">{comp.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    📅 {comp.date}
                  </span>
                  <span className="flex items-center gap-1">
                    📍 {comp.locationKr}
                  </span>
                </div>
              </a>
            );
          })}

          {/* How to participate */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">🎯 대회 참가 방법</h3>
            <div className="space-y-3">
              {[
                { step: "1", title: "WCA 계정 생성", desc: "worldcubeassociation.org에서 무료 계정을 만드세요." },
                { step: "2", title: "대회 검색", desc: "Competitions 페이지에서 가까운 대회를 찾으세요." },
                { step: "3", title: "등록", desc: "대회 페이지에서 Register 버튼을 클릭. 참가비는 보통 1~3만원." },
                { step: "4", title: "규정 숙지", desc: "WCA 규정을 읽어보세요. 인스펙션 15초, +2/DNF 페널티 등." },
                { step: "5", title: "대회 참가", desc: "큐브와 신분증을 가져가세요. 큐브는 대회 규격이어야 합니다." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#e94560]/20 flex items-center justify-center text-[#e94560] text-xs font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <span className="font-medium text-white text-sm">{item.title}</span>
                    <span className="text-gray-400 text-sm"> - {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* World Records Tab */}
      {activeTab === "records" && (
        <div>
          <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-card-border">
              <h3 className="font-semibold text-white">WCA 세계 기록 (2025 기준)</h3>
              <p className="text-xs text-gray-500 mt-1">기록은 수시로 갱신됩니다. 최신 기록은 WCA 공식 사이트를 확인하세요.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 text-xs border-b border-card-border">
                  <tr>
                    <th className="px-4 py-3 text-left">종목</th>
                    <th className="px-4 py-3 text-left">단일 기록</th>
                    <th className="px-4 py-3 text-left">기록 보유자</th>
                    <th className="px-4 py-3 text-left">평균 기록</th>
                    <th className="px-4 py-3 text-left">기록 보유자</th>
                  </tr>
                </thead>
                <tbody>
                  {worldRecords.map((record, i) => (
                    <tr key={i} className="border-b border-card-border/50 hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">{record.event}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#e94560]">{record.single}</td>
                      <td className="px-4 py-3 text-gray-400">{record.holder}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#fdcb6e]">{record.average}</td>
                      <td className="px-4 py-3 text-gray-400">{record.avgHolder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://www.worldcubeassociation.org/results/records"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#e94560] hover:text-[#ff6b81] transition-colors"
            >
              전체 세계 기록 보기 (WCA)
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Useful Links Tab */}
      {activeTab === "links" && (
        <div className="grid md:grid-cols-2 gap-4">
          {usefulLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card-bg border border-card-border rounded-2xl p-5 hover:border-[#e94560]/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white group-hover:text-[#e94560] transition-colors truncate">
                      {link.name}
                    </h3>
                    <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#e94560] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{link.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
