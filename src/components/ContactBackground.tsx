import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const BackgroundElements = () => {
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef1.current) {
      meshRef1.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef1.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = state.clock.getElapsedTime() * -0.08;
      meshRef2.current.rotation.z = state.clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#c2a4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
      
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef1} position={[4, 2, -5]} scale={1.5}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#c2a4ff"
            speed={2}
            distort={0.3}
            radius={1}
            roughness={0}
            metalness={1}
          />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={0.8} floatIntensity={2}>
        <mesh ref={meshRef2} position={[-5, -2, -8]} scale={2}>
          <dodecahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#7c3aed"
            speed={1.5}
            distort={0.4}
            radius={1}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>
    </>
  );
};

const ContactBackground = () => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.6 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true }}>
        <BackgroundElements />
      </Canvas>
    </div>
  );
};

export default ContactBackground;
