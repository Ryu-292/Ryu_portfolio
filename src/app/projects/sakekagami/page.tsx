"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import useRealProgress from "@/hooks/useRealProgress";
import Reveal from "@/components/Reveal";
import { Masu3D } from "@/components/3DMasu";

export default function SakekagamiPage() {
  const loadingProgress = useRealProgress();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (loadingProgress >= 100) {
      const timer = setTimeout(() => setShowContent(true), 200);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  return (
    <main className="min-h-screen bg-[#000021] text-white">
      {showContent && (
      /* PAGE CONTENT */
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 space-y-32">
        {/* SECTION 1 – Intro “hero slide” */}
        <section className="grid gap-10 md:grid-cols-2 md:min-h-[80vh] md:items-center">
          <Reveal delay={0.40}>
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00A4FF]/70">
                Interactive installation
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-wide">
                Sakekagami
              </h1>
              <h2 className="text-sm md:text-base text-white/70">
                – Connection and reconnection to tradition, to others, and to ourselves. –
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-white/85">
                Sake has long been more than a drink; a bridge to the gods, to memory, and to the past. <br />
                SakeKagami reinterprets this ritual, of sharing sake, through a digital masu cup, creating a link that connects people can connect across distance and time, and quietly rediscover themselves in reflection.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="relative h-[80vh]">
              <div className="absolute -inset-6 rounded-3xl bg-[#00A4FF]/20 blur-3xl opacity-40" />
              <div className="relative overflow-hidden h-full">
                <Image
                  src="/images/Sakekagami/Poster.JPG"
                  alt="Sakekagami"
                  width={700}
                  height={400}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECTION 2 – Kyoto / origin story */}
        <section className="grid gap-10 md:grid-cols-[1.2fr_0.9fr] md:items-center">
          <Reveal delay={0.2}>
            <div className="overflow-hidden bg-white/5">
              <Image
                src="/images/Sakekagami/MasuB_Y.JPG"
                alt="Sake ritual"
                width={900}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-4 max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Origin
              </p>
              <h3 className="text-xl md:text-2xl font-semibold">
                A question about connection
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                My project began with a simple question: “How can technology bring us
                closer to tradition, to others, and to ourselves?”
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                While staying in Kyoto, the spiritual heart of Japan, I was surrounded
                by Shinto shrines, seasonal rituals, and quiet gestures of devotion.
                The more I learned about these practices, the more one word kept
                returning to me —{" "}
                <span className="text-[#00A4FF] font-medium">connection</span>.
              </p>
            </div>
          </Reveal>

          
        </section>

        {/* SECTION 3 – Sake + Mizukagami concept */}
        <section className="space-y-10 md:space-y-12">
          <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-start">
            <Reveal>
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                  Concept
                </p>
                <h3 className="text-xl md:text-2xl font-semibold">
                  Between sake and the water mirror
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  One of the central elements that caught my attention was{" "}
                  <span className="text-[#00A4FF] font-medium">sake</span>, a
                  traditional Japanese rice wine often used in rituals. <br />
                  Sake is more than just a drink; it is a symbol of connection, 
                  a medium through which people come together to share moments, stories, and memories. <br />
                  In ancient times, the process of fermentation invisible to the human eye was believed to be the work of Gods, 
                  transforming rice into a sacred beverage. <br />
                  Sake was used in ceremonies to connect with the divine, purify the body and spirits, and build bonds.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  Another was the{" "}
                  <span className="text-[#00A4FF] font-medium">mirror</span>,
                  an element that have a strong significance in Shinto religion 
                  as a symbol of truth and self-reflection. <br />
                  The mirror is believed to reflect not just physical appearance but also the inner self, 
                  encouraging individuals to look inward and connect with their true nature. <br />
                  One specific type of mirror that intrigued me was the 
                  "<span className="text-[#00A4FF] font-medium">Mizukagami</span>", which translates to water (mizu) mirror (kagami).
                  This natural mirror forms on the surface of still water, 
                  reflecting the surrounding environment and creating a serene and contemplative space. 
                  The water does not just mirror the present, but evokes the passing of time, the change of seasons, 
                  and a connection between heaven and earth. <br />
                  Some believed that water mirrors acted as portals to the other world, linking us with those who lived before us.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90">
                  As you might have guessed from the name, this project 
                  "<span className="text-[#00A4FF] font-medium">Sakekagami</span>" is a fusion of these two concepts: Sake and Mizukagami. <br />
                  I thought what if I could create a mirror portal throught a cup of sake that connects us to tradition, to others, and to ourselves. <br />
                  A mirror that connects the past and the present, the physical and the spiritual, the individual and the collective. <br />
                  A cup that forges bonds across time and space, letting us share a drink and connect.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden">
                  <Image
                    src="/images/Sakekagami/sketch1.png"
                    alt="Masu sketch 1"
                    width={300}
                    height={300}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <Image
                    src="/images/Sakekagami/sketch2.png"
                    alt="Masu sketch 2"
                    width={300}
                    height={300}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <Image
                    src="/images/Sakekagami/sketch3.png"
                    alt="Masu sketch 3"
                    width={300}
                    height={300}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 4 – System / interaction */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="space-y-4 max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                System
              </p>
              <h3 className="text-xl md:text-2xl font-semibold">
                A pair of connected cups
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                Each custom <em>masu</em> cup is equipped with a Raspberry Pi, a
                miniature camera, and a small display.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                The cups communicate over local network: <br />
                The camera in each cup captures
                the user&apos;s face, which is processed via TouchDesigner and
                StreamDiffusion to generate real-time visuals.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                These images are then sent to the opposite cup, 
                transforming a simple drinking gesture into a moment of mutual recognition; 
                an encounter that exists somewhere between reflection and presence.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-4">
              <div className="overflow-hidden ">
                <video autoPlay loop muted className="h-full w-full object-cover">
                  <source
                    src="/images/Sakekagami/SakekagamiDemo.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECTION 5 – 3D / closing slide */}
        <section className="space-y-8 md:space-y-10">
          <Reveal>
            <div className="text-center space-y-3">
              <h3 className="text-xl md:text-2xl font-semibold">
                3D Model of the Masu Cup
              </h3>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Masu3D />
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mx-auto max-w-2xl text-center text-sm md:text-base leading-relaxed text-white/85">
              Sakekagami is not about replacing physical presence. It is about
              designing a new kind of shared ritual, where technology fades into the
              background and a familiar object — a small wooden cup — becomes the
              interface for connection.
            </p>
          </Reveal>
        </section>
      </div>
      )}
    </main>
  );
}
