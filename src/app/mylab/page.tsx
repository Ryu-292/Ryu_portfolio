"use client";

import React, { useState, useEffect } from "react";
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
    tag: "",
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
      "/images/Arduino/wiring.png",
      "/images/Arduino/videoLaserWall.mp4"
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
      "/images/3D/HondaJet3D2.png",
      "/images/3D/HondaJet3D_part1.png",
      "/images/3D/HondaJet3D_part2.png",
      "/images/3D/HondaJet3D_part3.png",
      "/images/3D/HondaJet3D_part4.png",
      "/images/3D/HondaJet3D_part5.png",
      "/images/3D/HondaJet3D_part6.png",
      "/images/3D/HondaJet3D3.png",
      "/images/3D/HondaJet3D4.png"
    ],
  },

];

export default function MyLabPage() {
  const [selectedProject, setSelectedProject] = useState<LabProject | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const introProject = PROJECTS.find((p) => p.id === "lab-introduction");
  const gridProjects = PROJECTS.filter((p) => p.id !== "lab-introduction");

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      setModalImageIndex(0);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  const nextModalImage = () => {
    if (!selectedProject) return;
    const images = selectedProject.images || (selectedProject.image ? [selectedProject.image] : []);
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    if (!selectedProject) return;
    const images = selectedProject.images || (selectedProject.image ? [selectedProject.image] : []);
    setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <main className="scanlines min-h-screen w-full bg-[#000021] text-slate-100 overflow-y-auto pb-32 -ml-[60px] max-md:ml-0">
      {/* Title */}
      <h1 className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl md:text-6xl font-bold text-[#f5f5f0] tracking-tight z-10 whitespace-nowrap">
        My Lab
      </h1>

      {/* Intro Section */}
      {introProject && (
        <div className="max-w-4xl mx-auto px-6 text-center pt-32 mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg leading-relaxed text-[#f5f5f0] opacity-90 md:text-xl">
              {introProject.description}
            </p>
          </motion.div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto pl-4 pr-8 md:pl-6 md:pr-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {gridProjects.map((project, idx) => {
           const previewImage = project.image || (project.images && project.images[0]);
           const isVideo = previewImage?.endsWith(".mp4");

           return (
            <motion.div
              key={project.id}
              layoutId={`card-${project.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group relative aspect-[4/3] cursor-pointer rounded-2xl border border-[#00A4FF]/60 bg-[#00A4FF]/5 overflow-hidden shadow-[0_0_20px_rgba(0,164,255,0.2)] hover:border-[#00A4FF]/80 hover:shadow-[0_0_35px_rgba(0,164,255,0.35)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-transparent group-hover:bg-[#000021]/55 transition-colors duration-300 z-10" />

              {/* Media */}
              <div className="h-full w-full">
                {isVideo ? (
                  <video
                    src={previewImage}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover opacity-100 group-hover:opacity-80 transition-opacity duration-300"
                  />
                ) : (
                  <img
                    src={previewImage}
                    alt={project.title}
                    className="h-full w-full object-cover opacity-100 group-hover:opacity-80 transition-opacity duration-300"
                  />
                )}
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-[#000021] via-[#000021]/50 to-transparent">
                <h3 className="text-xl font-bold text-[#f5f5f0] mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>
                <p className="text-xs text-[#8abaff] uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                  {project.tag}
                </p>
              </div>
            </motion.div>
           );
        })}
      </div>

      {/* Hologram Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-[#000021]/80 border border-[#00A4FF]/30 text-[#00A4FF] hover:bg-[#00A4FF]/20 transition-colors"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              layoutId={`card-${selectedProject.id}`}
              className="relative w-full max-w-6xl h-[85vh] flex flex-col md:flex-row rounded-2xl border border-[#00A4FF]/50 bg-[#000021]/95 shadow-[0_0_60px_rgba(0,164,255,0.35)] backdrop-blur-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >

               {/* Left: Content (Scrollable) */}
               <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#f5f5f0] mb-2">{selectedProject.title}</h2>
                      <p className="text-sm text-[#00A4FF] uppercase tracking-widest">{selectedProject.tag}</p>
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {selectedProject.description}
                    </p>

                    {selectedProject.link && (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00A4FF]/10 border border-[#00A4FF]/40 text-[#00A4FF] hover:bg-[#00A4FF] hover:text-white transition-all duration-300 group"
                      >
                        <span>View Project</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    )}
                  </div>
               </div>

               {/* Right: Carousel (Fixed) */}
               <div className="w-full md:w-1/2 relative flex items-center justify-center p-4">
                  {(() => {
                    const images = selectedProject.images || (selectedProject.image ? [selectedProject.image] : []);
                    const currentMedia = images[modalImageIndex];
                    
                    return (
                      <div className="relative w-full aspect-[4/3] flex items-center justify-center border border-[#00A4FF]/30 rounded-xl overflow-hidden bg-black/20">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={modalImageIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            {currentMedia?.endsWith('.mp4') ? (
                              <video 
                                src={currentMedia} 
                                controls 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <img 
                                src={currentMedia} 
                                alt={`${selectedProject.title} ${modalImageIndex + 1}`} 
                                className="w-full h-full object-cover" 
                              />
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Carousel Controls */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={prevModalImage}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#000021]/80 border border-[#00A4FF]/30 text-[#00A4FF] hover:bg-[#00A4FF]/20 transition-colors z-10"
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={nextModalImage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#000021]/80 border border-[#00A4FF]/30 text-[#00A4FF] hover:bg-[#00A4FF]/20 transition-colors z-10"
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            
                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                              {images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setModalImageIndex(idx)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    idx === modalImageIndex ? "bg-[#00A4FF] w-4" : "bg-[#00A4FF]/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}