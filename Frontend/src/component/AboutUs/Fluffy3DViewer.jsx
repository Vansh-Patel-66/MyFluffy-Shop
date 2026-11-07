import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw, Heart, RefreshCw } from "lucide-react";

// Color palettes for plush bear
export const PLUSH_THEMES = {
  honey: {
    id: "honey",
    name: "Honey Velvet",
    furColor: 0xd97706,     // Warm golden honey
    bellyColor: 0xfef3c7,   // Cream ivory
    innerEarColor: 0xfecdd3,// Soft rose
    scarfColor: 0xea580c,   // Warm orange
  },
  toasted: {
    id: "toasted",
    name: "Toasted Caramel",
    furColor: 0x9a3412,     // Deep rich caramel
    bellyColor: 0xffedd5,   // Warm cream
    innerEarColor: 0xfbcfe8,// Petal pink
    scarfColor: 0xd97706,   // Gold accent
  },
  cloud: {
    id: "cloud",
    name: "Cloud Linen",
    furColor: 0xf5ebd9,     // Warm antique white
    bellyColor: 0xffffff,   // Pure cloud
    innerEarColor: 0xfecdd3,// Soft peach
    scarfColor: 0xea580c,   // Cozy warm orange scarf
  },
  rose: {
    id: "rose",
    name: "Blush Berry",
    furColor: 0xc05667,     // Dusty rose
    bellyColor: 0xfdf2f4,   // Soft pink white
    innerEarColor: 0xfbcfe8,// Baby pink
    scarfColor: 0x9f1239,   // Berry
  },
};

// Procedural Texture Generators for Realistic Handcrafted Look
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

function createAmberEyeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0c0a09";
  ctx.fillRect(0, 0, 256, 256);

  const irisGrad = ctx.createRadialGradient(128, 128, 35, 128, 128, 118);
  irisGrad.addColorStop(0, "#1c1008");
  irisGrad.addColorStop(0.45, "#78350f");
  irisGrad.addColorStop(0.75, "#b45309");
  irisGrad.addColorStop(0.92, "#d97706");
  irisGrad.addColorStop(1, "#180d08");
  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#050505";
  ctx.beginPath();
  ctx.arc(128, 128, 62, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.arc(162, 98, 16, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

function createEmbroideredNoseTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#26150f";
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = "#160c08";
  for (let y = 0; y < 256; y += 5) {
    ctx.fillRect(0, y, 256, 2);
  }

  const grad = ctx.createLinearGradient(0, 0, 0, 100);
  grad.addColorStop(0, "rgba(90, 50, 35, 0.5)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 100);

  return new THREE.CanvasTexture(canvas);
}

function createKnitTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 256, 256);

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

const Fluffy3DViewer = ({ currentChapter = 0, onToyClick = null }) => {
  const mountRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState("honey");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [heartPats, setHeartPats] = useState(0);
  const [patMessage, setPatMessage] = useState("");
  const animFrameIdRef = useRef(null);

  const sceneElementsRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    bearGroup: null,
    headGroup: null,
    leftArm: null,
    rightArm: null,
    heartMesh: null,
    particles: null,
    materials: {},
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
    targetRotY: 0,
    targetRotX: 0.08,
    targetZoom: 6.4,
    bounceVal: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

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

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.4);
    keyLight.position.set(3.5, 4.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfef3c7, 1.3);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 2.8);
    rimLight.position.set(0, 3, -4.5);
    scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.65);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // Realistic Textures
    const furBumpTex = createVelvetFurTexture();
    const eyeTex = createAmberEyeTexture();
    const noseTex = createEmbroideredNoseTexture();
    const knitTex = createKnitTexture();

    const theme = PLUSH_THEMES[activeTheme];

    const furMaterial = new THREE.MeshStandardMaterial({
      color: theme.furColor,
      bumpMap: furBumpTex,
      bumpScale: 0.028,
      roughness: 0.94,
      metalness: 0.02,
    });

    const bellyMaterial = new THREE.MeshStandardMaterial({
      color: theme.bellyColor,
      bumpMap: furBumpTex,
      bumpScale: 0.018,
      roughness: 0.92,
      metalness: 0.01,
    });

    const innerEarMaterial = new THREE.MeshStandardMaterial({
      color: theme.innerEarColor,
      bumpMap: furBumpTex,
      bumpScale: 0.015,
      roughness: 0.88,
      metalness: 0.01,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      map: eyeTex,
      roughness: 0.04,
      metalness: 0.12,
    });

    const eyeFeltSocketMat = new THREE.MeshStandardMaterial({
      color: 0x1f140e,
      roughness: 0.95,
      metalness: 0.0,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const noseMaterial = new THREE.MeshStandardMaterial({
      map: noseTex,
      bumpMap: noseTex,
      bumpScale: 0.04,
      roughness: 0.72,
      metalness: 0.05,
    });

    const threadMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c100b,
      roughness: 0.8,
      metalness: 0.05,
    });

    const scarfMaterial = new THREE.MeshStandardMaterial({
      color: theme.scarfColor,
      bumpMap: knitTex,
      bumpScale: 0.035,
      roughness: 0.82,
      metalness: 0.03,
    });

    const heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.65,
      roughness: 0.25,
      metalness: 0.1,
    });

    sceneElementsRef.current.materials = {
      fur: furMaterial,
      belly: bellyMaterial,
      innerEar: innerEarMaterial,
      eye: eyeMaterial,
      nose: noseMaterial,
      scarf: scarfMaterial,
      heart: heartMaterial,
    };

    // Smaller, refined scale for the Teddy Bear
    const bearGroup = new THREE.Group();
    bearGroup.scale.set(0.68, 0.68, 0.68); // ~32% smaller!
    bearGroup.position.y = -0.12;
    scene.add(bearGroup);

    // Torso
    const torsoGeo = new THREE.SphereGeometry(1.0, 36, 36);
    torsoGeo.scale(1.02, 1.18, 0.94);
    const torsoMesh = new THREE.Mesh(torsoGeo, furMaterial);
    torsoMesh.position.set(0, -0.28, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    bearGroup.add(torsoMesh);

    // Belly Patch
    const bellyGeo = new THREE.SphereGeometry(0.7, 30, 30);
    bellyGeo.scale(0.82, 1.02, 0.32);
    const bellyMesh = new THREE.Mesh(bellyGeo, bellyMaterial);
    bellyMesh.position.set(0, -0.32, 0.7);
    bearGroup.add(bellyMesh);

    // Belly Center Seam
    const bellySeamGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.88, 8);
    const bellySeam = new THREE.Mesh(bellySeamGeo, threadMaterial);
    bellySeam.position.set(0, -0.32, 0.81);
    bearGroup.add(bellySeam);

    // Heart
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
    sceneElementsRef.current.heartMesh = heartMesh;

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.98, 0.02);
    bearGroup.add(headGroup);
    sceneElementsRef.current.headGroup = headGroup;

    const headGeo = new THREE.SphereGeometry(0.84, 36, 36);
    headGeo.scale(1.1, 0.98, 1.02);
    const headMesh = new THREE.Mesh(headGeo, furMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Cheeks
    const cheekGeo = new THREE.SphereGeometry(0.34, 22, 22);
    cheekGeo.scale(1.0, 0.9, 0.8);
    const leftCheek = new THREE.Mesh(cheekGeo, furMaterial);
    leftCheek.position.set(-0.38, -0.15, 0.45);
    headGroup.add(leftCheek);
    const rightCheek = new THREE.Mesh(cheekGeo, furMaterial);
    rightCheek.position.set(0.38, -0.15, 0.45);
    headGroup.add(rightCheek);

    // Forehead Seam
    const foreheadSeamGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.58, 8);
    const foreheadSeam = new THREE.Mesh(foreheadSeamGeo, threadMaterial);
    foreheadSeam.position.set(0, 0.45, 0.72);
    foreheadSeam.rotation.x = -0.32;
    headGroup.add(foreheadSeam);

    // Snout
    const snoutGeo = new THREE.SphereGeometry(0.42, 28, 28);
    snoutGeo.scale(1.18, 0.82, 0.95);
    const snoutMesh = new THREE.Mesh(snoutGeo, bellyMaterial);
    snoutMesh.position.set(0, -0.14, 0.72);
    headGroup.add(snoutMesh);

    // Hand-Embroidered Nose
    const noseGeo = new THREE.SphereGeometry(0.13, 20, 20);
    noseGeo.scale(1.35, 0.82, 0.65);
    const noseMesh = new THREE.Mesh(noseGeo, noseMaterial);
    noseMesh.position.set(0, -0.02, 1.08);
    headGroup.add(noseMesh);

    // Inverted 'Y' Mouth
    const philtrumGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8);
    const philtrumMesh = new THREE.Mesh(philtrumGeo, threadMaterial);
    philtrumMesh.position.set(0, -0.14, 1.05);
    headGroup.add(philtrumMesh);

    const smileCurveLeft = new THREE.CylinderGeometry(0.01, 0.01, 0.14, 8);
    const smileLeft = new THREE.Mesh(smileCurveLeft, threadMaterial);
    smileLeft.position.set(-0.06, -0.22, 1.02);
    smileLeft.rotation.z = 0.55;
    smileLeft.rotation.x = 0.2;
    headGroup.add(smileLeft);

    const smileCurveRight = new THREE.CylinderGeometry(0.01, 0.01, 0.14, 8);
    const smileRight = new THREE.Mesh(smileCurveRight, threadMaterial);
    smileRight.position.set(0.06, -0.22, 1.02);
    smileRight.rotation.z = -0.55;
    smileRight.rotation.x = 0.2;
    headGroup.add(smileRight);

    // Eyes with Felt Backing
    const createRealisticEye = (x, isRight) => {
      const eyeG = new THREE.Group();
      eyeG.position.set(x, 0.14, 0.78);

      const feltSocket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24),
        eyeFeltSocketMat
      );
      feltSocket.rotation.x = Math.PI / 2;
      feltSocket.position.z = -0.01;
      eyeG.add(feltSocket);

      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.092, 24, 24), eyeMaterial);
      eyeG.add(eyeBall);

      const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), eyeHighlightMat);
      highlight.position.set(isRight ? 0.025 : -0.025, 0.025, 0.075);
      eyeG.add(highlight);

      const browGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
      const brow = new THREE.Mesh(browGeo, threadMaterial);
      brow.position.set(0, 0.15, 0.04);
      brow.rotation.z = isRight ? -0.28 : 0.28;
      eyeG.add(brow);

      return eyeG;
    };
    headGroup.add(createRealisticEye(0.32, true));
    headGroup.add(createRealisticEye(-0.32, false));

    // Cupped Ears
    const createCuppedEar = (isRight) => {
      const earG = new THREE.Group();
      const x = isRight ? 0.72 : -0.72;
      earG.position.set(x, 0.65, 0.04);
      earG.rotation.z = isRight ? -0.28 : 0.28;
      earG.rotation.y = isRight ? -0.18 : 0.18;
      earG.rotation.x = 0.12;

      const outerGeo = new THREE.SphereGeometry(0.32, 24, 24);
      outerGeo.scale(1.0, 1.0, 0.4);
      const outer = new THREE.Mesh(outerGeo, furMaterial);
      earG.add(outer);

      const innerGeo = new THREE.SphereGeometry(0.21, 20, 20);
      innerGeo.scale(0.88, 0.88, 0.22);
      const inner = new THREE.Mesh(innerGeo, innerEarMaterial);
      inner.position.set(0, 0, 0.11);
      earG.add(inner);

      const seamGeo = new THREE.TorusGeometry(0.24, 0.012, 8, 20, Math.PI);
      const seam = new THREE.Mesh(seamGeo, threadMaterial);
      seam.position.set(0, 0.04, 0.08);
      seam.rotation.x = Math.PI / 2;
      earG.add(seam);

      return earG;
    };
    headGroup.add(createCuppedEar(false));
    headGroup.add(createCuppedEar(true));

    // Scarf
    const scarfGeo = new THREE.TorusGeometry(0.68, 0.15, 16, 32);
    scarfGeo.scale(1.0, 0.88, 0.82);
    const scarfMesh = new THREE.Mesh(scarfGeo, scarfMaterial);
    scarfMesh.rotation.x = Math.PI / 2;
    scarfMesh.position.set(0, 0.28, 0);
    bearGroup.add(scarfMesh);

    const knotGeo = new THREE.SphereGeometry(0.18, 16, 16);
    knotGeo.scale(1.1, 0.85, 0.9);
    const scarfKnot = new THREE.Mesh(knotGeo, scarfMaterial);
    scarfKnot.position.set(0.28, 0.18, 0.68);
    bearGroup.add(scarfKnot);

    const scarfTailGeo = new THREE.BoxGeometry(0.22, 0.52, 0.06);
    const scarfTail = new THREE.Mesh(scarfTailGeo, scarfMaterial);
    scarfTail.position.set(0.28, -0.06, 0.72);
    scarfTail.rotation.z = -0.16;
    bearGroup.add(scarfTail);

    // Arms
    const createCurvedArm = (isRight) => {
      const armG = new THREE.Group();
      const x = isRight ? 0.92 : -0.92;
      armG.position.set(x, 0.02, 0.14);
      armG.rotation.z = isRight ? -0.32 : 0.32;
      armG.rotation.x = 0.28;
      armG.rotation.y = isRight ? -0.15 : 0.15;

      const armGeo = new THREE.SphereGeometry(0.32, 24, 24);
      armGeo.scale(0.8, 1.32, 0.8);
      const arm = new THREE.Mesh(armGeo, furMaterial);
      arm.position.set(0, -0.28, 0);
      arm.castShadow = true;
      armG.add(arm);

      const padGeo = new THREE.SphereGeometry(0.16, 18, 18);
      padGeo.scale(0.88, 0.88, 0.28);
      const pad = new THREE.Mesh(padGeo, bellyMaterial);
      pad.position.set(0, -0.56, 0.2);
      armG.add(pad);

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
    sceneElementsRef.current.leftArm = leftArm;
    sceneElementsRef.current.rightArm = rightArm;

    // Legs
    const createChubbyLeg = (isRight) => {
      const legG = new THREE.Group();
      const x = isRight ? 0.62 : -0.62;
      legG.position.set(x, -0.98, 0.42);
      legG.rotation.x = -0.52;
      legG.rotation.y = isRight ? -0.18 : 0.18;

      const legGeo = new THREE.SphereGeometry(0.4, 24, 24);
      legGeo.scale(0.88, 1.22, 0.88);
      const leg = new THREE.Mesh(legGeo, furMaterial);
      leg.position.set(0, -0.22, 0);
      leg.castShadow = true;
      legG.add(leg);

      const footPadGeo = new THREE.SphereGeometry(0.26, 20, 20);
      footPadGeo.scale(1.0, 1.15, 0.28);
      const footPad = new THREE.Mesh(footPadGeo, bellyMaterial);
      footPad.position.set(0, -0.42, 0.32);
      legG.add(footPad);

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

    // Tail
    const tailGeo = new THREE.SphereGeometry(0.22, 18, 18);
    const tailMesh = new THREE.Mesh(tailGeo, furMaterial);
    tailMesh.position.set(0, -0.85, -0.82);
    bearGroup.add(tailMesh);

    // Floor Shadow
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

    // Floating Particles
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

    sceneElementsRef.current.scene = scene;
    sceneElementsRef.current.camera = camera;
    sceneElementsRef.current.renderer = renderer;
    sceneElementsRef.current.bearGroup = bearGroup;

    // Pointer controls
    let isPointerDown = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e) => {
      isPointerDown = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (isPointerDown) {
        const deltaX = clientX - prevX;
        const deltaY = clientY - prevY;
        sceneElementsRef.current.targetRotY += deltaX * 0.009;
        sceneElementsRef.current.targetRotX += deltaY * 0.007;
        sceneElementsRef.current.targetRotX = Math.max(-0.4, Math.min(0.55, sceneElementsRef.current.targetRotX));
        prevX = clientX;
        prevY = clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
        if (headGroup) {
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, normX * 0.32, 0.05);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -normY * 0.22, 0.05);
        }
      }
    };

    const onPointerUp = () => {
      isPointerDown = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      sceneElementsRef.current.targetZoom += e.deltaY * 0.0035;
      sceneElementsRef.current.targetZoom = Math.max(4.5, Math.min(8.5, sceneElementsRef.current.targetZoom));
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      camera.position.z = THREE.MathUtils.lerp(camera.position.z, sceneElementsRef.current.targetZoom, 0.06);

      if (isAutoRotating && !isPointerDown) {
        sceneElementsRef.current.targetRotY += 0.004;
      }

      bearGroup.rotation.y = THREE.MathUtils.lerp(bearGroup.rotation.y, sceneElementsRef.current.targetRotY, 0.08);
      bearGroup.rotation.x = THREE.MathUtils.lerp(bearGroup.rotation.x, sceneElementsRef.current.targetRotX, 0.08);

      const floatY = Math.sin(elapsedTime * 1.8) * 0.06;
      const bounceOffset = sceneElementsRef.current.bounceVal;
      sceneElementsRef.current.bounceVal = THREE.MathUtils.lerp(sceneElementsRef.current.bounceVal, 0, 0.08);

      bearGroup.position.y = -0.12 + floatY + bounceOffset;

      const breathScale = 1 + Math.sin(elapsedTime * 2.2) * 0.018;
      torsoMesh.scale.set(1.02 * breathScale, 1.18, 0.94 * breathScale);

      shadowPlane.scale.set(1 - floatY * 0.8, 1 - floatY * 0.8, 1);

      if (heartMesh && heartMesh.visible) {
        const heartPulse = 1 + Math.sin(elapsedTime * 5.0) * 0.18;
        heartMesh.scale.set(heartPulse, heartPulse, heartPulse);
      }

      if (rightArm) {
        if (currentChapter === 3) {
          rightArm.rotation.z = -0.32 + Math.sin(elapsedTime * 5.5) * 0.35;
          rightArm.rotation.x = 0.45 + Math.cos(elapsedTime * 5.5) * 0.15;
        } else {
          rightArm.rotation.z = -0.32 + Math.sin(elapsedTime * 1.8) * 0.04;
          rightArm.rotation.x = 0.28;
        }
      }

      if (particles) {
        particles.rotation.y = elapsedTime * 0.035;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const { materials } = sceneElementsRef.current;
    if (!materials || !materials.fur) return;
    const theme = PLUSH_THEMES[activeTheme];
    materials.fur.color.setHex(theme.furColor);
    materials.belly.color.setHex(theme.bellyColor);
    materials.innerEar.color.setHex(theme.innerEarColor);
    materials.scarf.color.setHex(theme.scarfColor);
  }, [activeTheme]);

  useEffect(() => {
    const { heartMesh } = sceneElementsRef.current;
    if (!heartMesh) return;

    if (currentChapter === 0) {
      sceneElementsRef.current.targetZoom = 6.4;
      sceneElementsRef.current.targetRotX = 0.08;
      heartMesh.visible = false;
    } else if (currentChapter === 1) {
      sceneElementsRef.current.targetZoom = 5.0;
      sceneElementsRef.current.targetRotX = 0.16;
      heartMesh.visible = false;
    } else if (currentChapter === 2) {
      sceneElementsRef.current.targetZoom = 5.4;
      sceneElementsRef.current.targetRotX = 0.08;
      heartMesh.visible = true;
    } else if (currentChapter === 3) {
      sceneElementsRef.current.targetZoom = 6.4;
      sceneElementsRef.current.targetRotX = 0.05;
      heartMesh.visible = true;
    }
  }, [currentChapter]);

  const handlePat = () => {
    setHeartPats((prev) => prev + 1);
    sceneElementsRef.current.bounceVal = 0.22;

    const messages = [
      "Soft & warm! ✨",
      "Giggle! *paws wiggle* 🧸",
      "Filled with cloud love! ☁️",
      "100% squishable! 💕",
      "Pure velvet bliss! 🌟",
    ];
    setPatMessage(messages[Math.floor(Math.random() * messages.length)]);

    setTimeout(() => {
      setPatMessage("");
    }, 2200);

    if (onToyClick) onToyClick();
  };

  const handleResetView = () => {
    sceneElementsRef.current.targetRotX = 0.08;
    sceneElementsRef.current.targetRotY = 0;
    sceneElementsRef.current.targetZoom = 6.4;
  };

  return (
    <div className="fluffy-3d-stage-wrapper">
      <div
        ref={mountRef}
        className="fluffy-3d-canvas-container"
        onClick={handlePat}
        title="Click & drag to rotate in 3D • Click to hug!"
      />

      <div className="fluffy-3d-overlay-ui">
        <div className="toy-status-badge">
          <span className="live-dot" />
          <span className="toy-status-text">Handcrafted 3D Heirloom Companion</span>
          <span className="toy-3d-pill">Drag to Spin • 360°</span>
        </div>

        {patMessage && (
          <div className="pat-toast-bubble animate-pop-bounce">
            <Heart size={16} className="heart-bounce" />
            <span>{patMessage}</span>
          </div>
        )}

        <div className="fluffy-3d-bottom-controls">
          <button className="toy-action-btn pat-btn" onClick={handlePat}>
            <Heart size={15} />
            <span>Hug Me {heartPats > 0 && `(${heartPats})`}</span>
          </button>

          <button
            className={`toy-action-btn ${isAutoRotating ? "active" : ""}`}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
          >
            <RotateCw size={14} className={isAutoRotating ? "spin-slow" : ""} />
            <span>Orbit</span>
          </button>

          <button className="toy-action-btn" onClick={handleResetView}>
            <RefreshCw size={14} />
            <span>Front</span>
          </button>
        </div>

        <div className="fluffy-fur-picker">
          <span className="fur-picker-label">Velvet Coat:</span>
          <div className="fur-swatch-rack">
            {Object.values(PLUSH_THEMES).map((thm) => (
              <button
                key={thm.id}
                className={`fur-swatch-btn ${activeTheme === thm.id ? "active" : ""}`}
                style={{
                  backgroundColor: `#${thm.furColor.toString(16).padStart(6, "0")}`,
                  border: activeTheme === thm.id ? "2px solid #ea580c" : "2px solid #ffffff",
                }}
                onClick={() => setActiveTheme(thm.id)}
                title={thm.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fluffy3DViewer;
