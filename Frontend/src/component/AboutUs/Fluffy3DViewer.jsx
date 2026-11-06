import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw, Heart, Eye, RefreshCw } from "lucide-react";

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

const Fluffy3DViewer = ({ currentChapter = 0, onToyClick = null }) => {
  const mountRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState("honey");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [heartPats, setHeartPats] = useState(0);
  const [patMessage, setPatMessage] = useState("");
  const animFrameIdRef = useRef(null);

  // References to 3D parts for animation
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
    targetZoom: 6.8,
    bounceVal: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6.8);

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
    renderer.toneMappingExposure = 1.15;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Soft Studio Lighting for Velvet Texture)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfef3c7, 1.1);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // Back / Rim Light for Velvet Plush Edge Glow
    const rimLight = new THREE.DirectionalLight(0xf97316, 2.5);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // Bottom soft bounce light
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.6);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 3. Materials
    const theme = PLUSH_THEMES[activeTheme];

    const furMaterial = new THREE.MeshStandardMaterial({
      color: theme.furColor,
      roughness: 0.88,
      metalness: 0.04,
    });

    const bellyMaterial = new THREE.MeshStandardMaterial({
      color: theme.bellyColor,
      roughness: 0.92,
      metalness: 0.02,
    });

    const innerEarMaterial = new THREE.MeshStandardMaterial({
      color: theme.innerEarColor,
      roughness: 0.85,
      metalness: 0.02,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.08,
      metalness: 0.1,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const noseMaterial = new THREE.MeshStandardMaterial({
      color: 0x241611,
      roughness: 0.65,
      metalness: 0.08,
    });

    const scarfMaterial = new THREE.MeshStandardMaterial({
      color: theme.scarfColor,
      roughness: 0.8,
      metalness: 0.05,
    });

    const heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
      roughness: 0.3,
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

    // 4. Construct the 3D Soft Toy (Teddy Bear)
    const bearGroup = new THREE.Group();
    bearGroup.position.y = -0.15;
    scene.add(bearGroup);

    // ── TORSO ──
    const torsoGeo = new THREE.SphereGeometry(1.05, 32, 32);
    torsoGeo.scale(1.05, 1.2, 0.95);
    const torsoMesh = new THREE.Mesh(torsoGeo, furMaterial);
    torsoMesh.position.set(0, -0.3, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    bearGroup.add(torsoMesh);

    // ── BELLY PATCH ──
    const bellyGeo = new THREE.SphereGeometry(0.72, 28, 28);
    bellyGeo.scale(0.85, 1.05, 0.35);
    const bellyMesh = new THREE.Mesh(bellyGeo, bellyMaterial);
    bellyMesh.position.set(0, -0.35, 0.72);
    bearGroup.add(bellyMesh);

    // ── HEART (Pulsing inside chest) ──
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.18, -0.22, 0.35, -0.38, 0.35);
    heartShape.bezierCurveTo(-0.62, 0.35, -0.62, 0, -0.62, 0);
    heartShape.bezierCurveTo(-0.62, -0.22, -0.35, -0.5, 0, -0.75);
    heartShape.bezierCurveTo(0.35, -0.5, 0.62, -0.22, 0.62, 0);
    heartShape.bezierCurveTo(0.62, 0, 0.62, 0.35, 0.38, 0.35);
    heartShape.bezierCurveTo(0.22, 0.35, 0, 0.18, 0, 0);

    const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.scale(0.38, 0.38, 0.38);
    heartGeo.center();

    const heartMesh = new THREE.Mesh(heartGeo, heartMaterial);
    heartMesh.position.set(0, -0.22, 0.92);
    heartMesh.rotation.z = Math.PI; // flip heart upright
    heartMesh.visible = false;
    bearGroup.add(heartMesh);
    sceneElementsRef.current.heartMesh = heartMesh;

    // ── HEAD GROUP ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.05, 0);
    bearGroup.add(headGroup);
    sceneElementsRef.current.headGroup = headGroup;

    // Head Sphere
    const headGeo = new THREE.SphereGeometry(0.88, 32, 32);
    headGeo.scale(1.12, 1.0, 1.02);
    const headMesh = new THREE.Mesh(headGeo, furMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Snout / Muzzle
    const snoutGeo = new THREE.SphereGeometry(0.42, 24, 24);
    snoutGeo.scale(1.15, 0.85, 0.9);
    const snoutMesh = new THREE.Mesh(snoutGeo, bellyMaterial);
    snoutMesh.position.set(0, -0.12, 0.75);
    headGroup.add(snoutMesh);

    // Cute Soft Nose
    const noseGeo = new THREE.SphereGeometry(0.12, 18, 18);
    noseGeo.scale(1.3, 0.85, 0.7);
    const noseMesh = new THREE.Mesh(noseGeo, noseMaterial);
    noseMesh.position.set(0, 0.02, 1.12);
    headGroup.add(noseMesh);

    // Safety Eyes with Highlights
    const createEye = (x) => {
      const eyeG = new THREE.Group();
      eyeG.position.set(x, 0.16, 0.82);

      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 20), eyeMaterial);
      eyeG.add(eyeBall);

      const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), eyeHighlightMat);
      highlight.position.set(0.03, 0.03, 0.08);
      eyeG.add(highlight);

      return eyeG;
    };
    headGroup.add(createEye(0.33));
    headGroup.add(createEye(-0.33));

    // Plush Ears (Left & Right)
    const createEar = (isRight) => {
      const earG = new THREE.Group();
      const x = isRight ? 0.76 : -0.76;
      earG.position.set(x, 0.68, 0.05);
      earG.rotation.z = isRight ? -0.25 : 0.25;

      const outerEarGeo = new THREE.SphereGeometry(0.34, 22, 22);
      outerEarGeo.scale(1.0, 1.0, 0.45);
      const outerEar = new THREE.Mesh(outerEarGeo, furMaterial);
      earG.add(outerEar);

      const innerEarGeo = new THREE.SphereGeometry(0.22, 18, 18);
      innerEarGeo.scale(0.9, 0.9, 0.25);
      const innerEar = new THREE.Mesh(innerEarGeo, innerEarMaterial);
      innerEar.position.set(0, 0, 0.12);
      earG.add(innerEar);

      return earG;
    };
    headGroup.add(createEar(false));
    headGroup.add(createEar(true));

    // ── COZY KNITTED SCARF ──
    const scarfGeo = new THREE.TorusGeometry(0.72, 0.16, 16, 32);
    scarfGeo.scale(1.0, 0.9, 0.85);
    const scarfMesh = new THREE.Mesh(scarfGeo, scarfMaterial);
    scarfMesh.rotation.x = Math.PI / 2;
    scarfMesh.position.set(0, 0.32, 0);
    bearGroup.add(scarfMesh);

    // Scarf Knot & Tail
    const scarfTailGeo = new THREE.BoxGeometry(0.24, 0.55, 0.08);
    const scarfTail = new THREE.Mesh(scarfTailGeo, scarfMaterial);
    scarfTail.position.set(0.3, 0.05, 0.76);
    scarfTail.rotation.z = -0.2;
    bearGroup.add(scarfTail);

    // ── ARMS ──
    const createArm = (isRight) => {
      const armG = new THREE.Group();
      const x = isRight ? 0.96 : -0.96;
      armG.position.set(x, 0.05, 0.15);
      armG.rotation.z = isRight ? -0.35 : 0.35;
      armG.rotation.x = 0.3;

      const armGeo = new THREE.SphereGeometry(0.34, 22, 22);
      armGeo.scale(0.8, 1.35, 0.8);
      const arm = new THREE.Mesh(armGeo, furMaterial);
      arm.position.set(0, -0.3, 0);
      arm.castShadow = true;
      armG.add(arm);

      // Paw pad
      const padGeo = new THREE.SphereGeometry(0.18, 16, 16);
      padGeo.scale(0.9, 0.9, 0.3);
      const pad = new THREE.Mesh(padGeo, bellyMaterial);
      pad.position.set(0, -0.6, 0.22);
      armG.add(pad);

      return armG;
    };
    const leftArm = createArm(false);
    const rightArm = createArm(true);
    bearGroup.add(leftArm);
    bearGroup.add(rightArm);
    sceneElementsRef.current.leftArm = leftArm;
    sceneElementsRef.current.rightArm = rightArm;

    // ── LEGS (Cute seated pose) ──
    const createLeg = (isRight) => {
      const legG = new THREE.Group();
      const x = isRight ? 0.65 : -0.65;
      legG.position.set(x, -1.05, 0.45);
      legG.rotation.x = -0.55;
      legG.rotation.y = isRight ? -0.2 : 0.2;

      const legGeo = new THREE.SphereGeometry(0.42, 22, 22);
      legGeo.scale(0.9, 1.25, 0.9);
      const leg = new THREE.Mesh(legGeo, furMaterial);
      leg.position.set(0, -0.25, 0);
      leg.castShadow = true;
      legG.add(leg);

      // Big Foot Paw Pad
      const footPadGeo = new THREE.SphereGeometry(0.28, 18, 18);
      footPadGeo.scale(1.0, 1.15, 0.3);
      const footPad = new THREE.Mesh(footPadGeo, bellyMaterial);
      footPad.position.set(0, -0.45, 0.35);
      legG.add(footPad);

      return legG;
    };
    bearGroup.add(createLeg(false));
    bearGroup.add(createLeg(true));

    // ── FLUFFY TAIL ──
    const tailGeo = new THREE.SphereGeometry(0.24, 18, 18);
    const tailMesh = new THREE.Mesh(tailGeo, furMaterial);
    tailMesh.position.set(0, -0.9, -0.85);
    bearGroup.add(tailMesh);

    // ── SOFT CONTACT SHADOW ON FLOOR ──
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext("2d");
    const gradient = shadowCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    gradient.addColorStop(0, "rgba(40, 20, 10, 0.28)");
    gradient.addColorStop(0.5, "rgba(40, 20, 10, 0.12)");
    gradient.addColorStop(1, "rgba(40, 20, 10, 0)");
    shadowCtx.fillStyle = gradient;
    shadowCtx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.95;
    scene.add(shadowPlane);

    // ── FLOATING CLOUD / SPARKLE PARTICLES ──
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleScale = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 5.5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
      particleScale[i] = Math.random() * 0.08 + 0.03;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    // Particle sprite
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 28);
    pGrad.addColorStop(0, "rgba(255, 237, 213, 0.95)");
    pGrad.addColorStop(0.4, "rgba(234, 88, 12, 0.5)");
    pGrad.addColorStop(1, "rgba(234, 88, 12, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    sceneElementsRef.current.particles = particles;

    sceneElementsRef.current.scene = scene;
    sceneElementsRef.current.camera = camera;
    sceneElementsRef.current.renderer = renderer;
    sceneElementsRef.current.bearGroup = bearGroup;

    // 5. User Interaction Handlers (Mouse & Touch Orbit)
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

        // Clamp vertical angle
        sceneElementsRef.current.targetRotX = Math.max(-0.4, Math.min(0.55, sceneElementsRef.current.targetRotX));

        prevX = clientX;
        prevY = clientY;
      } else {
        // Soft head track towards mouse pointer
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

        if (headGroup) {
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, normX * 0.35, 0.05);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -normY * 0.25, 0.05);
        }
      }
    };

    const onPointerUp = () => {
      isPointerDown = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      sceneElementsRef.current.targetZoom += e.deltaY * 0.0035;
      sceneElementsRef.current.targetZoom = Math.max(4.5, Math.min(9.0, sceneElementsRef.current.targetZoom));
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // 6. Resize Observer
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

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera zoom
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, sceneElementsRef.current.targetZoom, 0.06);

      // Auto rotation if enabled
      if (isAutoRotating && !isPointerDown) {
        sceneElementsRef.current.targetRotY += 0.004;
      }

      // Smooth rotate bear
      bearGroup.rotation.y = THREE.MathUtils.lerp(bearGroup.rotation.y, sceneElementsRef.current.targetRotY, 0.08);
      bearGroup.rotation.x = THREE.MathUtils.lerp(bearGroup.rotation.x, sceneElementsRef.current.targetRotX, 0.08);

      // Gentle floating breathing animation
      const floatY = Math.sin(elapsedTime * 1.8) * 0.08;
      const bounceOffset = sceneElementsRef.current.bounceVal;
      sceneElementsRef.current.bounceVal = THREE.MathUtils.lerp(sceneElementsRef.current.bounceVal, 0, 0.08);

      bearGroup.position.y = -0.15 + floatY + bounceOffset;

      // Gentle torso breathing
      const breathScale = 1 + Math.sin(elapsedTime * 2.2) * 0.02;
      torsoMesh.scale.set(1.05 * breathScale, 1.2, 0.95 * breathScale);

      // Dynamic shadow scale & opacity
      shadowPlane.scale.set(1 - floatY * 0.8, 1 - floatY * 0.8, 1);

      // Heart pulse
      if (heartMesh && heartMesh.visible) {
        const heartPulse = 1 + Math.sin(elapsedTime * 5.0) * 0.18;
        heartMesh.scale.set(heartPulse, heartPulse, heartPulse);
      }

      // Gentle wave on right arm if Chapter 4 (Celebration)
      if (rightArm) {
        if (currentChapter === 3) {
          rightArm.rotation.z = -0.35 + Math.sin(elapsedTime * 6.0) * 0.45;
          rightArm.rotation.x = 0.5 + Math.cos(elapsedTime * 6.0) * 0.2;
        } else {
          rightArm.rotation.z = -0.35 + Math.sin(elapsedTime * 1.8) * 0.05;
          rightArm.rotation.x = 0.3;
        }
      }

      // Swirl floating particles
      if (particles) {
        particles.rotation.y = elapsedTime * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
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
  }, []); // Run on mount

  // Sync Color Theme
  useEffect(() => {
    const { materials } = sceneElementsRef.current;
    if (!materials || !materials.fur) return;

    const theme = PLUSH_THEMES[activeTheme];
    materials.fur.color.setHex(theme.furColor);
    materials.belly.color.setHex(theme.bellyColor);
    materials.innerEar.color.setHex(theme.innerEarColor);
    materials.scarf.color.setHex(theme.scarfColor);
  }, [activeTheme]);

  // Sync Chapter Effects on 3D Toy
  useEffect(() => {
    const { heartMesh, targetZoom, materials } = sceneElementsRef.current;
    if (!heartMesh) return;

    if (currentChapter === 0) {
      // Chapter 1: The Spark — Natural overview
      sceneElementsRef.current.targetZoom = 6.8;
      sceneElementsRef.current.targetRotX = 0.08;
      heartMesh.visible = false;
    } else if (currentChapter === 1) {
      // Chapter 2: The Stitches — Zoom in close to inspect seams
      sceneElementsRef.current.targetZoom = 5.2;
      sceneElementsRef.current.targetRotX = 0.18;
      heartMesh.visible = false;
    } else if (currentChapter === 2) {
      // Chapter 3: The Recycled Poly-Down Heart — Glow heart beats!
      sceneElementsRef.current.targetZoom = 5.6;
      sceneElementsRef.current.targetRotX = 0.1;
      heartMesh.visible = true;
    } else if (currentChapter === 3) {
      // Chapter 4: 10,000 Homes — Zoom out celebration wave!
      sceneElementsRef.current.targetZoom = 6.8;
      sceneElementsRef.current.targetRotX = 0.05;
      heartMesh.visible = true;
    }
  }, [currentChapter]);

  // Interactive Pat Reaction
  const handlePat = () => {
    setHeartPats((prev) => prev + 1);
    sceneElementsRef.current.bounceVal = 0.28;

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
    sceneElementsRef.current.targetZoom = 6.8;
  };

  return (
    <div className="fluffy-3d-stage-wrapper">
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="fluffy-3d-canvas-container"
        onClick={handlePat}
        title="Click & drag to rotate in 3D • Click to hug!"
      />

      {/* Floating Interactive Badge & Controls */}
      <div className="fluffy-3d-overlay-ui">
        {/* Top 3D Indicator */}
        <div className="toy-status-badge">
          <span className="live-dot" />
          <span className="toy-status-text">Interactive 3D Soft Companion</span>
          <span className="toy-3d-pill">Drag to Spin • 360°</span>
        </div>

        {/* Pat Message Toast */}
        {patMessage && (
          <div className="pat-toast-bubble animate-pop-bounce">
            <Heart size={16} className="heart-bounce" />
            <span>{patMessage}</span>
          </div>
        )}

        {/* Floating Quick Controls at Bottom */}
        <div className="fluffy-3d-bottom-controls">
          {/* Hug / Pat Button */}
          <button
            className="toy-action-btn pat-btn"
            onClick={handlePat}
            title="Hug the companion"
          >
            <Heart size={15} />
            <span>Hug Me {heartPats > 0 && `(${heartPats})`}</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            className={`toy-action-btn ${isAutoRotating ? "active" : ""}`}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title="Toggle 360° Auto-Orbit"
          >
            <RotateCw size={14} className={isAutoRotating ? "spin-slow" : ""} />
            <span>Orbit</span>
          </button>

          {/* Reset Camera */}
          <button
            className="toy-action-btn"
            onClick={handleResetView}
            title="Reset to front view"
          >
            <RefreshCw size={14} />
            <span>Front</span>
          </button>
        </div>

        {/* Plush Color Selector */}
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

