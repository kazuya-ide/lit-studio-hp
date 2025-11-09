"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

gsap.registerPlugin(ScrollTrigger);

export default function Hero3D_ParticleBirth() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // === ライト ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(3, 3, 3);
    scene.add(light);

    // === テキスト形状を作成して、その頂点を粒子のターゲットにする ===
    const font = new FontLoader().parse(helvetiker);
    const textGeo = new TextGeometry("LIT", {
      font,
      size: 2,
      depth: 0.1,
      curveSegments: 8,
    });
    textGeo.center();

    const positions = textGeo.attributes.position.array;
    const particleCount = positions.length / 3;

    const geometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      targetPositions[i] = positions[i];
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xff66cc,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // === アニメーションシーケンス ===
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    tl.to(particlePositions, {
      duration: 3,
      onUpdate: () => {
        for (let i = 0; i < particleCount * 3; i++) {
          const current = particlePositions[i];
          const target = targetPositions[i];
          particlePositions[i] += (target - current) * 0.07;
        }
        geometry.attributes.position.needsUpdate = true;
      },
      ease: "power2.out",
    })
      .to(material, {
        size: 0.07,
        opacity: 1,
        duration: 1.5,
        ease: "power1.inOut",
      })
      .to(material, {
        size: 0.02,
        opacity: 0,
        duration: 2.5,
        ease: "sine.inOut",
        onComplete: () => {
          for (let i = 0; i < particleCount * 3; i++) {
            particlePositions[i] = (Math.random() - 0.5) * 20;
          }
        },
      });

    // === スクロール連動（フェードアウト＋下に遷移） ===
    ScrollTrigger.create({
      trigger: mount,
      start: "top top",
      end: "+=1200",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        camera.position.z = 8 + p * 4;
        material.opacity = 0.8 - p * 0.8;
      },
    });

    // === レンダリング ===
    const animate = () => {
      particles.rotation.y += 0.001;
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
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={mountRef}
      className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute text-center pointer-events-none">
        <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          LIT STUDIO
        </h1>
        <p className="mt-4 text-gray-400 text-lg">Particles become creation.</p>
      </div>
    </section>
  );
}
