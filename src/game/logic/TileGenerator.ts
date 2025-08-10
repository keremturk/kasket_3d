import type { Tile, TileColor } from '../../utils/types';

export const generateTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  const colors: TileColor[] = ['red', 'blue', 'black', 'yellow'];
  let tileId = 0;

  // Generate standard tiles (1-13 for each color, 2 copies each)
  colors.forEach(color => {
    for (let number = 1; number <= 13; number++) {
      // Two copies of each tile
      for (let copy = 0; copy < 2; copy++) {
        tiles.push({
          id: `tile-${tileId++}`,
          number,
          color,
          state: 'deck',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          isJoker: false,
        });
      }
    }
  });

  // Generate jokers (2 jokers)
  for (let i = 0; i < 2; i++) {
    tiles.push({
      id: `tile-${tileId++}`,
      number: 0, // Jokers don't have a number
      color: 'joker',
      state: 'deck',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      isJoker: true,
    });
  }

  // Shuffle the tiles
  return shuffleArray(tiles);
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to deal tiles to players
export const dealTiles = (tiles: Tile[], playerCount: number): {
  playerTiles: Tile[][],
  remainingTiles: Tile[]
} => {
  const tilesPerPlayer = 14;
  const totalTilesNeeded = playerCount * tilesPerPlayer;
  
  if (totalTilesNeeded > tiles.length) {
    throw new Error('Not enough tiles to deal to all players');
  }

  const playerTiles: Tile[][] = [];
  const remainingTiles = [...tiles];

  for (let i = 0; i < playerCount; i++) {
    const playerHand = remainingTiles.splice(0, tilesPerPlayer);
    playerTiles.push(playerHand);
  }

  return {
    playerTiles,
    remainingTiles,
  };
};

// Helper function to position tiles for players
export const positionPlayerTiles = (
  tiles: Tile[],
  playerIndex: number,
  totalPlayers: number
): Tile[] => {
  const angle = (playerIndex / totalPlayers) * Math.PI * 2;
  const radius = 8;
  
  return tiles.map((tile, index) => {
    const tileAngle = angle + (index - tiles.length / 2) * 0.2;
    const x = Math.cos(tileAngle) * radius;
    const z = Math.sin(tileAngle) * radius;
    
    return {
      ...tile,
      position: [x, 0.5, z],
      rotation: [0, -angle + Math.PI / 2, 0],
    };
  });
};

// Helper function to position deck tiles
export const positionDeckTiles = (tiles: Tile[]): Tile[] => {
  const stackSize = Math.min(tiles.length, 50);
  const positions: Tile[] = [];
  
  for (let i = 0; i < stackSize; i++) {
    const angle = (i / stackSize) * Math.PI * 2;
    const radius = 3 + (i % 3) * 0.1;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    positions.push({
      ...tiles[i],
      position: [x, 0.5 + (i * 0.01), z],
      rotation: [0, 0, 0],
    });
  }
  
  return positions;
};