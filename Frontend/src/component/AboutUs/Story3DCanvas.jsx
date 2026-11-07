import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { PLUSH_THEMES } from "./Fluffy3DViewer";

const KEYFRAMES = [
  // 0: Hero
  {
    posX: 0,
    posY: -0.15,
    posZ: 0,
    rotX: 0.08,
    rotY: 0,
    rotZ: 0,
    zoom: 6.8,
    heartVisible: false,
    armLift: 0,
    waveArm: false,
  },
  // 1: CloudFluff Texture (Shift Right, close-up on velvet muzzle & ears)
  {
    posX: 1.45,
    posY: 0.05,
    posZ: 0,
    rotX: 0.14,
    rotY: -0.72,
    rotZ: 0.02,
    zoom: 5.2,
    heartVisible: false,
    armLift: 0,
    waveArm: false,
  },
  // 2: Double-Lock Seams (Shift Left, profile angle to show side seams & stitch strength)
  {
    posX: -1.45,
    posY: -0.12,
    posZ: 0,
    rotX: -0.08,
    rotY: 1.25,
    rotZ: -0.04,
    zoom: 5.0,
    heartVisible: false,
    armLift: 0,
    waveArm: false,
  },
  // 3: 100% Recycled Poly-Down Heart (Shift Right, facing front, glowing heart beats inside chest)
  {
    posX: 1.35,
    posY: -0.15,
    posZ: 0,
    rotX: 0.06,
    rotY: 0.0,
    rotZ: 0,
    zoom: 5.5,
    heartVisible: true,
    armLift: 0.2,
    waveArm: false,
  },
  // 4: Ergonomic Hug Calibration (Centered, arms lifted up for a hug)
  {
    posX: 0,
    posY: -0.1,
    posZ: 0,
    rotX: 0.22,
    rotY: 0.35,
    rotZ: 0,
    zoom: 6.0,
    heartVisible: true,
    armLift: 0.55,
    waveArm: false,
  },
  // 5: Interactive Customizer (Centered, full 360 drag unlocked)
  {
    posX: 0,
    posY: -0.15,
    posZ: 0,
    rotX: 0.08,
    rotY: 0,
    rotZ: 0,
    zoom: 6.8,
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
      posY: -0.15,
      posZ: 0,
      rotX: 0.08,
      rotY: 0,
      rotZ: 0,
      zoom: 6.8,
      armLift: 0,
      heartPulse: 0,
    },
    scrollProgress: 0,
    activeTheme: "honey",
    isCustomizerActive: false,
    userDragRot: { x: 0, y: 0 },
    bounceVal: 0,
  });

  // Keep stateRef up to date with incoming props
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.activeTheme = activeTheme;
    stateRef.current.isCustomizerActive = isCustomizerActive;
    stateRef.current.userDragRot = userDragRot;
    stateRef.current.bounceVal = bounceVal;
  }, [scrollProgress, activeTheme, isCustomizerActive, userDragRot, bounceVal]);

  // Update Three.js materials when activeTheme changes
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

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.3);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfef3c7, 1.2);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 2.6);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.7);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 3. Materials
    const theme = PLUSH_THEMES[activeTheme] || PLUSH_THEMES.honey;

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

    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

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
      emissiveIntensity: 0.55,
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

    // 4. Construct 3D Bear Model
    const bearGroup = new THREE.Group();
    bearGroup.position.y = -0.15;
    scene.add(bearGroup);

    // Torso
    const torsoGeo = new THREE.SphereGeometry(1.05, 32, 32);
    torsoGeo.scale(1.05, 1.2, 0.95);
    const torsoMesh = new THREE.Mesh(torsoGeo, furMaterial);
    torsoMesh.position.set(0, -0.3, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    bearGroup.add(torsoMesh);
    stateRef.current.torsoMesh = torsoMesh;

    // Belly patch
    const bellyGeo = new THREE.SphereGeometry(0.72, 28, 28);
    bellyGeo.scale(0.85, 1.05, 0.35);
    const bellyMesh = new THREE.Mesh(bellyGeo, bellyMaterial);
    bellyMesh.position.set(0, -0.35, 0.72);
    bearGroup.add(bellyMesh);

    // Glowing Heart
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
    heartMesh.rotation.z = Math.PI;
    heartMesh.visible = false;
    bearGroup.add(heartMesh);
    stateRef.current.heartMesh = heartMesh;

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.05, 0);
    bearGroup.add(headGroup);
    stateRef.current.headGroup = headGroup;

    const headGeo = new THREE.SphereGeometry(0.88, 32, 32);
    headGeo.scale(1.12, 1.0, 1.02);
    const headMesh = new THREE.Mesh(headGeo, furMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Muzzle / Snout
    const snoutGeo = new THREE.SphereGeometry(0.42, 24, 24);
    snoutGeo.scale(1.15, 0.85, 0.9);
    const snoutMesh = new THREE.Mesh(snoutGeo, bellyMaterial);
    snoutMesh.position.set(0, -0.12, 0.75);
    headGroup.add(snoutMesh);

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.12, 18, 18);
    noseGeo.scale(1.3, 0.85, 0.7);
    const noseMesh = new THREE.Mesh(noseGeo, noseMaterial);
    noseMesh.position.set(0, 0.02, 1.12);
    headGroup.add(noseMesh);

    // Eyes
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

    // Ears
    const createEar = (isRight) => {
      const earG = new THREE.Group();
      earG.position.set(isRight ? 0.76 : -0.76, 0.68, 0.05);
      earG.rotation.z = isRight ? -0.25 : 0.25;

      const outer = new THREE.Mesh(new THREE.SphereGeometry(0.34, 22, 22), furMaterial);
      outer.scale.set(1.0, 1.0, 0.45);
      earG.add(outer);

      const inner = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 18), innerEarMaterial);
      inner.scale.set(0.9, 0.9, 0.25);
      inner.position.set(0, 0, 0.12);
      earG.add(inner);
      return earG;
    };
    headGroup.add(createEar(false));
    headGroup.add(createEar(true));

    // Scarf
    const scarfGeo = new THREE.TorusGeometry(0.72, 0.16, 16, 32);
    scarfGeo.scale(1.0, 0.9, 0.85);
    const scarfMesh = new THREE.Mesh(scarfGeo, scarfMaterial);
    scarfMesh.rotation.x = Math.PI / 2;
    scarfMesh.position.set(0, 0.32, 0);
    bearGroup.add(scarfMesh);

    const scarfTailGeo = new THREE.BoxGeometry(0.24, 0.55, 0.08);
    const scarfTail = new THREE.Mesh(scarfTailGeo, scarfMaterial);
    scarfTail.position.set(0.3, 0.05, 0.76);
    scarfTail.rotation.z = -0.2;
    bearGroup.add(scarfTail);

    // Arms
    const createArm = (isRight) => {
      const armG = new THREE.Group();
      armG.position.set(isRight ? 0.96 : -0.96, 0.05, 0.15);
      armG.rotation.z = isRight ? -0.35 : 0.35;
      armG.rotation.x = 0.3;

      const armGeo = new THREE.SphereGeometry(0.34, 22, 22);
      armGeo.scale(0.8, 1.35, 0.8);
      const arm = new THREE.Mesh(armGeo, furMaterial);
      arm.position.set(0, -0.3, 0);
      arm.castShadow = true;
      armG.add(arm);

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
    stateRef.current.leftArm = leftArm;
    stateRef.current.rightArm = rightArm;

    // Legs
    const createLeg = (isRight) => {
      const legG = new THREE.Group();
      legG.position.set(isRight ? 0.65 : -0.65, -1.05, 0.45);
      legG.rotation.x = -0.55;
      legG.rotation.y = isRight ? -0.2 : 0.2;

      const legGeo = new THREE.SphereGeometry(0.42, 22, 22);
      legGeo.scale(0.9, 1.25, 0.9);
      const leg = new THREE.Mesh(legGeo, furMaterial);
      leg.position.set(0, -0.25, 0);
      leg.castShadow = true;
      legG.add(leg);

      const footPadGeo = new THREE.SphereGeometry(0.28, 18, 18);
      footPadGeo.scale(1.0, 1.15, 0.3);
      const footPad = new THREE.Mesh(footPadGeo, bellyMaterial);
      footPad.position.set(0, -0.45, 0.35);
      legG.add(footPad);
      return legG;
    };
    bearGroup.add(createLeg(false));
    bearGroup.add(createLeg(true));

    // Tail
    const tailGeo = new THREE.SphereGeometry(0.24, 18, 18);
    const tailMesh = new THREE.Mesh(tailGeo, furMaterial);
    tailMesh.position.set(0, -0.9, -0.85);
    bearGroup.add(tailMesh);

    // Floor Shadow Plane
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
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.95;
    scene.add(shadowPlane);
    stateRef.current.shadowPlane = shadowPlane;

    // Floating Fluff Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 6.0;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 28);
    pGrad.addColorStop(0, "rgba(255, 237, 213, 0.95)");
    pGrad.addColorStop(0.4, "rgba(234, 88, 12, 0.45)");
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

    // 6. Animation Loop with Smooth Interpolation
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

      // Calculate Target State based on Scroll Progress (0 to 1)
      const numSegments = KEYFRAMES.length - 1;
      const scaledProgress = Math.max(0, Math.min(1, sp)) * numSegments;
      const segmentIndex = Math.min(Math.floor(scaledProgress), numSegments - 1);
      const segmentT = scaledProgress - segmentIndex;

      const kfA = KEYFRAMES[segmentIndex];
      const kfB = KEYFRAMES[segmentIndex + 1];

      // Smooth cubic ease for segment transition
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

      // If user is in the interactive Customizer section, apply user drag offsets!
      if (isCustomizer) {
        targetRotY += userDragRot.y;
        targetRotX += userDragRot.x;
      }

      // Responsive adjustments for mobile viewports
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        targetX *= 0.35; // keep centered on mobile
        targetZoom += 1.8; // pull back slightly to fit small screen
      }

      // Lerp current transforms towards target (silky physics smoothing)
      current.posX = THREE.MathUtils.lerp(current.posX, targetX, 0.08);
      current.posY = THREE.MathUtils.lerp(current.posY, targetY, 0.08);
      current.posZ = THREE.MathUtils.lerp(current.posZ, targetZ, 0.08);

      current.rotX = THREE.MathUtils.lerp(current.rotX, targetRotX, 0.08);
      current.rotY = THREE.MathUtils.lerp(current.rotY, targetRotY, 0.08);
      current.rotZ = THREE.MathUtils.lerp(current.rotZ, targetRotZ, 0.08);

      current.zoom = THREE.MathUtils.lerp(current.zoom, targetZoom, 0.08);
      current.armLift = THREE.MathUtils.lerp(current.armLift, targetArmLift, 0.08);

      // Apply Idle Breathing & Float
      const floatY = Math.sin(elapsedTime * 1.8) * 0.08;
      bearGroup.position.set(current.posX, current.posY + floatY + bVal, current.posZ);
      bearGroup.rotation.set(current.rotX, current.rotY, current.rotZ);

      // Camera distance
      camera.position.z = current.zoom;

      // Torso breathing
      const breath = 1 + Math.sin(elapsedTime * 2.2) * 0.02;
      torsoMesh.scale.set(1.05 * breath, 1.2, 0.95 * breath);

      // Floor Shadow
      if (shadowPlane) {
        shadowPlane.position.x = current.posX;
        shadowPlane.position.z = current.posZ;
        shadowPlane.scale.set(1 - floatY * 0.8, 1 - floatY * 0.8, 1);
      }

      // Arm positions (lifting up for hug or idle)
      if (leftArm && rightArm) {
        leftArm.rotation.x = 0.3 + current.armLift * 0.6;
        if (kfB.waveArm && isCustomizer) {
          rightArm.rotation.z = -0.35 + Math.sin(elapsedTime * 5.0) * 0.35;
          rightArm.rotation.x = 0.5 + Math.cos(elapsedTime * 5.0) * 0.15;
        } else {
          rightArm.rotation.x = 0.3 + current.armLift * 0.6;
          rightArm.rotation.z = -0.35;
        }
      }

      // Heart pulsing
      if (heartMesh) {
        heartMesh.visible = targetHeart;
        if (targetHeart) {
          const pulse = 1 + Math.sin(elapsedTime * 5.5) * 0.22;
          heartMesh.scale.set(pulse, pulse, pulse);
        }
      }

      // Particles gentle drift
      if (particles) {
        particles.rotation.y = elapsedTime * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []); // Run on mount

  return (
    <div
      ref={mountRef}
      className="story-3d-fullscreen-canvas"
      onClick={onModelClick}
    />
  );
};

export default Story3DCanvas;

