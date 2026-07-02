'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function OrbScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#4444ff" intensity={2} />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          {/* Outer Glass Shell */}
          <mesh>
            <sphereGeometry args={[1.5, 64, 64]} />
            <MeshTransmissionMaterial 
              backside
              backsideThickness={5}
              thickness={2}
              chromaticAberration={0.4}
              transmission={1}
              clearcoat={1}
              clearcoatRoughness={0}
              roughness={0.1}
              ior={1.5}
              color="#0a0a0a"
            />
          </mesh>

          {/* Inner Glowing Core */}
          <Core />

          {/* Orbiting Rings */}
          <Rings />
        </Float>
      </Canvas>
    </div>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <MeshDistortMaterial 
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.5}
        distort={0.4}
        speed={2}
        roughness={0.2}
      />
    </mesh>
  );
}

function Rings() {
  const ref1 = useRef<THREE.Group>(null);
  const ref2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref1.current && ref2.current) {
      ref1.current.rotation.x = state.clock.elapsedTime * 0.5;
      ref1.current.rotation.y = state.clock.elapsedTime * 0.2;
      ref2.current.rotation.x = state.clock.elapsedTime * 0.3;
      ref2.current.rotation.z = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <>
      <group ref={ref1}>
        <mesh>
          <torusGeometry args={[2, 0.01, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      </group>
      <group ref={ref2} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.2, 0.01, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      </group>
    </>
  );
}