"use client";

import type React from "react";
import { useEffect, useState } from "react";

type LoaderProps = {
  progress: number; // 0–100
};

export default function Loader({ progress }: LoaderProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      // Start fade out immediately when progress hits 100%
      setIsFading(true);
    }
  }, [progress]);

  return (
    <div
      className="loader-overlay"
      style={{
        opacity: isFading ? 0 : 1,
        transition: "opacity 0.6s ease-out",
        pointerEvents: isFading ? "none" : "auto",
      }}
    >
      <div className="loader-circle">
        
        <div className="loader-outer-arc" />

        <div className="loader-inner-arc" />

        <div className="progress-dots">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="dot-segment"
              style={{
                "--rotation": `${(360 / 48) * i}deg`,
                opacity: i < Math.round((progress / 100) * 48) ? 1 : 0.15
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="loader-inner">
          <span className="loader-percent">{Math.round(progress)}%</span>
        </div>
      </div>

      <p className="loader-text">Loading ...</p>
    </div>
  );
}
