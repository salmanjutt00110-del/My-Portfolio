import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

const Shapes = () => {
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#8a2be2" />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color="#00d2ff" />
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={torusRef} position={[2, 0, -2]} scale={1.2}>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <MeshWobbleMaterial factor={0.4} speed={2} color="#4b0082" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={sphereRef} position={[-2.5, -1, -3]} scale={1.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial distort={0.4} speed={2} color="#00ced1" roughness={0.2} metalness={0.9} />
        </mesh>
      </Float>
    </>
  );
};

const FloatingShapes = () => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <Shapes />
      </Canvas>
    </div>
  );
};

export default FloatingShapes;
