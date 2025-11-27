"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import useRealProgress from "@/hooks/useRealProgress";
import Reveal from "@/components/Reveal";

export default function ElastupPage() {
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
                Product Design
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-wide">
                Elastup
              </h1>
              <h2 className="text-sm md:text-base text-white/70">
                – A Touch of Elegance Made in Paris –
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-white/85">
                Elastup is a multipurpose cutlery holder designed for lunch boxes, combining functionality
                with a touch of elegance. Launched on April 03, 2025, on Kickstarter, this product features a durable elastic band 
                paired with a piece of leather, offering a minimalist solution for organizing utensils on the go. <br />
                In addition to its primary use, Elastup can also be used on tablets or notebooks to hold pens, making it a versatile
                accessory.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="relative h-[80vh]">
              <div className="absolute -inset-6 rounded-3xl bg-[#00A4FF]/20 blur-3xl opacity-40" />
              <div className="relative overflow-hidden h-full">
                <Image
                  src="/images/Elastup/Elastup1.png"
                  alt="Elastup Product"
                  width={700}
                  height={400}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECTION 2 – Origin Story */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal delay={0.2}>
            <div className="overflow-hidden bg-white/5">
              <Image
                  src="/images/Elastup/Elastup1.png"
                  alt="Elastup Product"
                  width={700}
                  height={400}
                  className="h-full w-full object-contain"
                  priority
                />
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-4 max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Origin
              </p>
              <h3 className="text-xl md:text-2xl font-semibold">
                Born from a simple lunch
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                We organised several brainstorming sessions lasting several hours to come up with an idea we could all agree on. 
                Despite all our efforts, the idea didn't come to us during a brainstorming session 
                but when one of our team members arrived one lunchtime with a tupperware on which his cutlery was held with a rubber band.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                The cutlery wasn't stable at all and the aesthetics of the elastic band on the tupperware clearly needed to be reviewed. 
                That's when we realized the potential for a <span className="text-[#00A4FF] font-medium">fashionable cutlery holder</span>.
              </p>
            </div>
          </Reveal>
        </section>

        {/* SECTION 3 – Design & Materials */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          
          <Reveal>
           <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Design Process
              </p>
              <h3 className="text-xl md:text-2xl font-semibold">
                Elastic and leather in harmony
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                We came up with the idea of a fashionable cutlery holder for tupperware with a wider elastic band to make it more stable on the object. 
                The combination of <span className="text-[#00A4FF] font-medium">elastic and leather</span> adds a touch of elegance to the classic elastic design.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                After some thought, we realised that the project could be adapted to many more everyday objects: 
                a notebook and its pen, an iPad and its apple pencil, lunchbox and its cutlery, etc. <br />
                That's how the Elastup was born!
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                We started by sketching the product on paper, then created a model using Solidworks.
                We asked a manufacturer in the Marais district of Paris to produce a custom cutter that would allow us to shape the leather pieces.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="overflow-hidden">
              <Image
                src="/images/Elastup/design1.png"
                alt="Design sketch 1"
                width={700}
                height={400}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <br />
            <div className="overflow-hidden">
              <Image
                src="/images/Elastup/Emporte_piece.png"
                alt="Leather cutter"
                width={700}
                height={400}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </Reveal>
        </section>


        {/* SECTION 4 – Versatility & Applications */}
         <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal delay={0.2}>
            <div className="overflow-hidden bg-white/5">
              <video controls className="h-full w-full object-cover">
                  <source
                    src="/images/Elastup/Elastup_video.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
              </video>
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-4 max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Versatility
              </p>
              <h3 className="text-xl md:text-2xl font-semibold">
                Adapts to every lifestyle
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                Perfectly adaptable, it can be wrapped around lunchboxes, tablets, notebooks, or any other personal items, 
                offering a practical way to keep everything in place. 
                Whether you're at school, the office, or on the go, the Elastup is designed to adapt to your needs.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                After numerous prototypes and brainstorming sessions, we settled on a size that could adapt to most lunchboxes, notebooks, and tablets.
              </p>
            </div>
          </Reveal>
        </section> 

        {/* SECTION 5 – Colors & Kickstarter */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          
          <Reveal>
            <div className="space-y-4 max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Launch & Campaign
              </p>
              <h3 className="text-xl md:text-2xl font-semibold">
                Made in France, made to last
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                For the colors, we wanted something simple and versatile — shades that anyone could wear. 
                  We first chose <span className="text-[#00A4FF] font-medium">black leather</span>, a timeless option that pairs easily with any style. 
                  Then, we introduced red and blue as a nod to the French flag and the <span className="text-[#00A4FF] font-medium">"Made in France"</span> label.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                Later on, we added "mystery colors" to reduce leather waste by using pieces too small to be crafted into bags or other leather goods.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-white/90">
                With the final product ready, we launched a Kickstarter campaign to fund the production of our first series.
                  The campaign launch on April 3rd went very well. By the end of the 20-day campaign, we had reached 177% of our goal, raising €593.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="overflow-hidden bg-white/5">
              <Image
                src="/images/Elastup/Ipad1.JPG"
                alt="Elastup on iPad"
                width={700}
                height={400}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </Reveal>
        </section>


        <section className="space-y-10 md:space-y-12">
          <Reveal delay={0.1}>
              <div className="grid grid-cols-3 gap-4">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/images/Elastup/Poster1.jpg"
                    alt="Marketing poster 1"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/images/Elastup/Poster2.jpg"
                    alt="Marketing poster 2"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/images/Elastup/Poster3.jpg"
                    alt="Marketing poster 3"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
        </section>

        {/* SECTION 6 – Closing / Success */}
        <section className="space-y-8 md:space-y-10">
          <Reveal>
            <div className="text-center space-y-3">
              <h3 className="text-xl md:text-2xl font-semibold">
                From idea to reality
              </h3>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-2xl mx-auto overflow-hidden rounded-lg">
              <Image
                src="/images/Elastup/Recap.jpg"
                alt="Kickstarter Success"
                width={500}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mx-auto max-w-2xl text-center text-sm md:text-base leading-relaxed text-white/85">
              Our goal was to produce at least 50 Elastups with a funding target of €335. 
              By the end of the 20-day campaign, we had reached 177% of our goal. 
              Now it's time to begin production and deliver the Elastups to our amazing backers from around the world.
            </p>
          </Reveal>
        </section>
        </div>
      )}
    </main>
  );
}
