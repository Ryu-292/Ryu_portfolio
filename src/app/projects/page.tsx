"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const ThreeCanvas = dynamic(() => import("../../components/3DCarrousel"), { ssr: false });


export default function Projects() {

  return (
    <main className="scanlines">
      <h1 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-4xl md:text-6xl font-bold text-[#f5f5f0] tracking-tight z-50">
        Projects
      </h1>
      
      <ThreeCanvas />

      {/* Floating Navigation Buttons */}
      {/* Left Button - Home */}
      <Link href="/">
          <div className="fixed left-1 md:left-8 top-1/2 transform -translate-y-1/2 z-10 group cursor-pointer">
          <div className="holographic-arrow">
            <img 
              src="/images/arrowSVG.svg" 
              alt="Previous" 
              width="40" 
              height="40" 
              className="transform rotate-180" 
            />
          </div>
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
            <span className="text-sm text-white bg-[#000021]/95 px-4 py-2 rounded-full border border-[#00A4FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,164,255,0.3)] hover:shadow-[0_0_30px_rgba(0,164,255,0.5)] transition-all duration-300">Home</span>
          </div>
        </div>
      </Link>

      {/* Right Button - My Lab */}
      <Link href="/mylab">
          <div className="fixed right-1 md:right-8 top-1/2 transform -translate-y-1/2 z-10 group cursor-pointer">
          <div className="holographic-arrow">
            <img 
              src="/images/arrowSVG.svg" 
              alt="Next" 
              width="40" 
              height="40" 
              className="" 
            />
          </div>
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
            <span className="text-sm text-white bg-[#000021]/95 px-4 py-2 rounded-full border border-[#00A4FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,164,255,0.3)] hover:shadow-[0_0_30px_rgba(0,164,255,0.5)] transition-all duration-300">My Lab</span>
          </div>
        </div>
      </Link>
    </main>
  );
}
