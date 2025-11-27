"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type Props = { imageSrc?: string };

export default function Intro({
  imageSrc = "/images/portrait1.png",
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let running = true;

    // --- Renderer (full-screen canvas like your ring code) -------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const getSize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      return { w, h };
    };
    let { w, h } = getSize();
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      display: "block",
    });


    // --- Scene & Camera ------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = null; // transparent, let CSS bg show if you want

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    scene.add(camera);


    // --- Lights --------------------------------------------------------------
    scene.add(new THREE.AmbientLight(0x66aaff, 0.35));
    const rim = new THREE.DirectionalLight(0x00ccff, 0.6);
    rim.position.set(-2, 2, 3);
    scene.add(rim);


    // --- Gradient Background (full screen quad) -------------------------
    const bgGeo = new THREE.PlaneGeometry(10, 10);
    const bgMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;

        void main() {
          vec2 c = vUv - vec2(0.0, 1.0);   // center at top-left like your CSS
          float r = length(c * 1.6);        // adjust spread

          vec3 col1 = vec3(0.0, 0.0, 0.03);    // dark blue, no green
          vec3 col2 = vec3(0.0, 0.0, 0.015);   // darker blue, no green

          vec3 col = mix(col1, col2, smoothstep(0.0, 1.0, r));

          gl_FragColor = vec4(col, 1.0);   // OPAQUE (composer-safe)
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
    const bgQuad = new THREE.Mesh(bgGeo, bgMat);
    bgQuad.position.z = -10; // very far behind everything
    scene.add(bgQuad);


    // --- Postprocessing: Bloom ----------------------------------------------
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    (renderPass as any).clearAlpha = 0;
    composer.addPass(renderPass);
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.23, 0.6, 0.3);
    composer.addPass(bloom);

    // --- Holographic Scanline Shader ----------------------------------------
    const scanMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.4 },
        uTintA: { value: new THREE.Color(0x00e5ff) },
        uTintB: { value: new THREE.Color(0xff2959) },
        uTex: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uTintA;
        uniform vec3 uTintB;
        uniform sampler2D uTex;

        float hash(float n){ return fract(sin(n)*43758.5453123); }

        void main(){
          vec4 portrait = texture2D(uTex, vUv);
          float alpha = portrait.a;
          if (alpha < 0.02) discard;

          float line = step(0.95, fract(vUv.y*220.0));
          float sweep = smoothstep(0.0,1.0,sin(uTime*1.3 + vUv.y*10.0)*0.5+0.5);
          float band = step(0.97, fract(vUv.y*12.0 + floor(uTime*0.8)));
          float flicker = 0.65 + 0.35*hash(floor(uTime*60.0));

          float r = line * (0.45 + 0.55*sweep);
          float g = line * 0.33 * flicker;
          float b = line * 0.6  * (1.0-sweep);

          vec3 tint = mix(uTintA, uTintB, 0.5 + 0.5*sin(uTime*0.5));
          vec3 col = tint * vec3(r,g,b);
          col += tint * band * 0.25;

          gl_FragColor = vec4(col, alpha * uOpacity);
        }
      `,
    });

    // --- Feathered Base Image (unlit) ---------------------------------------
    const fadeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: null as any },
        uEdgeSoftness: { value: 0.15 },
      },
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTex;
        uniform float uEdgeSoftness;
        void main(){
          vec4 color = texture2D(uTex, vUv);
          float left   = smoothstep(0.0, uEdgeSoftness, vUv.x);
          float right  = 1.0 - smoothstep(1.0 - uEdgeSoftness, 1.0, vUv.x);
          float bottom = smoothstep(0.0, uEdgeSoftness, vUv.y);
          float top    = 1.0 - smoothstep(1.0 - uEdgeSoftness, 1.0, vUv.y);
          color.a *= left * right * bottom * top;
          gl_FragColor = color;
        }
      `,
    });

    // --- Load Image ----------------------------------------------------------
    const loader = new THREE.TextureLoader();
    let base: THREE.Mesh | null = null;
    let scan: THREE.Mesh | null = null;

    loader.load(
      imageSrc,
      (t) => {
        if (!running) return;
        // @ts-ignore
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

        const iw = (t.image as any).width ?? 1;
        const ih = (t.image as any).height ?? 1;
        const aspect = iw / ih || 1;

        const targetH = 2.3;
        const planeW = targetH * aspect;
        const planeH = targetH;

        const geo = new THREE.PlaneGeometry(planeW, planeH);

        fadeMat.uniforms.uTex.value = t;
        base = new THREE.Mesh(geo, fadeMat);
        scene.add(base);

        scanMat.uniforms.uTex.value = t;
        scan = new THREE.Mesh(geo.clone(), scanMat);
        scan.position.z = 0.002;
        scene.add(scan);

      },
      undefined,
      (e) => console.error("Texture load error:", e)
    );

    // --- Interaction & Animation --------------------------------------------
    let time = 0;
    let targetRX = 0, targetRY = 0;

    const onPointerMove = (e: PointerEvent) => {
      // Calculate position relative to screen center, not container
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      const offsetX = (e.clientX - screenCenterX) / screenCenterX; // -1 to 1
      const offsetY = (e.clientY - screenCenterY) / screenCenterY; // -1 to 1
      targetRY = offsetX * 0.18;
      targetRX = offsetY * 0.18;
    };
    window.addEventListener("pointermove", onPointerMove);

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      time += dt;

      const floatY = Math.sin(time * 1.2) * 0.06;

      if (base) {
        base.position.y = floatY;
        base.rotation.x += (targetRX - base.rotation.x) * 0.06;
        base.rotation.y += (targetRY - base.rotation.y) * 0.06;
      }
      if (scan && base) {
        scan.position.y = floatY;
        scan.rotation.copy(base.rotation);
        (scanMat.uniforms.uTime as any).value = time;
      }

      composer.render();
    });

    // --- Resize --------------------------------------------------------------
    const onResize = () => {
      const size = getSize();
      w = size.w; h = size.h;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // --- Cleanup -------------------------------------------------------------
    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.setAnimationLoop(null);

      base?.geometry.dispose();
      (base?.material as THREE.Material)?.dispose?.();
      scan?.geometry.dispose();
      (scan?.material as THREE.Material)?.dispose?.();

      renderer.dispose();
      composer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  // ---------- PAGE LAYOUT + INTRO OVERLAY ----------

  return (
    <div className="holo-root">

      {/* Intro overlay (left) */}
      <section className="intro-block">
        <p className="intro-katakana">
          クリエイティブテクノロジーエンジニア · 東京／パリ
        </p>

        <h1 className="intro-name">Hi, I'm Ryu!</h1>

        <p className="intro-tagline">
          I'm a creative technology engineering student in Paris.
        </p>

        <p className="intro-body">
          I explore the intersection of Japanese tradition and technology
          through immersive art installations and playful objects. <br />
          By bridging ancient concepts with contemporary innovation, my goal is to create new interactive
          experiences that help people reconnect with tradition and with others through shared moments.
        </p>
      </section>

      {/* Three.js canvas host (right) */}
      <div ref={mountRef} className="holo-canvas" />

    </div>
  );
}
