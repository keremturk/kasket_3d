import type { Tile, TileColor } from '../../utils/types';

const getTileData = (tileId: string, allTiles: Tile[]): Tile | undefined => {
  return allTiles.find(t => t.id === tileId);
};

export const isValidRun = (tileIds: string[], allTiles: Tile[]): boolean => {
  if (tileIds.length < 3) return false;

  const tiles = tileIds.map(id => getTileData(id, allTiles)).filter(t => t) as Tile[];
  if (tiles.length !== tileIds.length) return false; // Some tile IDs were not found

  const firstTileColor = tiles[0].color;
  if (tiles.some(t => t.color !== firstTileColor)) return false; // All tiles must be same color

  const sortedTiles = [...tiles].sort((a, b) => a.number - b.number);

  for (let i = 0; i < sortedTiles.length - 1; i++) {
    if (sortedTiles[i + 1].number !== sortedTiles[i].number + 1) {
      return false; // Numbers must be consecutive
    }
  }

  return true;
};

export const isValidGroup = (tileIds: string[], allTiles: Tile[]): boolean => {
  if (tileIds.length < 3 || tileIds.length > 4) return false;

  const tiles = tileIds.map(id => getTileData(id, allTiles)).filter(t => t) as Tile[];
  if (tiles.length !== tileIds.length) return false;

  const firstTileNumber = tiles[0].number;
  if (tiles.some(t => t.number !== firstTileNumber)) return false; // All tiles must have same number

  const colors = new Set<TileColor>();
  for (const tile of tiles) {
    if (colors.has(tile.color)) return false; // All colors must be unique
    colors.add(tile.color);
  }

  return true;
};

export const isValidMeld = (tileIds: string[], allTiles: Tile[]): boolean => {
  return isValidRun(tileIds, allTiles) || isValidGroup(tileIds, allTiles);
};
