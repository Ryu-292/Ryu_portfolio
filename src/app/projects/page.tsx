"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ThreeCanvas = dynamic(() => import("../../components/3DCarrousel"), { ssr: false });


export default function Projects() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="scanlines">
      <h1 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-4xl md:text-6xl font-bold text-[#f5f5f0] tracking-tight z-50">
        Projects
      </h1>
      
      <ThreeCanvas />
    </main>
  );
}
