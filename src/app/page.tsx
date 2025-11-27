"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import useRealProgress from "../hooks/useRealProgress";

const Intro = dynamic(() => import("../components/Intro"), { ssr: false });

export default function Projects() {
  const loadingProgress = useRealProgress();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Show intro only after loader finishes (progress >= 100)
    if (loadingProgress >= 100) {
      // Add small delay for smooth transition
      const timer = setTimeout(() => setShowIntro(true), 200);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  return (
    <main className="scanlines">
      {showIntro && <Intro />}
    </main>
  );
}
