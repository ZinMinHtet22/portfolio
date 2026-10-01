"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Mesh } from "three";
import * as THREE from "three";

type Pointer = { x: number; y: number };

function SoftBlob({ pointer }: { pointer: React.RefObject<Pointer> }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !pointer.current) return;

    const targetX = pointer.current.y * 0.15;
    const targetY = pointer.current.x * 0.25;

    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      targetX,
      2,
      delta,
    );
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      targetY,
      2,
      delta,
    );

    meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <MeshDistortMaterial
          color="#BAE6FD"
          distort={0.25}
          speed={0.4}
          roughness={0.15}
          metalness={0.05}
        />
      </mesh>

      <mesh position={[2.1, 0.6, -0.5]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#F0F9FF" roughness={0.3} />
      </mesh>
      <mesh position={[-1.8, -0.9, 0.3]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#7DD3FC" roughness={0.4} />
      </mesh>
    </Float>
  );
}

function PointerTracker({ onMove }: { onMove: (x: number, y: number) => void }) {
  useFrame((state) => {
    onMove(state.pointer.x, state.pointer.y);
  });
  return null;
}

export default function HeroCanvas() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <PointerTracker
          onMove={(x, y) => {
            pointer.current.x = x;
            pointer.current.y = y;
          }}
        />

        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 4, 4]} intensity={0.6} color="#FFFFFF" />
        <directionalLight
          position={[-4, -2, -4]}
          intensity={0.3}
          color="#BAE6FD"
        />

        <SoftBlob pointer={pointer} />

        <Environment preset="city" environmentIntensity={0.3} />
      </Suspense>
    </Canvas>
  );
}
