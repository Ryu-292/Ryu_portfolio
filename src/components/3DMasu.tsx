"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export function Masu3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const MODEL_URL = "/images/Sakekagami/masu3D.glb";
    const WOOD_URL = "/images/Sakekagami/polished_oak.jpg";

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Scene setup
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
    camera.position.set(0, 1, 1.9);



    // Lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(2, 3, 2);
    scene.add(dir);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controls.update();

    // Resize handler
    const resize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Model loading
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    let pivot: THREE.Group | null = null;

    function centerPivot(object: THREE.Object3D): THREE.Group {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());

      const pivot = new THREE.Group();
      scene.add(pivot);

      object.position.sub(center);
      pivot.add(object);

      return pivot;
    }

    loader.load(
      MODEL_URL,
      (gltf) => {
        const root = gltf.scene;

        // Load wood texture
        const textureLoader = new THREE.TextureLoader();
        const wood = textureLoader.load(WOOD_URL);
        wood.colorSpace = THREE.SRGBColorSpace;
        wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
        wood.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 8;

        // Fix transparency
        root.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.material) {
            if ("transparent" in obj.material && "opacity" in obj.material) {
              if (obj.material.opacity === 0) {
                obj.material.opacity = 1;
                obj.material.transparent = true;
              }
            }
          }
        });

        // Apply wood material
        root.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh) || !obj.material) return;

          const key = (obj.name + " " + (obj.material.name || "")).toLowerCase();
          if (key.includes("masu") || key.includes("wood")) {
            if (obj.material instanceof THREE.MeshStandardMaterial) {
              obj.material.map = wood;
              obj.material.metalness = 0;
              obj.material.roughness = 0.6;
              obj.material.needsUpdate = true;
            }
          }
        });

        // Scale model
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.2 / maxDim;
        root.scale.setScalar(scale);

        // Center and add to scene
        pivot = centerPivot(root);

        // Make camera orbit around the model's pivot
        controls.target.copy(pivot.position);
        controls.update();


        // Animation
        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(root);
          mixer.clipAction(gltf.animations[0]).play();
        }

        console.log("Masu loaded & centered");
      },
      undefined,
      (err) => console.error("GLB failed:", err)
    );

    // Animation loop
    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      mixer?.update(dt);
      controls.update();

      if (pivot) pivot.rotation.y += 0.001;

      renderer.render(scene, camera);
    });

    // Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="card3d"
      className="tiny-3d rounded-3xl border border-white/15 bg-white/5"
    />
  );
}
