"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

gsap.registerPlugin(ScrollTrigger);

export default function Hero3D_CyberPulse() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000010");

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // === 床グリッド（ネオン）===
    const gridHelper = new THREE.GridHelper(100, 60, 0x00ffff, 0x00ffff);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // === ネオンボックス群 ===
    const boxGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0066ff, metalness: 0.8, roughness: 0.2 });
    for (let i = 0; i < 80; i++) {
      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set((Math.random() - 0.5) * 50, 1, (Math.random() - 0.5) * 50);
      mesh.scale.y = 0.5 + Math.random() * 5;
      scene.add(mesh);
    }

    // === 照明 ===
    scene.add(new THREE.AmbientLight(0x00ffff, 0.4));
    const pulseLight = new THREE.PointLight(0x00ffff, 2, 30);
    pulseLight.position.set(0, 10, 0);
    scene.add(pulseLight);

    // === Pulseアニメ ===
    gsap.to(pulseLight, {
      intensity: 3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // === Scrollで都市が沈む ===
    gsap.to(camera.position, {
      y: -5,
      scrollTrigger: {
        trigger: mount,
        start: "top top",
        end: "+=1500",
        scrub: true,
      },
    });

    const animate = () => {
      gridHelper.rotation.y += 0.001;
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

  return <div ref={mountRef} className="w-full h-screen" />;
}
