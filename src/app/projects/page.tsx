"use client";

import dynamic from "next/dynamic";

const ThreeCanvas = dynamic(() => import("../../components/3DCarrousel"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#00A4FF]/20 border-t-[#00A4FF] rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-[#f5f5f0] text-sm opacity-70">Loading 3D Projects...</p>
      </div>
    </div>
  )
});

export default function Projects() {
  return (
    <main className="scanlines">
      <h1 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-4xl md:text-6xl font-bold text-[#f5f5f0] tracking-tight z-50">
        Projects
      </h1>
      
      <ThreeCanvas />
    </main>
  );
}
