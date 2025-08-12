import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Tile } from './Tile';
import * as THREE from 'three';

interface PlayerHandProps {
  playerId: string;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({ playerId }) => {
  const { players, tiles } = useGameStore();
  const player = players.find(p => p.id === playerId);
  const playerTiles = tiles.filter(t => player?.tiles.includes(t.id));

  // Simple layout logic: arrange tiles in a row
  const TILE_WIDTH = 1.7; // A bit more than the tile's actual width
  const handWidth = playerTiles.length * TILE_WIDTH;
  const startX = -handWidth / 2;

  return (
    <group position={[0, 1, 15]}> // Position the hand at the bottom of the view
      {playerTiles.map((tile, index) => {
        const tilePosition: [number, number, number] = [
          startX + index * TILE_WIDTH,
          0,
          0
        ];

        // Create a new tile object with the calculated position and state
        const positionedTile = {
          ...tile,
          position: tilePosition,
          state: 'hand' as const,
        };

        return <Tile key={tile.id} tile={positionedTile} />;
      })}
    </group>
  );
};
