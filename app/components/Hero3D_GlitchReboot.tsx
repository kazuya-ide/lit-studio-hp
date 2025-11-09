"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

gsap.registerPlugin(ScrollTrigger);

export default function Hero3D_GlitchReboot() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050505");

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // === 照明 ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    const pointLight = new THREE.PointLight(0x00ffff, 1.5, 20);
    pointLight.position.set(3, 3, 4);
    scene.add(ambient, pointLight);

    // === ロゴ ===
    const font = new FontLoader().parse(helvetiker);
    const textGeo = new TextGeometry("LIT STUDIO", {
      font,
      size: 0.9,
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 6,
    });
    textGeo.center();

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#00eaff"),
      metalness: 1,
      roughness: 0.15,
      emissive: new THREE.Color("#004466"),
      clearcoat: 1,
      transmission: 0.3,
      transparent: true,
      opacity: 1,
    });

    const logoMesh = new THREE.Mesh(textGeo, mat);
    scene.add(logoMesh);

    // === 背景ノイズパーティクル ===
    const noiseCount = 4000;
    const noiseGeo = new THREE.BufferGeometry();
    const noisePos = new Float32Array(noiseCount * 3);
    for (let i = 0; i < noiseCount * 3; i++) noisePos[i] = (Math.random() - 0.5) * 50;
    noiseGeo.setAttribute("position", new THREE.BufferAttribute(noisePos, 3));
    const noiseMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const noiseParticles = new THREE.Points(noiseGeo, noiseMat);
    scene.add(noiseParticles);

    // === グリッチ用シェーダー ===
    const glitchUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColorShift: { value: 0.0 },
    };

    const glitchMaterial = new THREE.ShaderMaterial({
      uniforms: glitchUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform float uColorShift;
        varying vec2 vUv;

        float random(vec2 st){
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main(){
          vec2 uv = vUv;
          float glitch = step(0.9, random(vec2(uTime * 0.1, uv.y))) * uIntensity;
          float offset = (random(vec2(uv.y, uTime)) - 0.5) * uColorShift;

          vec3 color = vec3(uv.x + offset, uv.y, 1.0 - uv.x);
          color += vec3(glitch, glitch * 0.5, 0.0);
          gl_FragColor = vec4(color, 1.0 - glitch * 0.4);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const glitchPlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), glitchMaterial);
    glitchPlane.position.z = -5;
    scene.add(glitchPlane);

    // === GSAPアニメーション ===
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    tl.to(glitchUniforms.uIntensity, { value: 1, duration: 0.3, ease: "power1.inOut" })
      .to(glitchUniforms.uIntensity, { value: 0, duration: 1.5 })
      .to(glitchUniforms.uColorShift, { value: 0.3, duration: 1.2, yoyo: true, repeat: 1 })
      .to(mat.emissive, { r: 0.2, g: 0.6, b: 1.0, duration: 2 });

    gsap.to(logoMesh.rotation, {
      y: Math.PI * 2,
      duration: 18,
      repeat: -1,
      ease: "none",
    });

    // === スクロールで崩壊 ===
    ScrollTrigger.create({
      trigger: mount,
      start: "top top",
      end: "+=1500",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        mat.opacity = 1 - p;
        glitchUniforms.uIntensity.value = p * 1.2;
        camera.position.z = 7 + p * 5;
      },
    });

    // === レンダリング ===
    const clock = new THREE.Clock();
    const animate = () => {
      glitchUniforms.uTime.value = clock.getElapsedTime();
      noiseParticles.rotation.y += 0.0004;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
  window.removeEventListener("resize", handleResize);
  if (mount && renderer.domElement.parentElement === mount) {
    mount.removeChild(renderer.domElement);
  }
  renderer.dispose();
};
  }, []);

  return (
    <section
      ref={mountRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      <div className="absolute text-center pointer-events-none">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-widest bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]">
          LIT STUDIO
        </h1>
        <p className="mt-3 text-gray-400 text-lg">System rebooting…</p>
      </div>
    </section>
  );
}
