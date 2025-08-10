import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GameState, Player, Tile, GameMode, GamePhase, Settings } from '../utils/types';

interface GameStore extends GameState {
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  setCurrentPlayer: (playerId: string) => void;
  setPlayers: (players: Player[]) => void;
  setTiles: (tiles: Tile[]) => void;
  setSelectedTiles: (tiles: Tile[]) => void;
  setGameMode: (mode: GameMode) => void;
  setSettings: (settings: Partial<Settings>) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updateTile: (tileId: string, updates: Partial<Tile>) => void;
  setHoveredTile: (tileId: string | null) => void;
  setDraggingTile: (tileId: string | null) => void;
  setCameraPosition: (position: [number, number, number]) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  gamePhase: 'menu',
  gameMode: 'single',
  currentPlayerId: null,
  players: [],
  tiles: [],
  selectedTiles: [],
  hoveredTileId: null,
  draggingTileId: null,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    colorBlindMode: false,
    language: 'en',
    graphicsQuality: 'high',
    showTutorial: true,
  },
  camera: {
    position: [0, 15, 20],
    target: [0, 0, 0],
  },
  gameStats: {
    moves: 0,
    timeElapsed: 0,
    hintsUsed: 0,
  },
};

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setGamePhase: (phase) => set({ gamePhase: phase }),
        
        setCurrentPlayer: (playerId) => set({ currentPlayerId: playerId }),
        
        setPlayers: (players) => set({ players }),
        
        setTiles: (tiles) => set({ tiles }),
        
        setSelectedTiles: (selectedTiles) => set({ selectedTiles }),
        
        setGameMode: (mode) => set({ gameMode: mode }),
        
        setSettings: (settings) => set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
        
        addPlayer: (player) => set((state) => ({
          players: [...state.players, player],
        })),
        
        removePlayer: (playerId) => set((state) => ({
          players: state.players.filter((p) => p.id !== playerId),
        })),
        
        updateTile: (tileId, updates) => set((state) => ({
          tiles: state.tiles.map((tile) =>
            tile.id === tileId ? { ...tile, ...updates } : tile
          ),
        })),
        
        setHoveredTile: (tileId) => set({ hoveredTileId: tileId }),
        
        setDraggingTile: (tileId) => set({ draggingTileId: tileId }),
        
        setCameraPosition: (position) => set((state) => ({
          camera: { ...state.camera, position },
        })),
        
        setCameraTarget: (target) => set((state) => ({
          camera: { ...state.camera, target },
        })),
        
        resetGame: () => set(initialState),
      }),
      {
        name: 'kasket-3d-storage',
        partialize: (state) => ({
          settings: state.settings,
          gameMode: state.gameMode,
        }),
      }
    )
  )
);