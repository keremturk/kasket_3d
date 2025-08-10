import React from 'react';
import { useHelper } from '@react-three/drei';
import * as THREE from 'three';

export const Lighting: React.FC = () => {
  const directionalRef = React.useRef<THREE.DirectionalLight>(null);
  
  // Optional: Show light helper for debugging
  // useHelper(directionalRef, THREE.DirectionalLightHelper, 1, 'yellow');

  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Main directional light (sun-like) */}
      <directionalLight
        ref={directionalRef}
        position={[10, 20, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.1}
      />
      
      {/* Fill light to reduce harsh shadows */}
      <directionalLight
        position={[-10, 15, -10]}
        intensity={0.3}
        color="#b3d9ff"
      />
      
      {/* Rim light for better depth perception */}
      <directionalLight
        position={[0, 5, -15]}
        intensity={0.2}
        color="#ffffff"
      />
      
      {/* Point light for table center focus */}
      <pointLight
        position={[0, 8, 0]}
        intensity={0.5}
        color="#ffffff"
        distance={15}
        decay={2}
      />
    </>
  );
};