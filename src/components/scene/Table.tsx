import React, { useRef } from 'react';
import { useBox } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Table: React.FC = () => {
  const [ref] = useBox(() => ({
    mass: 0,
    position: [0, -0.5, 0],
    args: [20, 1, 20],
  }));

  // Create table material
  const tableMaterial = new THREE.MeshStandardMaterial({
    color: '#2d5016',
    roughness: 0.8,
    metalness: 0.1,
  });

  // Create felt texture for playing surface
  const feltMaterial = new THREE.MeshStandardMaterial({
    color: '#0f5132',
    roughness: 0.9,
    metalness: 0,
  });

  return (
    <group>
      {/* Table base */}
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[20, 1, 20]} />
        <primitive object={tableMaterial} />
      </mesh>
      
      {/* Table playing surface (felt) */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[19.8, 0.02, 19.8]} />
        <primitive object={feltMaterial} />
      </mesh>
      
      {/* Table legs */}
      {[[-9, -9], [9, -9], [-9, 9], [9, 9]].map(([x, z], index) => (
        <mesh key={index} position={[x, -5, z]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 9]} />
          <primitive object={tableMaterial} />
        </mesh>
      ))}
      
      {/* Decorative table edge */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[20.2, 0.2, 20.2]} />
        <meshStandardMaterial color="#1a3009" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  );
};