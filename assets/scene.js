import * as THREE from "three";

const canvas = document.querySelector("#hero3d");
const host = canvas?.parentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && host) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    scene.add(new THREE.AmbientLight(0x8cefe0, 1.7));
    const key = new THREE.PointLight(0x63e8d0, 34, 18);
    key.position.set(3, 3, 5);
    scene.add(key);
    const blue = new THREE.PointLight(0x4c8dff, 25, 15);
    blue.position.set(-3, -2, 3);
    scene.add(blue);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(1.3, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x123d49, metalness: 0.55, roughness: 0.22,
      transparent: true, opacity: 0.92, flatShading: true,
      clearcoat: 0.9, clearcoatRoughness: 0.2
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.52, 1),
      new THREE.MeshBasicMaterial({ color: 0x72f5dd, wireframe: true, transparent: true, opacity: 0.34 })
    );
    group.add(wire);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x7bc9e8, transparent: true, opacity: 0.55 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.008, 8, 140), ringMaterial);
    ringA.rotation.set(1.1, 0.3, 0.25);
    group.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.006, 8, 140),
      new THREE.MeshBasicMaterial({ color: 0x6ce9d4, transparent: true, opacity: 0.35 }));
    ringB.rotation.set(0.25, 1.2, 0.65);
    group.add(ringB);

    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x5ce6d0, metalness: 0.7, roughness: 0.22 });
    const cubes = [];
    for (let i = 0; i < 7; i++) {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.13 + (i % 3) * 0.035, 0.13 + (i % 3) * 0.035, 0.13 + (i % 3) * 0.035), cubeMaterial);
      const angle = (i / 7) * Math.PI * 2;
      cube.position.set(Math.cos(angle) * (2.1 + (i % 2) * 0.25), Math.sin(angle) * (1.2 + (i % 3) * 0.15), (i % 3 - 1) * 0.35);
      cube.rotation.set(angle, angle * 0.6, 0);
      group.add(cube);
      cubes.push(cube);
    }

    const particleCount = 360;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x8debdc, size: 0.018, transparent: true, opacity: 0.68 }));
    scene.add(particles);

    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    host.addEventListener("pointermove", (event) => {
      const rect = host.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.45;
    });
    host.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; });

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let frame = 0;
    function animate() {
      requestAnimationFrame(animate);
      frame += 1;
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;
      if (!reduceMotion) {
        group.rotation.y += 0.003;
        group.rotation.x = Math.sin(frame * 0.005) * 0.09 + pointerY;
        group.position.y = Math.sin(frame * 0.009) * 0.08;
        ringA.rotation.z += 0.0018;
        ringB.rotation.x += 0.0013;
        cubes.forEach((cube, i) => { cube.rotation.x += 0.003 + i * 0.0001; cube.rotation.y += 0.004; });
        particles.rotation.y += 0.00025;
      } else {
        group.rotation.x = pointerY;
      }
      group.rotation.y += pointerX * 0.012;
      renderer.render(scene, camera);
    }
    animate();
  } catch (error) {
    console.warn("3D scene could not start; CSS visuals remain available.", error);
    canvas.hidden = true;
  }
}


// Scroll-controlled 3D storytelling: the camera and scene evolve with page progress.
const storySection = document.querySelector("#story");
const storyObject = document.querySelector("#storyObject");
const storySteps = [...document.querySelectorAll(".story-step")];
let storyProgress = 0;
let storyTarget = 0;
let storyFrame = 0;

if (storySection) {
  const updateStory = () => {
    const rect = storySection.getBoundingClientRect();
    const travel = Math.max(1, storySection.offsetHeight - window.innerHeight);
    storyTarget = Math.max(0, Math.min(1, -rect.top / travel));
    const step = Math.min(2, Math.floor(storyTarget * 3.001));
    storySteps.forEach((el, index) => el.classList.toggle("active", index === step));
    if (storyObject) {
      const rotateY = -24 + storyTarget * 100;
      const rotateX = 8 + Math.sin(storyTarget * Math.PI * 2) * 12;
      const scale = 1 + Math.sin(storyTarget * Math.PI) * 0.18;
      const lift = Math.sin(storyTarget * Math.PI * 2) * 24;
      storyObject.style.transform = `translateY(${lift}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
    }
  };
  window.addEventListener("scroll", updateStory, { passive: true });
  window.addEventListener("resize", updateStory);
  updateStory();
}

// Also let the Three.js hero respond subtly to scroll depth.
window.addEventListener("scroll", () => {
  const canvas = document.querySelector("#hero3d");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  canvas.style.transform = `translateY(${(progress - 0.5) * -18}px)`;
}, { passive: true });
