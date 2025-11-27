import { useEffect, useState } from "react";

export default function useRealProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0); // Reset progress

    // Increment 1% every 50ms (smooth animation)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        return prev;
      });
    }, 50);

    // Track images to speed up progress
    const imageInterval = setInterval(() => {
      const images = document.querySelectorAll("img");
      if (images.length === 0) return;

      let loaded = 0;
      images.forEach((img) => {
        if (img.complete) loaded++;
      });

      const imageProgress = (loaded / images.length) * 70; // Images can get us to 70%
      setProgress((prev) => Math.max(prev, 10 + imageProgress));
    }, 200);

    // When page fully loads, jump to 90%
    const handleLoad = () => {
      setProgress((prev) => Math.max(prev, 90));
    };

    window.addEventListener("load", handleLoad);

    // Force completion at 100% after max time
    const finalTimer = setTimeout(() => {
      setProgress(100);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(imageInterval);
      window.removeEventListener("load", handleLoad);
      clearTimeout(finalTimer);
    };
  }, []);

  return progress;
}

