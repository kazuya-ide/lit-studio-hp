"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

gsap.registerPlugin(ScrollTrigger);

export default function Hero3D_StoryScroll() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    // === カメラ ===
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    // === レンダラー ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // === 照明 ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    const keyLight = new THREE.PointLight(0x00aaff, 1.5, 100);
    keyLight.position.set(3, 3, 6);
    const fillLight = new THREE.PointLight(0xff00ff, 1.2, 100);
    fillLight.position.set(-3, -2, 5);
    scene.add(ambient, keyLight, fillLight);

    // === フォント ===
    const font = new FontLoader().parse(helvetiker);

    // === LIT STUDIO ジオメトリ ===
    const textGeo = new TextGeometry("LIT STUDIO", {
      font,
      size: 1.2,
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 12,
    });
    textGeo.center();

    // === 材質 ===
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#00ccff"),
      metalness: 1.0,
      roughness: 0.15,
      clearcoat: 1.0,
      transmission: 0.4,
      emissive: new THREE.Color("#2200ff"),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0,
    });

    // === メッシュ ===
    const logoMesh = new THREE.Mesh(textGeo, mat);
    scene.add(logoMesh);

    // === 星空 ===
    const starGeo = new THREE.BufferGeometry();
    const count = 4000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 150;
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x99ccff,
      size: 0.5,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // === ScrollTrigger ===
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mount,
        start: "top top",
        end: "+=20000",
        scrub: true,
        pin: true,
        pinSpacing: false,
      },
    });

    // ① 出現
    tl.to(mat, { opacity: 1, duration: 4, ease: "power2.out" })
      .to(
        logoMesh.scale,
        { x: 1, y: 1, z: 1, duration: 5, ease: "elastic.out(1, 0.4)" },
        "<"
      )

      // ② 発光強調
      .to(
        mat,
        {
          emissiveIntensity: 1.5,
          duration: 4,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        ">+2"
      )

      // ③ フェードアウト
      .to(
        mat,
        { opacity: 0, duration: 6, ease: "sine.inOut" },
        ">1.5"
      )
      // 星空もゆっくり動く
      .to(
        stars.rotation,
        { y: Math.PI * 2, duration: 15, ease: "power1.inOut" },
        "<"
      );

    // === 呼吸するような発光 ===
    gsap.to(mat, {
      emissiveIntensity: 1.1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // === レンダリングループ ===
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      stars.rotation.y += 0.00025;
      stars.position.z = Math.sin(t * 0.2) * 2;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // === リサイズ対応 ===
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={mountRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    />
  );
}
