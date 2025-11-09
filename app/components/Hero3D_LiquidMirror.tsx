"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

gsap.registerPlugin(ScrollTrigger);

export default function Hero3D_LiquidMirror() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    // === カメラ ===
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 6);

    // === レンダラー ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // === 環境光 ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(3, 5, 4);
    scene.add(pointLight);

    // === シェーダーマテリアル ===
    const uniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#c0aaff") },
      uDisplacementScale: { value: 0.4 },
    };

    const vertexShader = `
      uniform float uTime;
      uniform float uDisplacementScale;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.z += sin(pos.x * 3.0 + uTime) * 0.1;
        pos.z += cos(pos.y * 4.0 + uTime * 1.5) * 0.1;
        pos.z *= uDisplacementScale;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform vec3 uColor;
      void main() {
        float alpha = 1.0 - smoothstep(0.4, 0.9, length(vUv - 0.5));
        vec3 color = uColor * (1.0 - length(vUv - 0.5));
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 256, 256), material);
    plane.rotation.x = -Math.PI / 2 + 0.2;
    scene.add(plane);

    // === テキスト ===
    const font = new FontLoader().parse(helvetiker);
    const textGeo = new TextGeometry("LIT", {
      font,
      size: 1.2,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 8,
    });
    const textMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      metalness: 1,
      roughness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 1.0,
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(-1.8, 0.2, 0);
    scene.add(textMesh);

    // === カメラコントロール ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 10;

    // === GSAPアニメーション ===
    gsap.to(uniforms.uDisplacementScale, {
      value: 0.6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(pointLight.color, {
      r: 1,
      g: 0.3,
      b: 0.8,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // === Scroll連動 ===
    ScrollTrigger.create({
      trigger: mount,
      start: "top top",
      end: "+=1500",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        uniforms.uColor.value.lerp(new THREE.Color("#000000"), p);
        textMat.opacity = 1 - p * 1.2;
        textMesh.position.y = 0.2 - p * 2;
        camera.position.y = 1.5 + p * 2;
      },
    });

    // === レンダリングループ ===
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      controls.update();
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
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={mountRef}
      className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute text-center pointer-events-none">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          LIT STUDIO
        </h1>
        <p className="text-gray-400 mt-4 text-lg">Touch the surface of imagination</p>
      </div>
    </section>
  );
}
