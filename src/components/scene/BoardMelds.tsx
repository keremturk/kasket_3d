import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Tile } from './Tile';
import * as THREE from 'three';
import type { Meld } from '../../utils/types';

export const BoardMelds: React.FC = () => {
  const { melds, tiles } = useGameStore();

  const getTileData = (tileId: string) => tiles.find(t => t.id === tileId);

  // Simple layout for melds on the board
  const MELD_SPACING_Z = 3;
  const TILE_SPACING_X = 1.7;

  return (
    <group position={[0, 0.2, 0]}>
      {melds.map((meld, meldIndex) => {
        const meldWidth = meld.tiles.length * TILE_SPACING_X;
        const startX = -meldWidth / 2;

        return (
          <group key={meld.id} position={[0, 0, meldIndex * MELD_SPACING_Z]}>
            {meld.tiles.map((tileId, tileIndex) => {
              const tile = getTileData(tileId);
              if (!tile) return null;

              const tilePosition: [number, number, number] = [
                startX + tileIndex * TILE_SPACING_X,
                0,
                0
              ];

              const positionedTile = {
                ...tile,
                position: tilePosition,
              };

              return <Tile key={tile.id} tile={positionedTile} />;
            })}
          </group>
        );
      })}
    </group>
  );
};
