"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import useRealProgress from "@/hooks/useRealProgress";
import Reveal from "@/components/Reveal";

export default function TerubotPage() {
  const loadingProgress = useRealProgress();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (loadingProgress >= 100) {
      const timer = setTimeout(() => setShowContent(true), 200);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  return (
    <main className="min-h-screen bg-[#000021] text-white overflow-hidden flex items-center justify-center">
      {showContent && (
        <div className="mx-auto max-w-4xl px-6 text-center space-y-8">
          <Reveal delay={0.2}>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-[#00A4FF]/70">
                Robotics • Human Robotic Interaction
              </p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#f5f5f0]">
                Terubot
              </h1>
              <div className="h-px w-24 bg-[#00A4FF]/50 mx-auto my-6" />
              <h2 className="text-xl md:text-2xl text-white/80 font-light">
                Coming Soon
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="text-base md:text-lg leading-relaxed text-white/70 max-w-2xl mx-auto">
              "Teru tell me the weather!" <br />
              <br />
              Inspired by the Japanese folklore of Teru Teru Bozu, Terubot is a social robot designed to interact with humans through voice commands and gestures.
              Instead of wishing for good weather, what if it could mesure a community emotional weather?
            </p>
          </Reveal>
        </div>
      )}
    </main>
  );
}
