// script.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const MODEL_URL = "images/Sakekagami/masu3D.glb";
const container = document.getElementById("card3d");

if (!container) {
  console.error("No #card3d element found");
} else {
  start();
}

function start() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
  camera.position.set(1.3, 1.3, 1.6);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.1));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(2, 3, 2);
  scene.add(dir);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  new ResizeObserver(resize).observe(container);
  resize();

  const loader = new GLTFLoader();
  let mixer = null;
  let pivot = null;

  function centerPivot(object) {
    // compute bbox center
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());

    // create pivot at world origin
    const pivot = new THREE.Group();
    scene.add(pivot);

    // move model so center = 0,0,0
    object.position.sub(center);
    pivot.add(object);

    return pivot;
  }

  loader.load(
    MODEL_URL,
    (gltf) => {
      const root = gltf.scene;

      // Apply wood texture
      const texLoader = new THREE.TextureLoader();
      const wood = new THREE.TextureLoader().load("images/Sakekagami/polished_oak.jpg");
      wood.colorSpace = THREE.SRGBColorSpace;
      wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
      wood.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 8;

      root.traverse(obj => { 
        if (obj.isMesh) { 
            if (obj.material && "transparent" in obj.material) {
                if (obj.material.opacity === 0) 
                    obj.material.opacity = 1; 
                    obj.material.transparent = true; 
                } 
            } 
        });
      root.traverse(obj => { 
        if (!obj.isMesh || !obj.material) return; 
            const key = (obj.name + ' ' + (obj.material.name || '')).toLowerCase(); 
            if (key.includes('masu') || key.includes('wood')) { 
                obj.material.map = wood;
                obj.material.metalness = 0; 
                obj.material.roughness = 0.6;
                obj.material.needsUpdate = true;
            } 
        });

      // scale before pivot
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.2 / maxDim;
      root.scale.setScalar(scale);

      pivot = centerPivot(root);

      controls.target.set(0, 0, 0);
      controls.update();

      if (gltf.animations?.length) {
        mixer = new THREE.AnimationMixer(root);
        mixer.clipAction(gltf.animations[0]).play();
      }
      console.log("Masu loaded & centered");
    },
    undefined,
    (err) => console.error("GLB failed:", err)
  );

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    mixer?.update(dt);
    controls.update();

    if (pivot) pivot.rotation.y += 0.01;

    renderer.render(scene, camera);
  });
}
