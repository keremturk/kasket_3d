import React, { useRef, useMemo } from 'react';
import { useBox } from '@react-three/cannon';
import { useGameStore } from '../../store/gameStore';
import type { Tile as TileType } from '../../utils/types';
import * as THREE from 'three';

interface TileProps {
  tile: TileType;
}

export const Tile: React.FC<TileProps> = ({ tile }) => {
  const { 
    setHoveredTile, 
    setDraggingTile, 
    selectedTiles, 
    updateTile 
  } = useGameStore();
  
  const isSelected = selectedTiles.includes(tile.id);
  const isHovered = useGameStore(state => state.hoveredTileId === tile.id);
  
  // Physics body for the tile
  const [ref, api] = useBox(() => ({
    mass: 0.1,
    position: tile.position,
    args: [1.5, 0.2, 2],
  }));

  // Create tile material based on color
  const tileMaterial = useMemo(() => {
    const colorMap: Record<string, string> = {
      red: '#dc2626',
      blue: '#2563eb',
      black: '#1f2937',
      yellow: '#eab308',
      joker: '#7c3aed',
    };
    
    return new THREE.MeshStandardMaterial({
      color: colorMap[tile.color] || '#6b7280',
      roughness: 0.3,
      metalness: 0.1,
      emissive: isSelected ? '#fbbf24' : '#000000',
      emissiveIntensity: isSelected ? 0.3 : 0,
    });
  }, [tile.color, isSelected]);

  // Create number texture
  const numberTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;
    
    // White background
    context.fillStyle = 'white';
    context.fillRect(0, 0, 256, 256);
    
    // Number
    context.fillStyle = 'black';
    context.font = 'bold 120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(tile.number.toString(), 128, 128);
    
    return new THREE.CanvasTexture(canvas);
  }, [tile.number]);

  const handlePointerOver = () => {
    setHoveredTile(tile.id);
  };

  const handlePointerOut = () => {
    setHoveredTile(null);
  };

  const handlePointerDown = () => {
    setDraggingTile(tile.id);
  };

  const handlePointerUp = () => {
    setDraggingTile(null);
  };

  const handleClick = () => {
    // We only allow selecting tiles that are in a player's hand for now
    if (tile.state === 'hand') {
      useGameStore.getState().toggleTileSelection(tile.id);
    }
  }

  return (
    <group>
      {/* Main tile body */}
      <mesh
        ref={ref}
        position={tile.position}
        rotation={tile.rotation}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
      >
        <boxGeometry args={[1.5, 0.2, 2]} />
        <primitive object={tileMaterial} />
      </mesh>
      
      {/* Tile face with number */}
      <mesh
        position={[tile.position[0], tile.position[1] + 0.11, tile.position[2]]}
        rotation={tile.rotation}
      >
        <planeGeometry args={[1.3, 1.8]} />
        <meshStandardMaterial
          map={numberTexture}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Hover highlight */}
      {isHovered && (
        <mesh
          position={[tile.position[0], tile.position[1] + 0.15, tile.position[2]]}
          rotation={tile.rotation}
        >
          <boxGeometry args={[1.6, 0.01, 2.1]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};