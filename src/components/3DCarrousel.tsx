"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Item = { src: string; href: string };

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const mount = mountRef.current;
    if (!mount) return;

    setIsLoading(true);

    try {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL not supported');
      }

    // --- IMAGES + LINKS -----------------------------------------------------
    const items: Item[] = [
      { src: "/images/NeuroPortals/neuroIntro.png", href: "/projects/neuroPortals" },
      { src: "/images/Elastup/Elastup1.png", href: "/projects/elastup" },
      { src: "/images/Sakekagami/Poster.JPG", href: "/projects/sakekagami" },
      
    ];

    // --- LAYOUT -------------------------------------------------------------
    const PANEL_HEIGHT = 1.2; // world units
    const GAP = 0.5;
    const Y_OFFSET = 0;

    // --- THREE BASICS -------------------------------------------------------
    const scene = new THREE.Scene();

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ringPanels: THREE.Group[] = [];

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,         // ← allow transparency
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const getSize = () => {
      const w = mount.clientWidth || 1800;
      const h = mount.clientHeight || 900;
      return { w, h };
    };
    const { w, h } = getSize();
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.01, 2000);
    camera.position.set(0, 0, 6);

    // simple lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(2, 3, 4);
    scene.add(dir);

    // --- LOADING ------------------------------------------------------------
    const loader = new THREE.TextureLoader();
    const loadAsync = (u: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(u, (t) => resolve(t), undefined, (e) => reject(e));
      });

    let running = true;

    (async () => {
      try {
        const textures = await Promise.all(items.map(i => loadAsync(i.src)));
        if (!running) return;

        textures.forEach((t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = renderer.capabilities.getMaxAnisotropy();
          t.wrapS = THREE.ClampToEdgeWrapping;
          t.wrapT = THREE.ClampToEdgeWrapping;
        });

        // widths from source aspect
        const widths = textures.map((t) => {
          const img = t.image as HTMLImageElement | HTMLCanvasElement;
          const iw = 'naturalWidth' in img ? img.naturalWidth : img.width;
          const ih = 'naturalHeight' in img ? img.naturalHeight : img.height;
          const aspect = iw / ih || 1;
          return PANEL_HEIGHT * aspect;
        });

        const N = items.length;
        const totalLinear = widths.reduce((a, b) => a + b, 0) + N * GAP;
        const radius = totalLinear / (Math.PI * 2);

        // fit camera
        const ringDiameter = 2 * radius + PANEL_HEIGHT;
        const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const fitHeight = (ringDiameter * 0.5) / Math.tan(halfFov);
        const fitWidth = fitHeight / camera.aspect;
        const dist = Math.max(fitHeight, fitWidth) * 1.05;
        camera.position.set(0, 0, dist);
        camera.near = Math.max(0.01, dist / 100);
        camera.far = dist * 100;
        camera.updateProjectionMatrix();

        let thetaCursor = 0;
        const pickTargets: THREE.Object3D[] = []; // raycast targets (for clicking)

        for (let i = 0; i < N; i++) {
          const panelWidth = widths[i];
          const thetaLen = panelWidth / radius;

          const geom = new THREE.CylinderGeometry(
            radius, radius, PANEL_HEIGHT,
            48, 1, true,
            thetaCursor, thetaLen
          );
          geom.translate(0, Y_OFFSET, 0);

          // BASE LAYER ONLY (plain image)
          const baseMat = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: textures[i],
            transparent: false
          });
          const baseMesh = new THREE.Mesh(geom, baseMat);

          const group = new THREE.Group();
          group.add(baseMesh);
          group.userData = { href: items[i].href };

          ringGroup.add(group);
          pickTargets.push(baseMesh);

          ringPanels.push(group);

          const gapAngle = GAP / radius;
          thetaCursor += thetaLen + gapAngle;
        }

        scene.rotation.z = THREE.MathUtils.degToRad(15);

        // --- CLICK -----------------------------------------------
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        let hoveredGroup: THREE.Group | null = null;

        function onPointerMove(e: MouseEvent) {
          if (!isDragging) {
            setMouse(e as unknown as MouseEvent);
            raycaster.setFromCamera(mouse, camera);

            const hits = raycaster.intersectObjects(pickTargets, false);
            const hitMesh = hits[0]?.object as THREE.Mesh || null;
            const newHovered = hitMesh ? (hitMesh.parent as THREE.Group) : null;

            if (newHovered !== hoveredGroup) {
              hoveredGroup = newHovered;
              renderer.domElement.style.cursor = hoveredGroup ? "pointer" : "grab";
            }
          }
        }
        renderer.domElement.addEventListener("pointermove", onPointerMove);

        function setMouse(e: MouseEvent) {
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        }

        const onClick = (e: MouseEvent) => {
          setMouse(e);
          raycaster.setFromCamera(mouse, camera);
          const hits = raycaster.intersectObjects(pickTargets, false);
          const hit = hits[0]?.object as THREE.Mesh | undefined;
          if (hit) {
            const href = (hit.parent as THREE.Group).userData.href as string;
            if (href) window.location.href = href; // or use Next.js router
          }
        };

        renderer.domElement.addEventListener("click", onClick);

        // --- SCROLL TO SPIN --------------------------------------------------
        let scrollDelta = 0;
        const sensitivity = 0.0015;
        const smoothness = 0.1;
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          scrollDelta += e.deltaY * sensitivity;
        };
        renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

        // --- DRAG TO SPIN ----------------------------------------------------
        let isDragging = false;
        let previousMouseX = 0;
        let dragDelta = 0;
        const dragSensitivity = 0.005;

        const onMouseDown = (e: MouseEvent) => {
          isDragging = true;
          previousMouseX = e.clientX;
          renderer.domElement.style.cursor = "grabbing";
        };

        const onMouseMove = (e: MouseEvent) => {
          if (!isDragging) return;
          
          const deltaX = e.clientX - previousMouseX;
          dragDelta += deltaX * dragSensitivity;
          previousMouseX = e.clientX;
        };

        const onMouseUp = () => {
          isDragging = false;
          renderer.domElement.style.cursor = hoveredGroup ? "pointer" : "default";
        };

        const onMouseLeave = () => {
          isDragging = false;
          renderer.domElement.style.cursor = "default";
        };

        renderer.domElement.addEventListener("mousedown", onMouseDown);
        renderer.domElement.addEventListener("mousemove", onMouseMove);
        renderer.domElement.addEventListener("mouseup", onMouseUp);
        renderer.domElement.addEventListener("mouseleave", onMouseLeave);

        // --- LOAD SPIN DECELERATION ------------------------------------------
        let loadStartTime = Date.now();
        const decelerationDuration = 4000; // 5 seconds for longer, smoother decay
        const maxLoadSpeed = 0.3; // fast initial spin speed
        const normalSpeed = 0.0000011; // normal spin speed

        // Reset spin when page becomes visible
        const resetSpin = () => {
          if (document.visibilityState === "visible") {
            loadStartTime = Date.now();
          }
        };
        document.addEventListener("visibilitychange", resetSpin);

        // --- RESIZE ----------------------------------------------------------
        const onResize = () => {
          const { w: nw, h: nh } = getSize();
          renderer.setSize(nw, nh);
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        // --- ANIMATE (simple spin) ------------------------------------------
        renderer.setAnimationLoop(() => {
          // Calculate load deceleration
          const elapsedTime = Date.now() - loadStartTime;
          let loadSpinSpeed = 0;
          
          // Exponential decay continues indefinitely, smoothly approaching normalSpeed
          const progress = Math.min(elapsedTime / decelerationDuration, 1);
          const easeProgress = Math.exp(-4 * progress);
          // Always interpolate - no hard cutoff at duration end
          loadSpinSpeed = normalSpeed + (maxLoadSpeed - normalSpeed) * easeProgress;

          // spin + smoothing (both scroll and drag)
          ringGroup.rotation.y += scrollDelta * smoothness;
          ringGroup.rotation.y += dragDelta * smoothness;
          scrollDelta *= (1 - smoothness);
          dragDelta *= (1 - smoothness);
          ringGroup.rotation.y += normalSpeed + loadSpinSpeed; // Add both speeds

          const hoverScaleUp = 1.15;
          const hoverScaleDown = 1.0;
          const k = 0.15; // easing factor

          for (const g of ringPanels) {
            const target = g === hoveredGroup ? hoverScaleUp : hoverScaleDown;
            const s = g.scale.x + (target - g.scale.x) * k;
            g.scale.set(s, s, s);
          }

          renderer.render(scene, camera);
        });

        // Mark as loaded after successful initialization
        setIsLoading(false);

        // --- CLEANUP ---------------------------------------------------------
        return () => {
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", resetSpin);
          renderer.setAnimationLoop(null);
          renderer.domElement.removeEventListener("wheel", onWheel);
          renderer.domElement.removeEventListener("click", onClick);
          renderer.domElement.removeEventListener("pointermove", onPointerMove);
          renderer.domElement.removeEventListener("mousedown", onMouseDown);
          renderer.domElement.removeEventListener("mousemove", onMouseMove);
          renderer.domElement.removeEventListener("mouseup", onMouseUp);
          renderer.domElement.removeEventListener("mouseleave", onMouseLeave);

          ringGroup.children.forEach((g) => {
            for (const child of (g as THREE.Group).children) {
              const mesh = child as THREE.Mesh;
              (mesh.material as THREE.Material).dispose?.();
              mesh.geometry.dispose();
            }
          });

          textures.forEach((t) => t.dispose());
          renderer.dispose();
          if (renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement);
          }
        };
      } catch (e) {
        console.error('3D Carousel initialization error:', e);
        setError(String(e));
        setIsLoading(false);
      }
    })();

    // outer cleanup in case async exits early
    return () => {
      running = false;
      renderer.setAnimationLoop(null);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
    } catch (err) {
      console.error('3D Carousel Error:', err);
      setError('Failed to load 3D carousel');
      setIsLoading(false);
    }
  }, [isClient]);

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00A4FF]/20 border-t-[#00A4FF] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-[#f5f5f0] text-sm opacity-70">
            {!isClient ? 'Initializing 3D Scene...' : 'Loading 3D Projects...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#00A4FF] text-white rounded"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
}
