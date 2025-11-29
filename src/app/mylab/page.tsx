"use client";

import React, {
  useState,
  useRef,
  useEffect,
  TouchEvent as ReactTouchEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type LabProject = {
  id: string;
  title: string;
  tag: string;
  description: string;
  image?: string;
  images?: string[];
  link?: string;
};

const PROJECTS: LabProject[] = [
  {
    id: "lab-introduction",
    title: "Welcome to My Lab",
    tag: "Introduction • Philosophy • Exploration",
    description:
      "Welcome to my lab — a showcase of my side projects and coursework. Each project represents a different challenge I've tackled across various domains.",
    image: "/images/Arduino/wiring.png",
  },
  {
    id: "audio-reactive-sakura",
    title: "Audio Reactive Sakura Generation",
    tag: "TouchDesigner • StreamDiffusion • Audio Visual",
    description:
      "Real-time audio-reactive image generation using TouchDesigner and StreamDiffusion plugin. Creates blooming sakura flowers that dynamically respond to audio frequencies, transforming sound into visual poetry.",
    images: [
      "/images/Touchdesigner/Audiosakura.mp4",
      "/images/Touchdesigner/TDSakura.png"
    ],
  },
  {
    id: "sakekagami-poster",
    title: "Sakekagami Poster",
    tag: "Photoshop • Figma",
    description:
      "Poster made for internship to present my Sakekagami project showcasing the masu. I used a background that resembles washi paper, traditional Japanese paper, and made shapes to show water ripples/waves with my hand holding the masu in the center.",
    image: "/images/Sakekagami/sakekagamiPoster.png",
  },
  {
    id: "portfolio-website",
    title: "Portfolio",
    tag: "HTML • CSS • Next.js • Three.js",
    description:
      "Personal portfolio website showcasing creative projects and technical skills. Built with Next.js and Three.js for immersive 3D experiences, featuring responsive design and interactive elements.",
    images: [
      "/images/portfolio/home.png",
      "/images/portfolio/projects.png",
      "/images/portfolio/myLab.png"
    ],
  },
  {
    id: "arduino-laser-game",
    title: "Arduino Laser Game",
    tag: "Arduino • Laser • Photography",
    description:
      "Two-axis laser control system using servo motors and joystick input. Created light drawings through long-exposure photography, with automated flower patterns and dynamic zigzag effects from servo instability.",
    images: [
      "/images/Arduino/laser1.png",
      "/images/Arduino/laser2.png", 
      "/images/Arduino/laser3.png",
      "/images/Arduino/laser4.png",
      "/images/Arduino/wiring.png"
    ],
  },
  {
    id: "mnist-classifier",
    title: "MNIST Digit Classifier",
    tag: "Machine Learning • Neural Network • Web App",
    description:
      "Browser-based digit recognition using TinyGrad and WebGPU. Train MLP/CNN models in Python, export to safetensors, and run real-time inference directly in your browser without servers.",
    image: "/images/Mnist/mnist1.png",
    link: "https://ryu-292.github.io/MNIST_DigitClassifier/"
  },
  {
    id: "laser-security-system",
    title: "Ryu VS Lucas", 
    tag: "ESP32 • Mini Game • WebSocket",
    description:
      "1-vs-1 fighting game using two custom ESP32 boards. Features pixel art characters with attack mechanics, WebSocket connectivity, and fast-paced button combat where speed determines victory.",
    images: [
      "/images/Arduino/RyuVsLucas.png",
      "/images/Arduino/chMoving.mp4",
      "/images/Arduino/game.mp4",
      "/images/Arduino/board.jpg", 
      "/images/Arduino/board2.jpg",
      "/images/Arduino/board3.jpg",
    ],
  },
  {
    id: "satellite-antenna",
    title: "Satellite Signal Reception",
    tag: "RF Engineering • SDR • Signal Processing",
    description:
      "Built V-dipole antenna system to intercept NOAA weather satellite transmissions at 137-138 MHz. Used RTL-SDR and WXtoImg to decode satellite images, then created cyanotype prints using traditional photographic processes.",
    images: [
      "/images/Antenna/Antenna.png",
      "/images/Antenna/Antenna1.png",
      "/images/Antenna/Antenna2.png",
      "/images/Antenna/Antenna3.jpg",
      "/images/Antenna/Antenna4.jpg",
      "/images/Antenna/Antenna5.png"
    ],
  },
  {
    id: "arduino-wiring-project",
    title: "Honda HA-420",
    tag: "3D Design • SolidWorks • CAD",
    description:
      "Full-scale 3D model of the HondaJet HA-420 in SolidWorks - the first aircraft to fly with renewable biofuel from Euglena microalgae. Complete assembly from blueprints with accurate proportions and component modeling.",
    images: [
      "/images/3D/HondaJet3D_part1.png",
      "/images/3D/HondaJet3D_part2.png",
      "/images/3D/HondaJet3D_part3.png",
      "/images/3D/HondaJet3D_part4.png",
      "/images/3D/HondaJet3D_part5.png",
      "/images/3D/HondaJet3D_part6.png",
      "/images/3D/HondaJet3D2.png",
      "/images/3D/HondaJet3D3.png",
      "/images/3D/HondaJet3D4.png"
    ],
  },

];

type Direction = 1 | -1;

export default function MyLabPage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const current = PROJECTS[index];
  const currentImages = current.images || (current.image ? [current.image] : []);
  const currentImage = currentImages[imageIndex];

  // Manual image navigation
  const goToImage = (direction: 'next' | 'prev') => {
    if (!current.images || current.images.length <= 1) return;
    
    setImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % current.images!.length;
      } else {
        return prev === 0 ? current.images!.length - 1 : prev - 1;
      }
    });
  };

  // Open image modal
  const openImageModal = (imageSrc: string) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  // ---- Helpers ----
  const goToSlide = (dir: Direction) => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);

    setIndex((prev) => {
      const next = (prev + dir + PROJECTS.length) % PROJECTS.length;
      return next;
    });
  };

  // Mouse wheel → change project
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 25) return; // ignore micro scrolls
      goToSlide(e.deltaY > 0 ? 1 : -1);
    };

    container.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [isAnimating, goToSlide]);

  // Touch (mobile) → change project
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    
    // Check if it's primarily a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      // Horizontal swipe: left → next, right → previous
      goToSlide(deltaX < 0 ? 1 : -1);
    }
    // Fall back to vertical swipe if horizontal isn't detected
    else if (Math.abs(deltaY) > 40) {
      // Vertical swipe: up → next, down → previous
      goToSlide(deltaY < 0 ? 1 : -1);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Auto-cycle through images every 3 seconds, or wait for video to end
  useEffect(() => {
    if (!current.images || current.images.length <= 1) return;
    
    // If current item is a video, don't auto-advance (let video end handler do it)
    if (currentImage?.endsWith('.mp4') && isVideoPlaying) return;
    
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % current.images!.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [current.images, currentImage, isVideoPlaying]);

  // Reset image index when project changes
  useEffect(() => {
    setImageIndex(0);
  }, [index]);

  // ---- Framer Motion variants (parallax effect) ----
  const textVariants = {
    enter: (dir: Direction) => ({
      y: dir * 40,
      opacity: 0,
      filter: "blur(6px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: Direction) => ({
      y: -dir * 40,
      opacity: 0,
      filter: "blur(6px)",
      transition: {
        duration: 0.5,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    }),
  };

  const imageVariants = {
    enter: (dir: Direction) => ({
      y: dir * 80,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1.03,
      transition: {
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1] as const,
      },
    },
    exit: (dir: Direction) => ({
      y: -dir * 80,
      opacity: 0,
      scale: 0.97,
      transition: {
        duration: 0.55,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    }),
  };

  return (
    <main className="scanlines" style={{ paddingLeft: 0 }}>
      <h1 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-4xl md:text-6xl font-bold text-[#f5f5f0] tracking-tight z-50">
        My Lab
      </h1>
      <div
        ref={containerRef}
        className="relative min-h-screen w-full overflow-hidden bg-[#000021] text-slate-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        

        {/* --- Top bar --- */}
       

        {/* --- Main carousel area --- */}
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 pb-10 pt-20 md:px-16">
          <AnimatePresence
            custom={direction}
            mode="wait"
            onExitComplete={() => setIsAnimating(false)}
          >
            <motion.div
              key={current.id}
              className={`w-full max-w-6xl ${
                current.id === "lab-introduction" 
                  ? "flex items-center justify-center" 
                  : "grid items-center gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
              }`}
              custom={direction}
            >
              {/* -------- INTRODUCTION LAYOUT -------- */}
              {current.id === "lab-introduction" ? (
                <motion.div
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={direction}
                  className="text-center max-w-4xl space-y-8"
                >

                  <p className="text-lg leading-relaxed text-[#f5f5f0] opacity-90 md:text-xl max-w-3xl mx-auto">
                    {current.description}
                    <br />
                    <br />
                    This is where I try, fail, and move on!
                  </p>

                  <div className="flex justify-center items-center gap-4 text-sm text-[#f5f5f0] opacity-70">
                    <div className="flex items-center gap-2">
                      <span className="h-px w-12 bg-[#00A4FF]/60" />
                      <span>Scroll down / Swipe to explore projects</span>
                      <span className="h-px w-12 bg-[#00A4FF]/60" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* -------- LEFT: text -------- */}
                  <motion.div
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={direction}
                    className="space-y-7"
                  >
                    <div className="inline-flex items-center gap-3 rounded-full border border-[#00A4FF]/40 bg-[#00A4FF]/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[#8abaff]">
                      <span className="h-1 w-1 rounded-full bg-[#00A4FF]" />
                      <span>Experiment {index}</span>
                      <span className="text-slate-500">/ {PROJECTS.length - 1}</span>
                    </div>

                    <div className="space-y-3">
                      <h1 className="text-3xl font-semibold tracking-tight text-[#f5f5f0] md:text-4xl">
                        {current.title}
                      </h1>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8abaff]">
                        {current.tag}
                      </p>
                    </div>

                    <p className="max-w-xl text-sm leading-relaxed text-[#f5f5f0] opacity-90 md:text-base">
                      {current.description}
                    </p>

                    {current.link && (
                      <a
                        href={current.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#00A4FF]/10 border border-[#00A4FF]/40 px-4 py-2 text-sm text-[#8abaff] hover:bg-[#00A4FF]/20 hover:text-[#f5f5f0] transition-all duration-200"
                      >
                        <span>Try It Live</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                        </svg>
                      </a>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#f5f5f0] opacity-70">
                      
                      <div className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        <span>Scroll / swipe to switch project</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* -------- RIGHT: floating image "incubator" -------- */}
                  <motion.div
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={direction}
                    className="flex justify-center md:justify-end"
                  >
                    <motion.div
                      className="relative aspect-[3/2] w-full max-w-lg overflow-hidden rounded-3xl border border-[#00A4FF]/40 bg-transparent shadow-[0_0_60px_rgba(0,164,255,0.35)] backdrop-blur-xl"
                      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                      transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    >
                      {/* image/video with auto-cycle */}
                      <div 
                        className="relative z-10 h-full w-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
                        onClick={() => openImageModal(currentImage)}
                      >
                        {currentImage?.endsWith('.mp4') ? (
                          <motion.video
                            key={currentImage}
                            autoPlay
                            loop={false}
                            muted
                            playsInline
                            controls={false}
                            preload="metadata"
                            className="h-full w-full object-cover rounded-3xl pointer-events-none"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1.02, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            onPlay={() => setIsVideoPlaying(true)}
                            onEnded={() => {
                              setIsVideoPlaying(false);
                              // Auto-advance to next image when video ends
                              setTimeout(() => {
                                setImageIndex((prev) => (prev + 1) % current.images!.length);
                              }, 500);
                            }}
                            onLoadedData={(e) => {
                              const video = e.target as HTMLVideoElement;
                              video.play().catch(() => {
                                // Fallback if autoplay fails
                                setIsVideoPlaying(false);
                              });
                            }}
                          >
                            <source src={currentImage} type="video/mp4" />
                            Your browser does not support the video tag.
                          </motion.video>
                        ) : (
                          <motion.img
                            key={currentImage}
                            src={currentImage}
                            alt={current.title}
                            className="h-full w-full object-cover rounded-3xl"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1.02, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        )}
                      </div>                      {/* Navigation arrows */}
                      {current.images && current.images.length > 1 && (
                        <>
                          <button
                            onClick={() => goToImage('prev')}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#000021]/80 border border-[#00A4FF]/40 flex items-center justify-center text-[#f5f5f0] hover:bg-[#00A4FF]/20 transition-all duration-200"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => goToImage('next')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#000021]/80 border border-[#00A4FF]/40 flex items-center justify-center text-[#f5f5f0] hover:bg-[#00A4FF]/20 transition-all duration-200"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {/* Image indicators */}
                      {current.images && current.images.length > 1 && (
                        <div className="absolute z-50 bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {current.images.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-6 rounded-full transition-all duration-300 ${
                                i === imageIndex ? 'bg-[#00A4FF]' : 'bg-slate-600/40'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* --- Side bullets indicator (Desktop) --- */}
          <div className="pointer-events-none absolute inset-y-0 right-4 md:flex hidden flex-col items-center justify-center gap-3 text-xs text-slate-500 md:right-10">
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className={`h-7 w-[1px] overflow-hidden rounded-full ${
                  i === index
                    ? "bg-gradient-to-b from-[#00A4FF] to-[#8abaff]"
                    : "bg-slate-600/40"
                }`}
              >
                <div className="h-full w-full" />
              </div>
            ))}
          </div>

          {/* --- Bottom bullets indicator (Mobile) --- */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 transform -translate-x-1/2 flex md:hidden items-center justify-center gap-3 text-xs text-slate-500">
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className={`w-7 h-[1px] overflow-hidden rounded-full ${
                  i === index
                    ? "bg-gradient-to-r from-[#00A4FF] to-[#8abaff]"
                    : "bg-slate-600/40"
                }`}
              >
                <div className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {isModalOpen && modalImage && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
                <motion.div
                className="relative max-w-[90vw] max-h-[90vh] rounded-2xl border border-[#00A4FF]/40 bg-transparent shadow-[0_0_80px_rgba(0,164,255,0.5)] backdrop-blur-xl overflow-hidden"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 0.9, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {modalImage?.endsWith('.mp4') ? (
                  <video
                    src={modalImage}
                    controls
                    autoPlay
                    muted
                    className="w-full h-full object-contain rounded-2xl"
                    style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                  />
                ) : (
                  <img
                    src={modalImage}
                    alt="Enlarged view"
                    className="w-full h-full object-contain rounded-2xl"
                    style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                  />
                )}                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#000021]/80 border border-[#00A4FF]/40 flex items-center justify-center text-[#f5f5f0] hover:bg-[#00A4FF]/20 transition-all duration-200 z-10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Navigation Buttons */}
      {/* Left Button - Projects */}
      <Link href="/projects">
        <div className="fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-[99999] group cursor-pointer">
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
            <span className="text-sm text-white bg-[#000021]/95 px-4 py-2 rounded-full border border-[#00A4FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,164,255,0.3)] hover:shadow-[0_0_30px_rgba(0,164,255,0.5)] transition-all duration-300">Projects</span>
          </div>
        </div>
      </Link>

      {/* Right Button - Home */}
      <Link href="/">
        <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-[99999] group cursor-pointer">
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
            <span className="text-sm text-white bg-[#000021]/95 px-4 py-2 rounded-full border border-[#00A4FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,164,255,0.3)] hover:shadow-[0_0_30px_rgba(0,164,255,0.5)] transition-all duration-300">Home</span>
          </div>
        </div>
      </Link>
    </main>
  );
}