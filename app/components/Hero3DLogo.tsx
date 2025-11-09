"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

gsap.registerPlugin(ScrollTrigger);

export default function Hero3DLogo() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    // === 背景と霧 ===
    scene.background = new THREE.Color("#000000");
    scene.fog = new THREE.Fog("#000000", 5, 18);

    // === カメラ ===
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7);

    // === レンダラー ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // === コントロール無効 ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

    // === ライト ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const pointLight = new THREE.PointLight(0xff66cc, 2, 50);
    pointLight.position.set(3, 2, 5);
    scene.add(pointLight);

    // === LITロゴ ===
    const font = new FontLoader().parse(helvetiker);
    const textGeometry = new TextGeometry("LIT", {
      font,
      size: 1.6,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelSegments: 8,
    });
    const textMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ff3d7f"),
      metalness: 0.9,
      roughness: 0.25,
      clearcoat: 1.0,
      emissive: new THREE.Color("#300018"),
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0,
    });
    const logoMesh = new THREE.Mesh(textGeometry, textMaterial);
    logoMesh.position.set(-2.5, -0.5, 0);
    scene.add(logoMesh);

    // === パーティクル ===
    const particleGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 60;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x88aaff,
      size: 0.08,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // === Bloom ===
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2, // intensityを上げて発光強め
      0.8,
      0.9
    );
    composer.addPass(bloomPass);

    // === 出現アニメーション ===
    gsap.to(logoMesh.material, {
      opacity: 1,
      duration: 2,
      ease: "power3.out",
    });
    gsap.fromTo(
      logoMesh.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 2.2, ease: "back.out(1.7)" }
    );

    // === ScrollTrigger ===
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mount,
        start: "top top",
        end: "+=1500",
        scrub: true,
        pin: true,
      },
    });

    // ロゴが溶けるように消える
    tl.to(logoMesh.material, {
      opacity: 0,
      duration: 3,
      ease: "power2.inOut",
    });
    // フォグを濃くして“光が溶け込む”
    tl.to(scene.fog, { near: 2, far: 8, duration: 3, ease: "sine.inOut" }, "<");
    // 背景色をグラデーション的に変化
    tl.to(
      scene.background,
      { r: 0.05, g: 0.1, b: 0.2, duration: 3, ease: "power2.inOut" },
      "<"
    );

    // === 背景ライトに動き ===
    gsap.to(pointLight.position, {
      x: -3,
      y: 4,
      z: 2,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // === ループ ===
    const animate = () => {
      logoMesh.rotation.y += 0.002;
      particles.rotation.y += 0.0005;
      composer.render();
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <section
        ref={mountRef}
        className="relative h-screen flex flex-col justify-center items-center bg-black"
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            LIT STUDIO
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Scroll to begin your journey
          </p>
        </div>
      </section>

      <section
        id="about"
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a15] to-[#12121d] text-center px-8"
      >
        <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
          About
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
          LIT STUDIOは「光と動き」をテーマに、モーションデザインとテクノロジーで魅せるWeb体験を生み出します。<br />
          スクロールと共に変化する世界で、あなたのブランドが“感じられる”存在へ。
        </p>
      </section>
    </>
  );
}
