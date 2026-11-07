import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { PLUSH_THEMES } from "./Fluffy3DViewer";

// ── PROCEDURAL REALISTIC TEXTURE HELPERS ──

// Microfiber Velvet Fur Bump Map
function createVelvetFurTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      const weaveX = Math.sin(x * 0.8) * 14;
      const weaveY = Math.cos(y * 0.8) * 14;
      const fuzz = (Math.random() - 0.5) * 36;
      const val = Math.min(255, Math.max(0, 128 + weaveX + weaveY + fuzz));
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

// Amber Hazel Safety Eye Texture (Deep Glass Look)
function createAmberEyeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0c0a09";
  ctx.fillRect(0, 0, 256, 256);

  // Amber iris ring
  const irisGrad = ctx.createRadialGradient(128, 128, 35, 128, 128, 118);
  irisGrad.addColorStop(0, "#1c1008");
  irisGrad.addColorStop(0.45, "#78350f"); // Deep amber
  irisGrad.addColorStop(0.75, "#b45309"); // Warm honey
  irisGrad.addColorStop(0.92, "#d97706"); // Bright golden edge
  irisGrad.addColorStop(1, "#180d08");    // Dark outer rim
  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.fill();

  // Dark central pupil
  ctx.fillStyle = "#050505";
  ctx.beginPath();
  ctx.arc(128, 128, 62, 0, Math.PI * 2);
  ctx.fill();

  // Tiny catchlight glint baked in for depth
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.arc(162, 98, 16, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// Hand-Embroidered Nose Texture with Thread Ridges
function createEmbroideredNoseTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#26150f";
  ctx.fillRect(0, 0, 256, 256);

  // Horizontal embroidery thread ridges
  ctx.fillStyle = "#160c08";
  for (let y = 0; y < 256; y += 5) {
    ctx.fillRect(0, y, 256, 2);
  }

  // Soft velvet sheen on upper curve
  const grad = ctx.createLinearGradient(0, 0, 0, 100);
  grad.addColorStop(0, "rgba(90, 50, 35, 0.5)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 100);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// Knitted Ribbed Scarf Texture
function createKnitTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 256, 256);

  // Ribbed pattern
  for (let x = 0; x < 256; x += 16) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(x, 0, 6, 256);
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(x + 6, 0, 6, 256);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 2);
  return tex;
}

// ── KEYFRAMES FOR SCROLL STORY (Scaled & Refined) ──
const KEYFRAMES = [
  // 0: Hero — Centered, gentle breathing
  {
    posX: 0,
    posY: -0.12,
    posZ: 0,
    rotX: 0.08,
    rotY: 0,
    rotZ: 0,
    zoom: 6.4,
    heartVisible: false,
    armLift: 0,
    waveArm: false,
  },
  // 1: CloudFluff Texture — Shift right, close-up tilt on velvety muzzle & cheek
  {
    posX: 1.15,
    posY: 0.04,
    posZ: 0,
    rotX: 0.12,
    rotY: -0.68,
    rotZ: 0.02,
    zoom: 5.1,
    heartVisible: false,
    armLift: 0,
    waveArm: false,
  },
  // 2: Double-Lock Seams — Shift left, profile angle showcasing reinforced back & seams
  {
    posX: -1.15,
    posY: -0.1,
    posZ: 0,
    rotX: -0.06,
    rotY: 1.25,
    rotZ: -0.03,
    zoom: 5.0,
    heartVisible: false,
    armLift: 0,
    waveArm: false,
  },
  // 3: 100% Recycled Poly-Down Heart — Shift right, glowing heart beats inside chest
  {
    posX: 1.1,
    posY: -0.12,
    posZ: 0,
    rotX: 0.06,
    rotY: 0.0,
    rotZ: 0,
    zoom: 5.4,
    heartVisible: true,
    armLift: 0.2,
    waveArm: false,
  },
  // 4: Ergonomic Hug Calibration — Centered, arms welcomingly raised in a hug
  {
    posX: 0,
    posY: -0.08,
    posZ: 0,
    rotX: 0.2,
    rotY: 0.3,
    rotZ: 0,
    zoom: 5.8,
    heartVisible: true,
    armLift: 0.55,
    waveArm: false,
  },
  // 5: Interactive Customizer — Centered, 360 free drag unlocked
  {
    posX: 0,
    posY: -0.12,
    posZ: 0,
    rotX: 0.08,
    rotY: 0,
    rotZ: 0,
    zoom: 6.4,
    heartVisible: false,
    armLift: 0,
    waveArm: true,
  },
];

const Story3DCanvas = ({
  scrollProgress = 0,
  activeTheme = "honey",
  isCustomizerActive = false,
  userDragRot = { x: 0, y: 0 },
  bounceVal = 0,
  onModelClick = null,
}) => {
  const mountRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    bearGroup: null,
    headGroup: null,
    leftArm: null,
    rightArm: null,
    heartMesh: null,
    particles: null,
    torsoMesh: null,
    shadowPlane: null,
    materials: {},
    current: {
      posX: 0,
      posY: -0.12,
      posZ: 0,
      rotX: 0.08,
      rotY: 0,
      rotZ: 0,
      zoom: 6.4,
      armLift: 0,
    },
    scrollProgress: 0,
    activeTheme: "honey",
    isCustomizerActive: false,
    userDragRot: { x: 0, y: 0 },
    bounceVal: 0,
  });

  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.activeTheme = activeTheme;
    stateRef.current.isCustomizerActive = isCustomizerActive;
    stateRef.current.userDragRot = userDragRot;
    stateRef.current.bounceVal = bounceVal;
  }, [scrollProgress, activeTheme, isCustomizerActive, userDragRot, bounceVal]);

  // Sync materials when theme changes
  useEffect(() => {
    const { materials } = stateRef.current;
    if (!materials || !materials.fur) return;
    const theme = PLUSH_THEMES[activeTheme] || PLUSH_THEMES.honey;
    materials.fur.color.setHex(theme.furColor);
    materials.belly.color.setHex(theme.bellyColor);
    materials.innerEar.color.setHex(theme.innerEarColor);
    materials.scarf.color.setHex(theme.scarfColor);
  }, [activeTheme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. High-End Studio Lighting for Tactile Soft Toy
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.5);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.4);
    keyLight.position.set(3.5, 4.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Soft Ambient Fill Light
    const fillLight = new THREE.DirectionalLight(0xfef3c7, 1.3);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // Amber Rim Light (creates luminous velvet halo edge)
    const rimLight = new THREE.DirectionalLight(0xf97316, 2.8);
    rimLight.position.set(0, 3, -4.5);
    scene.add(rimLight);

    // Subtle Under-bounce Light
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.65);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 3. Realistic Textures
    const furBumpTex = createVelvetFurTexture();
    const eyeTex = createAmberEyeTexture();
    const noseTex = createEmbroideredNoseTexture();
    const knitTex = createKnitTexture();

    const theme = PLUSH_THEMES[activeTheme] || PLUSH_THEMES.honey;

    // Realistic Microfiber Velvet Fur Material
    const furMaterial = new THREE.MeshStandardMaterial({
      color: theme.furColor,
      bumpMap: furBumpTex,
      bumpScale: 0.028,
      roughness: 0.94,
      metalness: 0.02,
    });

    // Felt Belly Patch
    const bellyMaterial = new THREE.MeshStandardMaterial({
      color: theme.bellyColor,
      bumpMap: furBumpTex,
      bumpScale: 0.018,
      roughness: 0.92,
      metalness: 0.01,
    });

    // Soft Velvet Inner Ear
    const innerEarMaterial = new THREE.MeshStandardMaterial({
      color: theme.innerEarColor,
      bumpMap: furBumpTex,
      bumpScale: 0.015,
      roughness: 0.88,
      metalness: 0.01,
    });

    // Amber Glass Safety Eye Material
    const eyeMaterial = new THREE.MeshStandardMaterial({
      map: eyeTex,
      roughness: 0.04,
      metalness: 0.12,
    });

    // Eye Felt Socket Ring Material (Dark Chocolate)
    const eyeFeltSocketMat = new THREE.MeshStandardMaterial({
      color: 0x1f140e,
      roughness: 0.95,
      metalness: 0.0,
    });

    // Specular Highlight Glint
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Hand-Embroidered Nose Material
    const noseMaterial = new THREE.MeshStandardMaterial({
      map: noseTex,
      bumpMap: noseTex,
      bumpScale: 0.04,
      roughness: 0.72,
      metalness: 0.05,
    });

    // Embroidered Seam Thread Material (Dark Espresso)
    const threadMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c100b,
      roughness: 0.8,
      metalness: 0.05,
    });

    // Knitted Ribbed Scarf Material
    const scarfMaterial = new THREE.MeshStandardMaterial({
      color: theme.scarfColor,
      bumpMap: knitTex,
      bumpScale: 0.035,
      roughness: 0.82,
      metalness: 0.03,
    });

    // Glowing Eco-Heart Material
    const heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.65,
      roughness: 0.25,
      metalness: 0.1,
    });

    stateRef.current.materials = {
      fur: furMaterial,
      belly: bellyMaterial,
      innerEar: innerEarMaterial,
      eye: eyeMaterial,
      nose: noseMaterial,
      scarf: scarfMaterial,
      heart: heartMaterial,
    };

    // 4. Construct the Handcrafted Boutique Teddy Bear
    // Master Group with ~32% Smaller Refined Scale
    const bearGroup = new THREE.Group();
    bearGroup.scale.set(0.68, 0.68, 0.68); // Refined, elegant sizing!
    bearGroup.position.y = -0.12;
    scene.add(bearGroup);

    // ── TORSO (Chubby Teardrop Sitting Body) ──
    const torsoGeo = new THREE.SphereGeometry(1.0, 36, 36);
    torsoGeo.scale(1.02, 1.18, 0.94);
    const torsoMesh = new THREE.Mesh(torsoGeo, furMaterial);
    torsoMesh.position.set(0, -0.28, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    bearGroup.add(torsoMesh);
    stateRef.current.torsoMesh = torsoMesh;

    // ── BELLY PATCH (Soft Cream Felt Patch with Stitched Appearance) ──
    const bellyGeo = new THREE.SphereGeometry(0.7, 30, 30);
    bellyGeo.scale(0.82, 1.02, 0.32);
    const bellyMesh = new THREE.Mesh(bellyGeo, bellyMaterial);
    bellyMesh.position.set(0, -0.32, 0.7);
    bearGroup.add(bellyMesh);

    // Belly Center Seam Stitched Line
    const bellySeamGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.88, 8);
    const bellySeam = new THREE.Mesh(bellySeamGeo, threadMaterial);
    bellySeam.position.set(0, -0.32, 0.81);
    bearGroup.add(bellySeam);

    // ── GLOWING 3D RECYCLED HEART (Inside Chest) ──
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.18, -0.22, 0.35, -0.38, 0.35);
    heartShape.bezierCurveTo(-0.62, 0.35, -0.62, 0, -0.62, 0);
    heartShape.bezierCurveTo(-0.62, -0.22, -0.35, -0.5, 0, -0.75);
    heartShape.bezierCurveTo(0.35, -0.5, 0.62, -0.22, 0.62, 0);
    heartShape.bezierCurveTo(0.62, 0, 0.62, 0.35, 0.38, 0.35);
    heartShape.bezierCurveTo(0.22, 0.35, 0, 0.18, 0, 0);

    const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.scale(0.36, 0.36, 0.36);
    heartGeo.center();

    const heartMesh = new THREE.Mesh(heartGeo, heartMaterial);
    heartMesh.position.set(0, -0.18, 0.88);
    heartMesh.rotation.z = Math.PI;
    heartMesh.visible = false;
    bearGroup.add(heartMesh);
    stateRef.current.heartMesh = heartMesh;

    // ── HEAD GROUP (Organic Heirloom Proportions) ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.98, 0.02);
    bearGroup.add(headGroup);
    stateRef.current.headGroup = headGroup;

    // Head Base (Slightly tapered with chubby jowls)
    const headGeo = new THREE.SphereGeometry(0.84, 36, 36);
    headGeo.scale(1.1, 0.98, 1.02);
    const headMesh = new THREE.Mesh(headGeo, furMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Chubby Left & Right Cheek Puffs
    const cheekGeo = new THREE.SphereGeometry(0.34, 22, 22);
    cheekGeo.scale(1.0, 0.9, 0.8);
    const leftCheek = new THREE.Mesh(cheekGeo, furMaterial);
    leftCheek.position.set(-0.38, -0.15, 0.45);
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, furMaterial);
    rightCheek.position.set(0.38, -0.15, 0.45);
    headGroup.add(rightCheek);

    // Forehead Seam Line (Center Stitched Thread)
    const foreheadSeamGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.58, 8);
    const foreheadSeam = new THREE.Mesh(foreheadSeamGeo, threadMaterial);
    foreheadSeam.position.set(0, 0.45, 0.72);
    foreheadSeam.rotation.x = -0.32;
    headGroup.add(foreheadSeam);

    // ── SOFT CREAM VELVET SNOUT / MUZZLE ──
    const snoutGeo = new THREE.SphereGeometry(0.42, 28, 28);
    snoutGeo.scale(1.18, 0.82, 0.95);
    const snoutMesh = new THREE.Mesh(snoutGeo, bellyMaterial);
    snoutMesh.position.set(0, -0.14, 0.72);
    headGroup.add(snoutMesh);

    // ── HAND-EMBROIDERED NOSE (Triangular Stitch) ──
    const noseGeo = new THREE.SphereGeometry(0.13, 20, 20);
    noseGeo.scale(1.35, 0.82, 0.65);
    const noseMesh = new THREE.Mesh(noseGeo, noseMaterial);
    noseMesh.position.set(0, -0.02, 1.08);
    headGroup.add(noseMesh);

    // ── HAND-SEWN INVERTED 'Y' MOUTH STITCH ──
    // Vertical philtrum stitch descending from nose
    const philtrumGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8);
    const philtrumMesh = new THREE.Mesh(philtrumGeo, threadMaterial);
    philtrumMesh.position.set(0, -0.14, 1.05);
    headGroup.add(philtrumMesh);

    // Left smile curve stitch
    const smileCurveLeft = new THREE.CylinderGeometry(0.01, 0.01, 0.14, 8);
    const smileLeft = new THREE.Mesh(smileCurveLeft, threadMaterial);
    smileLeft.position.set(-0.06, -0.22, 1.02);
    smileLeft.rotation.z = 0.55;
    smileLeft.rotation.x = 0.2;
    headGroup.add(smileLeft);

    // Right smile curve stitch
    const smileCurveRight = new THREE.CylinderGeometry(0.01, 0.01, 0.14, 8);
    const smileRight = new THREE.Mesh(smileCurveRight, threadMaterial);
    smileRight.position.set(0.06, -0.22, 1.02);
    smileRight.rotation.z = -0.55;
    smileRight.rotation.x = 0.2;
    headGroup.add(smileRight);

    // ── AMBER GLASS SAFETY EYES WITH FELT BACKING ──
    const createRealisticEye = (x, isRight) => {
      const eyeG = new THREE.Group();
      eyeG.position.set(x, 0.14, 0.78);

      // 1. Recessed Felt Backing Ring (creates realistic soft indent in fur)
      const feltSocket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24),
        eyeFeltSocketMat
      );
      feltSocket.rotation.x = Math.PI / 2;
      feltSocket.position.z = -0.01;
      eyeG.add(feltSocket);

      // 2. Amber Glass Eye with Iris Texture
      const eyeBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.092, 24, 24),
        eyeMaterial
      );
      eyeG.add(eyeBall);

      // 3. Clear Acrylic Specular Dome Highlight
      const highlight = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 12, 12),
        eyeHighlightMat
      );
      highlight.position.set(isRight ? 0.025 : -0.025, 0.025, 0.075);
      eyeG.add(highlight);

      // 4. Subtle Embroidered Eyebrow Stitch
      const browGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
      const brow = new THREE.Mesh(browGeo, threadMaterial);
      brow.position.set(0, 0.15, 0.04);
      brow.rotation.z = isRight ? -0.28 : 0.28;
      eyeG.add(brow);

      return eyeG;
    };
    headGroup.add(createRealisticEye(0.32, true));
    headGroup.add(createRealisticEye(-0.32, false));

    // ── CUPPED PLUSH EARS WITH SEAM BORDERS ──
    const createCuppedEar = (isRight) => {
      const earG = new THREE.Group();
      const x = isRight ? 0.72 : -0.72;
      earG.position.set(x, 0.65, 0.04);
      earG.rotation.z = isRight ? -0.28 : 0.28;
      earG.rotation.y = isRight ? -0.18 : 0.18; // Cupped forward slightly
      earG.rotation.x = 0.12;

      // Outer cupped ear shell
      const outerGeo = new THREE.SphereGeometry(0.32, 24, 24);
      outerGeo.scale(1.0, 1.0, 0.4);
      const outer = new THREE.Mesh(outerGeo, furMaterial);
      earG.add(outer);

      // Inner ear soft felt pad
      const innerGeo = new THREE.SphereGeometry(0.21, 20, 20);
      innerGeo.scale(0.88, 0.88, 0.22);
      const inner = new THREE.Mesh(innerGeo, innerEarMaterial);
      inner.position.set(0, 0, 0.11);
      earG.add(inner);

      // Stitched rim seam line
      const seamGeo = new THREE.TorusGeometry(0.24, 0.012, 8, 20, Math.PI);
      const seam = new THREE.Mesh(seamGeo, threadMaterial);
      seam.position.set(0, 0.04, 0.08);
      seam.rotation.x = Math.PI / 2;
      earG.add(seam);

      return earG;
    };
    headGroup.add(createCuppedEar(false));
    headGroup.add(createCuppedEar(true));

    // ── KNITTED RIBBED SCARF WITH FRINGED TAIL ──
    const scarfGeo = new THREE.TorusGeometry(0.68, 0.15, 16, 32);
    scarfGeo.scale(1.0, 0.88, 0.82);
    const scarfMesh = new THREE.Mesh(scarfGeo, scarfMaterial);
    scarfMesh.rotation.x = Math.PI / 2;
    scarfMesh.position.set(0, 0.28, 0);
    bearGroup.add(scarfMesh);

    // Scarf knot
    const knotGeo = new THREE.SphereGeometry(0.18, 16, 16);
    knotGeo.scale(1.1, 0.85, 0.9);
    const scarfKnot = new THREE.Mesh(knotGeo, scarfMaterial);
    scarfKnot.position.set(0.28, 0.18, 0.68);
    bearGroup.add(scarfKnot);

    // Draped scarf tails with ribbed detail
    const scarfTailGeo = new THREE.BoxGeometry(0.22, 0.52, 0.06);
    const scarfTail = new THREE.Mesh(scarfTailGeo, scarfMaterial);
    scarfTail.position.set(0.28, -0.06, 0.72);
    scarfTail.rotation.z = -0.16;
    bearGroup.add(scarfTail);

    // ── ARMS & PAWS (Gently Curved Hugging Posture) ──
    const createCurvedArm = (isRight) => {
      const armG = new THREE.Group();
      const x = isRight ? 0.92 : -0.92;
      armG.position.set(x, 0.02, 0.14);
      armG.rotation.z = isRight ? -0.32 : 0.32;
      armG.rotation.x = 0.28;
      armG.rotation.y = isRight ? -0.15 : 0.15;

      // Arm body
      const armGeo = new THREE.SphereGeometry(0.32, 24, 24);
      armGeo.scale(0.8, 1.32, 0.8);
      const arm = new THREE.Mesh(armGeo, furMaterial);
      arm.position.set(0, -0.28, 0);
      arm.castShadow = true;
      armG.add(arm);

      // Paw pad felt insert
      const padGeo = new THREE.SphereGeometry(0.16, 18, 18);
      padGeo.scale(0.88, 0.88, 0.28);
      const pad = new THREE.Mesh(padGeo, bellyMaterial);
      pad.position.set(0, -0.56, 0.2);
      armG.add(pad);

      // Stitched toe divider lines on paw
      for (let i = -1; i <= 1; i++) {
        const toeGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.08, 6);
        const toe = new THREE.Mesh(toeGeo, threadMaterial);
        toe.position.set(i * 0.05, -0.66, 0.22);
        armG.add(toe);
      }

      return armG;
    };
    const leftArm = createCurvedArm(false);
    const rightArm = createCurvedArm(true);
    bearGroup.add(leftArm);
    bearGroup.add(rightArm);
    stateRef.current.leftArm = leftArm;
    stateRef.current.rightArm = rightArm;

    // ── CHUBBY SEATED LEGS & EMBROIDERED FOOT PADS ──
    const createChubbyLeg = (isRight) => {
      const legG = new THREE.Group();
      const x = isRight ? 0.62 : -0.62;
      legG.position.set(x, -0.98, 0.42);
      legG.rotation.x = -0.52;
      legG.rotation.y = isRight ? -0.18 : 0.18;

      // Leg curve
      const legGeo = new THREE.SphereGeometry(0.4, 24, 24);
      legGeo.scale(0.88, 1.22, 0.88);
      const leg = new THREE.Mesh(legGeo, furMaterial);
      leg.position.set(0, -0.22, 0);
      leg.castShadow = true;
      legG.add(leg);

      // Big Foot Pad in Cream Felt
      const footPadGeo = new THREE.SphereGeometry(0.26, 20, 20);
      footPadGeo.scale(1.0, 1.15, 0.28);
      const footPad = new THREE.Mesh(footPadGeo, bellyMaterial);
      footPad.position.set(0, -0.42, 0.32);
      legG.add(footPad);

      // 3 Mini Toe Pads on top of foot
      for (let t = -1; t <= 1; t++) {
        const miniPad = new THREE.Mesh(
          new THREE.SphereGeometry(0.048, 12, 12),
          innerEarMaterial
        );
        miniPad.scale.set(1, 1, 0.4);
        miniPad.position.set(t * 0.08, -0.22, 0.38);
        legG.add(miniPad);
      }

      return legG;
    };
    bearGroup.add(createChubbyLeg(false));
    bearGroup.add(createChubbyLeg(true));

    // ── SOFT ROUNDED TAIL ──
    const tailGeo = new THREE.SphereGeometry(0.22, 18, 18);
    const tailMesh = new THREE.Mesh(tailGeo, furMaterial);
    tailMesh.position.set(0, -0.85, -0.82);
    bearGroup.add(tailMesh);

    // ── SOFT CONTACT FLOOR SHADOW ──
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext("2d");
    const shadowGrad = shadowCtx.createRadialGradient(64, 64, 8, 64, 64, 58);
    shadowGrad.addColorStop(0, "rgba(35, 18, 8, 0.32)");
    shadowGrad.addColorStop(0.5, "rgba(35, 18, 8, 0.12)");
    shadowGrad.addColorStop(1, "rgba(35, 18, 8, 0)");
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.85;
    scene.add(shadowPlane);
    stateRef.current.shadowPlane = shadowPlane;

    // ── FLOATING AMBIENT FLUFF PARTICLES ──
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 5.5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 4.8;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 3.8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 28);
    pGrad.addColorStop(0, "rgba(255, 237, 213, 0.95)");
    pGrad.addColorStop(0.4, "rgba(234, 88, 12, 0.42)");
    pGrad.addColorStop(1, "rgba(234, 88, 12, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.24,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    stateRef.current.particles = particles;

    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.renderer = renderer;
    stateRef.current.bearGroup = bearGroup;

    // 5. Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 6. Animation Loop with Physics Smoothing
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const {
        scrollProgress: sp,
        isCustomizerActive: isCustomizer,
        userDragRot,
        bounceVal: bVal,
        current,
      } = stateRef.current;

      // Calculate Target Transform based on Scroll Progress
      const numSegments = KEYFRAMES.length - 1;
      const scaledProgress = Math.max(0, Math.min(1, sp)) * numSegments;
      const segmentIndex = Math.min(Math.floor(scaledProgress), numSegments - 1);
      const segmentT = scaledProgress - segmentIndex;

      const kfA = KEYFRAMES[segmentIndex];
      const kfB = KEYFRAMES[segmentIndex + 1];

      // Smooth ease
      const easeT = segmentT * segmentT * (3 - 2 * segmentT);

      let targetX = THREE.MathUtils.lerp(kfA.posX, kfB.posX, easeT);
      let targetY = THREE.MathUtils.lerp(kfA.posY, kfB.posY, easeT);
      let targetZ = THREE.MathUtils.lerp(kfA.posZ, kfB.posZ, easeT);

      let targetRotX = THREE.MathUtils.lerp(kfA.rotX, kfB.rotX, easeT);
      let targetRotY = THREE.MathUtils.lerp(kfA.rotY, kfB.rotY, easeT);
      let targetRotZ = THREE.MathUtils.lerp(kfA.rotZ, kfB.rotZ, easeT);

      let targetZoom = THREE.MathUtils.lerp(kfA.zoom, kfB.zoom, easeT);
      let targetArmLift = THREE.MathUtils.lerp(kfA.armLift, kfB.armLift, easeT);
      let targetHeart = kfB.heartVisible || kfA.heartVisible;

      // Apply drag offsets when in 360 Customizer mode
      if (isCustomizer) {
        targetRotY += userDragRot.y;
        targetRotX += userDragRot.x;
      }

      // Mobile viewport centering
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        targetX *= 0.3;
        targetZoom += 1.6;
      }

      // Lerp current transforms towards target (smooth physics)
      current.posX = THREE.MathUtils.lerp(current.posX, targetX, 0.08);
      current.posY = THREE.MathUtils.lerp(current.posY, targetY, 0.08);
      current.posZ = THREE.MathUtils.lerp(current.posZ, targetZ, 0.08);

      current.rotX = THREE.MathUtils.lerp(current.rotX, targetRotX, 0.08);
      current.rotY = THREE.MathUtils.lerp(current.rotY, targetRotY, 0.08);
      current.rotZ = THREE.MathUtils.lerp(current.rotZ, targetRotZ, 0.08);

      current.zoom = THREE.MathUtils.lerp(current.zoom, targetZoom, 0.08);
      current.armLift = THREE.MathUtils.lerp(current.armLift, targetArmLift, 0.08);

      // Gentle float & breathing
      const floatY = Math.sin(elapsedTime * 1.8) * 0.06;
      bearGroup.position.set(current.posX, current.posY + floatY + bVal, current.posZ);
      bearGroup.rotation.set(current.rotX, current.rotY, current.rotZ);

      // Camera distance
      camera.position.z = current.zoom;

      // Subtle torso breathing
      const breath = 1 + Math.sin(elapsedTime * 2.2) * 0.018;
      torsoMesh.scale.set(1.02 * breath, 1.18, 0.94 * breath);

      // Shadow Tracking
      if (shadowPlane) {
        shadowPlane.position.x = current.posX;
        shadowPlane.position.z = current.posZ;
        shadowPlane.scale.set(1 - floatY * 0.8, 1 - floatY * 0.8, 1);
      }

      // Dynamic Arm Poses
      if (leftArm && rightArm) {
        leftArm.rotation.x = 0.28 + current.armLift * 0.55;
        if (kfB.waveArm && isCustomizer) {
          rightArm.rotation.z = -0.32 + Math.sin(elapsedTime * 5.0) * 0.32;
          rightArm.rotation.x = 0.45 + Math.cos(elapsedTime * 5.0) * 0.15;
        } else {
          rightArm.rotation.x = 0.28 + current.armLift * 0.55;
          rightArm.rotation.z = -0.32;
        }
      }

      // Heart Pulsing
      if (heartMesh) {
        heartMesh.visible = targetHeart;
        if (targetHeart) {
          const pulse = 1 + Math.sin(elapsedTime * 5.5) * 0.22;
          heartMesh.scale.set(pulse, pulse, pulse);
        }
      }

      // Particle Drift
      if (particles) {
        particles.rotation.y = elapsedTime * 0.035;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="story-3d-fullscreen-canvas"
      onClick={onModelClick}
    />
  );
};

export default Story3DCanvas;
