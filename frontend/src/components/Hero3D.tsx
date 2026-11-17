import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Inner 3D Verification Core Scene
function VerificationCoreScene({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const node1Ref = useRef<THREE.Mesh>(null);
  const node2Ref = useRef<THREE.Mesh>(null);
  const node3Ref = useRef<THREE.Mesh>(null);

  // Subtle mouse tracking with lerp
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);

    // Continuous elegant orbital rotation
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.25;
      ringRef1.current.rotation.x += delta * 0.15;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y += delta * 0.2;
      ringRef2.current.rotation.z -= delta * 0.1;
    }

    // Satellite nodes orbiting central verification core
    const time = state.clock.getElapsedTime();
    if (node1Ref.current) {
      node1Ref.current.position.x = Math.cos(time * 0.8) * 1.7;
      node1Ref.current.position.y = Math.sin(time * 0.8) * 0.8;
      node1Ref.current.position.z = Math.sin(time * 0.8) * 1.7;
    }
    if (node2Ref.current) {
      node2Ref.current.position.x = Math.cos(time * 0.7 + 2.1) * 1.9;
      node2Ref.current.position.y = Math.sin(time * 0.5 + 1.0) * 0.9;
      node2Ref.current.position.z = Math.sin(time * 0.7 + 2.1) * 1.9;
    }
    if (node3Ref.current) {
      node3Ref.current.position.x = Math.cos(time * 0.6 + 4.2) * 1.8;
      node3Ref.current.position.y = Math.cos(time * 0.6 + 2.0) * 0.7;
      node3Ref.current.position.z = Math.sin(time * 0.6 + 4.2) * 1.8;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Guarded Verification Core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere args={[0.9, 64, 64]}>
          <MeshDistortMaterial
            color={isHovered ? "#B39366" : "#C1A37A"}
            attach="material"
            distort={0.25}
            speed={1.5}
            roughness={0.2}
            metalness={0.7}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </Sphere>
      </Float>

      {/* Outer Verification Orbital Ring 1 */}
      <Torus ref={ringRef1} args={[1.5, 0.02, 16, 100]}>
        <meshStandardMaterial
          color="#171C24"
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.65}
        />
      </Torus>

      {/* Outer Verification Orbital Ring 2 */}
      <Torus ref={ringRef2} args={[1.65, 0.015, 16, 100]}>
        <meshStandardMaterial
          color="#C1A37A"
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.7}
        />
      </Torus>

      {/* Satellite Node 1: Approved Knowledge (Emerald Grounded) */}
      <Sphere ref={node1Ref} args={[0.14, 32, 32]}>
        <meshStandardMaterial
          color="#059669"
          emissive="#059669"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.5}
        />
      </Sphere>

      {/* Satellite Node 2: Guardrail Screening (Gold Calibration) */}
      <Sphere ref={node2Ref} args={[0.12, 32, 32]}>
        <meshStandardMaterial
          color="#D97706"
          emissive="#F59E0B"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.6}
        />
      </Sphere>

      {/* Satellite Node 3: Counselor Escalation (Graphite Safety) */}
      <Sphere ref={node3Ref} args={[0.11, 32, 32]}>
        <meshStandardMaterial
          color="#171C24"
          emissive="#374151"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.8}
        />
      </Sphere>
    </group>
  );
}

// Static Fallback for reduced motion, error, or low-power devices
function StaticVerificationFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Ambient Ring */}
        <div className="absolute inset-0 rounded-full border border-stone-300/80 animate-spin [animation-duration:24s]" />
        <div className="absolute inset-4 rounded-full border border-[#C1A37A]/40 animate-spin [animation-duration:16s] [animation-direction:reverse]" />
        {/* Core Sphere Graphic */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#171C24] via-[#C1A37A] to-[#E8DCB8] shadow-warm-lg flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#F8F7F4]/90 backdrop-blur-xs flex items-center justify-center">
            <svg className="w-8 h-8 text-[#171C24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5v14M7 8v8M22 10v4M2 11v2" />
            </svg>
          </div>
        </div>
        {/* Orbiting Satellite Dots */}
        <div className="absolute top-2 left-12 w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
        <div className="absolute bottom-6 right-10 w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm" />
        <div className="absolute top-1/2 right-2 w-3 h-3 rounded-full bg-stone-800 shadow-sm" />
      </div>
    </div>
  );
}

export const Hero3D: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Detect WebGL capability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Detect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefersReducedMotion(true);
    }
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return <StaticVerificationFallback />;
  }

  return (
    <div
      className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<StaticVerificationFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          {/* Refined Lighting: Ambient fill + warm directional key light */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 6, 4]} intensity={1.4} color="#FFF8F0" />
          <directionalLight position={[-4, -3, -2]} intensity={0.5} color="#DCE5DD" />
          <pointLight position={[0, 2, 2]} intensity={0.6} color="#C1A37A" />

          <VerificationCoreScene isHovered={isHovered} />
        </Canvas>
      </Suspense>

      {/* Subtle Caption Tag */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-[11px] text-stone-500 font-mono bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200 shadow-2xs pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C1A37A] animate-pulse" />
        <span>Interactive Verification Core · R3F</span>
      </div>
    </div>
  );
};
