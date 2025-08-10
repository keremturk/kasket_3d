import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore';
import * as THREE from 'three';

export const CameraController: React.FC = () => {
  const { camera: cameraState } = useGameStore();
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(...cameraState.position));
  const targetLookAt = useRef(new THREE.Vector3(...cameraState.target));

  useEffect(() => {
    targetPosition.current.set(...cameraState.position);
    targetLookAt.current.set(...cameraState.target);
  }, [cameraState]);

  useFrame(() => {
    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.05);
    
    // Smooth look at target
    const lookAtPosition = new THREE.Vector3();
    lookAtPosition.copy(targetLookAt.current);
    
    camera.lookAt(lookAtPosition);
  });

  return null;
};