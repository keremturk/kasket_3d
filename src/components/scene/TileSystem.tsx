import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore';
import { Tile } from './Tile';
import * as THREE from 'three';

export const TileSystem: React.FC = () => {
  const { tiles } = useGameStore();
  
  // Group tiles by position for efficient rendering
  const tileGroups = useMemo(() => {
    const groups: { [key: string]: typeof tiles } = {};
    
    tiles.forEach(tile => {
      const key = `${tile.state}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(tile);
    });
    
    return groups;
  }, [tiles]);

  return (
    <group>
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
        />
      ))}
    </group>
  );
};