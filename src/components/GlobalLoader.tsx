"use client";

import { useState, useEffect } from "react";
import useRealProgress from "@/hooks/useRealProgress";
import Loader from "./Loader";

export default function GlobalLoader() {
  const progress = useRealProgress();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show loader when progress starts
    if (progress > 0 && progress < 100) {
      setIsVisible(true);
    }
    // Hide when complete
    else if (progress >= 100) {
      setTimeout(() => setIsVisible(false), 600);
    }
  }, [progress]);

  if (!isVisible) return null;

  return <Loader progress={progress} />;
}
