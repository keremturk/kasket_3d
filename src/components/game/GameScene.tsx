import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import { Table } from '../scene/Table';
import { TileSystem } from '../scene/TileSystem';
import { Lighting } from '../scene/Lighting';
import { CameraController } from '../scene/CameraController';

export const GameScene: React.FC = () => {
  const { settings } = useGameStore();
  
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{
          position: [0, 15, 20],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Lighting />
        <CameraController />
        <Table />
        <TileSystem />
        
        {settings.graphicsQuality === 'ultra' && <Stats />}
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
