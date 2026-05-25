"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import useRealProgress from "@/hooks/useRealProgress";
import Reveal from "@/components/Reveal";

export default function TerubotPage() {
  const loadingProgress = useRealProgress();
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (loadingProgress >= 100) {
      const timer = setTimeout(() => setShowContent(true), 200);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#000021] text-white overflow-hidden">
      {showContent && (
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 space-y-32">
          {/* SECTION 1 – Intro Hero */}
          <section className="grid gap-10 md:grid-cols-2 md:min-h-[80vh] md:items-center">
            <Reveal delay={0.40}>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#00A4FF]/70">
                  Robotics • Human Robotic Interaction
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-wide">
                  Terubot
                </h1>
                <h2 className="text-sm md:text-base text-white/70">
                  Teru Tell Me the Weather
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/85">
                  Inspired by the Japanese charm of <span className="text-[#00A4FF] font-medium">Teru Teru Bōzu</span>, 
                  Terubot is a social robot designed to interact with humans through voice, gesture, and shared emotional awareness. 
                  Instead of wishing for good weather, what if a robot could measure and respond to a community&apos;s emotional climate?
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="relative h-[80vh]">
                <div className="absolute -inset-6 rounded-3xl bg-[#00A4FF]/20 blur-3xl opacity-40" />
                <div className="relative overflow-hidden h-full shadow_lg">
                  <Image
                    src="/images/Terubot/terubotposter2.png"
                    alt="Terubot Robot"
                    width={700}
                    height={800}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </Reveal>
          </section>

          {/* SECTION 2 – Concept & Inspiration */}
          <section className="grid gap-10 md:grid-cols-2 md:items-start">
            <Reveal>
              <div className="space-y-4 max-w-xl">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                  Concept & Inspiration
                </p>
                <h3 className="text-xl md:text-2xl font-semibold">
                  Emotion meets embodiment
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  Terubot is a hybrid system that combines a companion robot with a lightweight mobile application to express and visualize collective emotions. 
                  We drew our inspiration from the <span className="text-[#00A4FF] font-medium">Teru Teru Bōzu</span>, a handmade Japanese puppet traditionally believed to bring good weather.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  Instead of wishing for sunny skies, we reframed &quot;good weather&quot; as a tangible metaphor for emotional and social well being. 
                  Individuals can share their daily emotional state through the app, and those inputs are then aggregated into a shared <span className="text-[#00A4FF] font-medium">emotional weather</span> that the robot expresses in a communal space.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  By bringing collective emotional states to life in a physical form, Terubot explores how playful and slightly ambiguous systems can support emotional awareness and foster genuine social connection within a community.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative flex flex-col gap-6 md:gap-6 md:mt-10">
                <div className="absolute -inset-6 rounded-3xl bg-[#00A4FF]/20 blur-3xl opacity-30" />
                
                <div className="relative overflow-hidden h-[30vh] md:h-[35vh]">
                  <Image
                    src="/images/Terubot/TERUTERUBOZU.png"
                    alt="Concept Illustration 1"
                    width={600}
                    height={300}
                    className="h-full w-full object-cover md:object-contain"
                  />
                </div>
                <div className="relative overflow-hidden w-full h-[45vh] md:h-[30vh] ">
                  <Image
                    src="/images/Terubot/mapping.png"
                    alt="Concept Illustration 2"
                    width={800}
                    height={300}
                    className="h-full w-full object-contain md:object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </section>

          {/* SECTION 3 – Hardware & Engineering */}
          <section className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal delay={0.2}>
              <div className="grid gap-4">
                <div className="overflow-hidden bg-white/5 rounded-lg">
                  <Image
                    src="/images/Terubot/proto1.jpeg"
                    alt="Hardware Architecture"
                    width={700}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden bg-white/5 rounded-lg">
                    <video
                      src="/images/Terubot/eyes_proto.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden bg-white/5 rounded-lg">
                    <Image
                      src="/images/Terubot/proto2.jpeg"
                      alt="Head Prototypes"
                      width={350}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="space-y-4 max-w-xl">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                  Hardware & Design
                </p>
                <h3 className="text-xl md:text-2xl font-semibold">
                  Bringing Terubot to life
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  Terubot is powered by a RaspberryPi 5 that acts as its brain. 
                  It processes voice input and detects emotional cues to decide how the robot should react with local Large Language Model, 
                  while a built in camera and microphone help it perceive its surroundings and the user&apos;s face.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  To give Terubot expressive features, we distributed its functions using secondary microcontrollers. 
                  These drive the two circular screens that serve as eyes, adjusting eyelid shapes and blink speeds dynamically 
                  to create lifelike animations rather than just static images. They also synchronize the internal motors, 
                  allowing Terubot to nod, shake, and tilt organically in response to emotional input.
                </p>
                
              </div>
            </Reveal>
          </section>

          {/* SECTION 6 – App / System Overview */}
          <section className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal delay={0.2}>
              <div className="relative h-[80=vh] md:h-[90vh]">
                <div className="absolute -inset-6 rounded-3xl bg-[#00A4FF]/20 blur-3xl opacity-30" />
                <div className="relative overflow-hidden h-full">
                  <Image
                    src="/images/Terubot/application.png"
                    alt="Mobile App Interface"
                    width={600}
                    height={800}
                    className="h-full w-full object-contain scale-[1.03]"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="space-y-4 max-w-xl">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                  System
                </p>
                <h3 className="text-xl md:text-2xl font-semibold">
                  Visualizing emotional weather
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  We designed a mobile application to act as the main interaction point of our system. It serves both as an interface for daily check ins 
                  and as a space for visualizing personal and collective emotional data.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  The core experience centers on four key dimensions: <span className="text-[#00A4FF] font-medium">general mood, energy level, stress, and sense of social connection</span>. 
                  Users can complete a quick daily check in through a simple questionnaire without needing to write out long journal entries.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  The app dynamically updates its visual design based on the user's feelings: warm, sunny visuals for a positive mood, and cooler, calmer tones when stress is high. 
                  Users can also review their emotional trends over the past week through simple curves and graphs.
                  We also added a shared community channel where users can anonymously post positive messages. This creates a sense of belonging without direct social pressure, inviting users to participate in a collective atmosphere of care and encouragement.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  We also added a shared community channel where users can anonymously post positive messages. 
                  This creates a sense of belonging without direct social pressure, 
                  inviting users to participate in a collective atmosphere of care and encouragement.
                </p>

              </div>
            </Reveal>
          </section>

          {/* SECTION 6.5 – Video Demonstration */}
          <section className="grid gap-6 md:grid-cols-3">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-xl bg-white/5 aspect-[9/16] w-full">
                <video
                  src="/images/Terubot/pres.mp4"
                  autoPlay
                  controls
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-xl bg-white/5 aspect-[9/16] w-full">
                <video
                  src="/images/Terubot/ryu.mp4"
                  controls
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative overflow-hidden rounded-xl bg-white/5 aspect-[9/16] w-full">
                <video
                  src="/images/Terubot/sleep.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

          </section>

          {/* SECTION 7 – User Study Results */}
          <section className="space-y-10 md:space-y-12">
            <Reveal>
              <div className="text-center space-y-3">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                  Evaluation
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold">
                  User responses and observations
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-10 md:grid-cols-2">
              <Reveal delay={0.1}>
                <div className="bg-white/5 rounded-lg p-6 md:p-8 space-y-4">
                  <p className="text-sm md:text-base uppercase tracking-[0.2em] text-[#00A4FF] font-medium">📱 Mobile App</p>
                  <p className="text-xs md:text-sm leading-relaxed text-white/80">N = 8 participants</p>
                  <div className="space-y-3 text-sm md:text-base text-white/90">
                    <p><span className="text-[#00A4FF] font-medium">Experience:</span> Generally favorable perception</p>
                    <p><span className="text-[#00A4FF] font-medium">Interface Clarity:</span> Easy to understand and navigate</p>
                    <p><span className="text-[#00A4FF] font-medium">Emotional Safety:</span> All participants felt comfortable with the check in design</p>
                    <p><span className="text-[#00A4FF] font-medium">Emotional Reflection:</span> Moderate engagement with reflective features</p>
                    <p><span className="text-[#00A4FF] font-medium">Regular Usage Intent:</span> Strong acceptance and perceived usefulness</p>
                  </div>
                  <p className="text-xs text-white/60 pt-3 border-t border-white/10">Participants appreciated the visual design and color palette.</p>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="bg-white/5 rounded-lg p-6 md:p-8 space-y-4">
                  <p className="text-sm md:text-base uppercase tracking-[0.2em] text-[#00A4FF] font-medium">🤖 Robot Interface</p>
                  <p className="text-xs md:text-sm leading-relaxed text-white/80">N = 8 participants</p>
                  <div className="space-y-3 text-sm md:text-base text-white/90">
                    <p><span className="text-[#00A4FF] font-medium">Behavioral Clarity:</span> Easy to understand robot behavior</p>
                    <p><span className="text-[#00A4FF] font-medium">Expressive Appropriateness:</span> Movements felt fitting to situations</p>
                    <p><span className="text-[#00A4FF] font-medium">Natural Engagement:</span> Interactions felt natural and engaging</p>
                    <p><span className="text-[#00A4FF] font-medium">Enhancement:</span> All participants rated the system higher because of the robot</p>
                  </div>
                  <p className="text-xs text-white/60 pt-3 border-t border-white/10">Participants spontaneously touched the robot, suggesting a desire for tactile interaction.</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="bg-[#00A4FF]/10 border border-[#00A4FF]/30 rounded-lg p-6 md:p-8">
                <h3 className="text-base md:text-lg font-semibold mb-3 text-[#00A4FF]">🔍 Spontaneous interaction</h3>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  During the study, we noticed something very interesting: participants spontaneously attempted to physically interact with the robot 
                  by touching or stroking its head, even though we did not design any touch based features. This recurring behavior showed us that 
                  Terubot&apos;s physical presence naturally elicits genuine tactile engagement, and users implicitly expect affective responsiveness 
                  from an embodied artifact.
                </p>
              </div>
            </Reveal>
          </section>

          
          
          {/* SECTION 11 – Credits */}
          <section className="space-y-8 md:space-y-10 border-t border-white/10 pt-16">
            <Reveal>
              <div className="text-center space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold">
                  Team
                </h3>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="text-center space-y-2">
                <p className="text-sm md:text-base text-white/80">
                  <span className="text-[#00A4FF] font-medium">Terubot</span> is a collaborative project by:
                </p>
                <p className="text-sm md:text-base text-white/70">
                  Ryu OSADA • Fleuriane LAM • Amandine UNDERWOOD • Théo RENOUARD • Ludovic LI
                </p>
              </div>
            </Reveal>
          </section>
        </div>
      )}
    </main>
  );
}
