"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import Three.js to ensure client-side loading
const ThreeIntro = dynamic(() => import('./ThreeIntro'), {
  ssr: false,
  loading: () => (
    <div className="holo-canvas flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#00A4FF]/20 border-t-[#00A4FF] rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-[#f5f5f0] text-sm opacity-70">Loading 3D Scene...</p>
      </div>
    </div>
  )
});

type Props = { imageSrc?: string };

export default function Intro({
  imageSrc = "/images/portrait1.png",
}: Props) {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="holo-root">
        <section className="intro-block">
          <p className="intro-katakana">
            クリエイティブテクノロジーエンジニア · 東京／パリ
          </p>
          <h1 className="intro-name">Hi, I&apos;m Ryu!</h1>
          <p className="intro-tagline">
            I&apos;m a creative technology engineering student in Paris.
          </p>
          <p className="intro-body">
            I explore the intersection of Japanese tradition and technology
            through immersive art installations and playful objects. <br />
            By bridging ancient concepts with contemporary innovation, my goal is to create new interactive
            experiences that help people reconnect with tradition and with others through shared moments.
          </p>
        </section>
        <div className="holo-canvas flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#00A4FF]/20 border-t-[#00A4FF] rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-[#f5f5f0] text-sm opacity-70">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holo-root">
        <section className="intro-block">
          <p className="intro-katakana">
            クリエイティブテクノロジーエンジニア · 東京／パリ
          </p>
          <h1 className="intro-name">Hi, I&apos;m Ryu!</h1>
          <p className="intro-tagline">
            I&apos;m a creative technology engineering student in Paris.
          </p>
          <p className="intro-body">
            I explore the intersection of Japanese tradition and technology
            through immersive art installations and playful objects. <br />
            By bridging ancient concepts with contemporary innovation, my goal is to create new interactive
            experiences that help people reconnect with tradition and with others through shared moments.
          </p>
        </section>
        <div className="holo-canvas flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">3D Scene failed to load</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#00A4FF] text-white rounded"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="holo-root">
      {/* Intro overlay (left) */}
      <section className="intro-block">
        <p className="intro-katakana">
          クリエイティブテクノロジーエンジニア · 東京／パリ
        </p>

        <h1 className="intro-name">Hi, I&apos;m Ryu!</h1>

        <p className="intro-tagline">
          I&apos;m a creative technology engineering student in Paris.
        </p>

        <p className="intro-body">
          I explore the intersection of Japanese tradition and technology
          through immersive art installations and playful objects. <br />
          By bridging ancient concepts with contemporary innovation, my goal is to create new interactive
          experiences that help people reconnect with tradition and with others through shared moments.
        </p>
      </section>

      {/* Three.js canvas host (right) */}
      <ThreeIntro imageSrc={imageSrc} onError={setError} />
    </div>
  );
}
