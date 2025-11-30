"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Item = { src: string; href: string };

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

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
          // @ts-ignore
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = renderer.capabilities.getMaxAnisotropy();
          t.wrapS = THREE.ClampToEdgeWrapping;
          t.wrapT = THREE.ClampToEdgeWrapping;
        });

        // widths from source aspect
        const widths = textures.map((t) => {
          const img = t.image as HTMLImageElement | { width: number; height: number };
          const iw = (img as any).naturalWidth ?? img.width;
          const ih = (img as any).naturalHeight ?? img.height;
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

        // --- TOUCH EVENTS FOR MOBILE -----------------------------------------
        let isTouching = false;
        let previousTouchX = 0;
        let touchStartTime = 0;
        let touchStartPosition = { x: 0, y: 0 };
        let hasTouchMoved = false;

        const onTouchStart = (e: TouchEvent) => {
          e.preventDefault();
          isTouching = true;
          previousTouchX = e.touches[0].clientX;
          touchStartTime = Date.now();
          touchStartPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          hasTouchMoved = false;
        };

        const onTouchMove = (e: TouchEvent) => {
          if (!isTouching) return;
          e.preventDefault();
          
          const deltaX = e.touches[0].clientX - previousTouchX;
          const totalMoveDistance = Math.abs(e.touches[0].clientX - touchStartPosition.x) + 
                                   Math.abs(e.touches[0].clientY - touchStartPosition.y);
          
          // If moved more than 10px, consider it a drag, not a tap
          if (totalMoveDistance > 10) {
            hasTouchMoved = true;
            dragDelta += deltaX * dragSensitivity;
          }
          
          previousTouchX = e.touches[0].clientX;
        };

        const onTouchEnd = (e: TouchEvent) => {
          e.preventDefault();
          
          const touchEndTime = Date.now();
          const touchDuration = touchEndTime - touchStartTime;
          
          // If it was a quick tap (less than 300ms) and didn't move much, treat as click
          if (!hasTouchMoved && touchDuration < 300) {
            // Convert touch coordinates to mouse-like coordinates for raycaster
            const touch = e.changedTouches[0];
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(pickTargets, false);
            const hit = hits[0]?.object as THREE.Mesh | undefined;
            if (hit) {
              const href = (hit.parent as THREE.Group).userData.href as string;
              if (href) window.location.href = href;
            }
          }
          
          isTouching = false;
          hasTouchMoved = false;
        };

        renderer.domElement.addEventListener("mousedown", onMouseDown);
        renderer.domElement.addEventListener("mousemove", onMouseMove);
        renderer.domElement.addEventListener("mouseup", onMouseUp);
        renderer.domElement.addEventListener("mouseleave", onMouseLeave);
        
        // Add touch event listeners
        renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false });
        renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
        renderer.domElement.addEventListener("touchend", onTouchEnd, { passive: false });

        // --- LOAD SPIN DECELERATION ------------------------------------------
        let loadStartTime = Date.now();
        const decelerationDuration = 4000; // 5 seconds for longer, smoother decay
        const maxLoadSpeed = 0.3; // fast initial spin speed
        const normalSpeed = 0.00001; // normal spin speed

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

        // --- CLEANUP ---------------------------------------------------------
        return () => {
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", resetSpin);
          renderer.setAnimationLoop(null);
          renderer.domElement.removeEventListener("wheel", onWheel as any);
          renderer.domElement.removeEventListener("click", onClick as any);
          renderer.domElement.removeEventListener("pointermove", onPointerMove as any);
          renderer.domElement.removeEventListener("mousedown", onMouseDown as any);
          renderer.domElement.removeEventListener("mousemove", onMouseMove as any);
          renderer.domElement.removeEventListener("mouseup", onMouseUp as any);
          renderer.domElement.removeEventListener("mouseleave", onMouseLeave as any);
          
          // Remove touch event listeners
          renderer.domElement.removeEventListener("touchstart", onTouchStart as any);
          renderer.domElement.removeEventListener("touchmove", onTouchMove as any);
          renderer.domElement.removeEventListener("touchend", onTouchEnd as any);

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
        console.error(e);
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
  }, []);

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
