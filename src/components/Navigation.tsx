"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/level/1", label: "Lv.1 입문", icon: "🟢" },
  { href: "/level/2", label: "Lv.2 중급", icon: "🟡" },
  { href: "/level/3", label: "Lv.3 고급", icon: "🟠" },
  { href: "/level/4", label: "Lv.4 스피드", icon: "🔴" },
  { href: "/timer", label: "타이머", icon: "⏱️" },
  { href: "/simulator", label: "LBL 풀이보기", icon: "🧊" },
  { href: "/simulator/optimal", label: "3D 시뮬레이터", icon: "⚡" },
  { href: "/competitions", label: "대회/월드컵", icon: "🏆" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 grid grid-cols-2 grid-rows-2 gap-0.5 group-hover:rotate-45 transition-transform duration-300">
              <div className="bg-[#e94560] rounded-sm" />
              <div className="bg-[#0984e3] rounded-sm" />
              <div className="bg-[#00b894] rounded-sm" />
              <div className="bg-[#ffd32a] rounded-sm" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#e94560] to-[#533483] bg-clip-text text-transparent">
              CubeMaster
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-accent/20 text-accent"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-2 border-t border-card-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-accent/20 text-accent"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
