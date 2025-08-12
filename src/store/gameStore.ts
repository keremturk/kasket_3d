import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GameState, Player, Tile, GameMode, GamePhase, Settings, Meld } from '../utils/types';
import { emitPlayerAction } from '../game/multiplayer/socketService';

interface GameStore extends GameState {
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  setCurrentPlayer: (playerId: string) => void;
  setPlayers: (players: Player[]) => void;
  setTiles: (tiles: Tile[]) => void;
  setDrawPile: (drawPile: string[]) => void;
  setMelds: (melds: Meld[]) => void;
  setSelectedTiles: (tiles: string[]) => void;
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

  // Game Logic Actions
  endTurn: () => void;
  drawTile: () => void;
  toggleTileSelection: (tileId: string) => void;
  sortHand: () => void;
}

const initialState: GameState = {
  gamePhase: 'menu',
  gameMode: 'single',
  currentPlayerId: null,
  winnerId: null,
  players: [],
  tiles: [],
  drawPile: [],
  melds: [],
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

        setDrawPile: (drawPile) => set({ drawPile }),

        setMelds: (melds) => set({ melds }),
        
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

        // Game Logic Actions
        endTurn: () => {
          const { gameMode, currentPlayerId, players } = useGameStore.getState();
          if (gameMode === 'multiplayer') {
            emitPlayerAction({ type: 'PASS_TURN' });
          } else {
            // Single-player logic
            set((state) => {
              if (!state.currentPlayerId) return {};

              const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
              if (currentPlayer && currentPlayer.tiles.length === 0) {
                return { gamePhase: 'finished', winnerId: currentPlayer.id };
              }

              const currentPlayerIndex = state.players.findIndex(p => p.id === state.currentPlayerId);
              const nextPlayerIndex = (currentPlayerIndex + 1) % state.players.length;
              return { currentPlayerId: state.players[nextPlayerIndex].id };
            })
          }
        },

        drawTile: () => {
          const { gameMode } = useGameStore.getState();
          if (gameMode === 'multiplayer') {
            emitPlayerAction({ type: 'DRAW_TILE' });
          } else {
            // Single-player logic
            const { currentPlayerId, drawPile, players } = useGameStore.getState();
            if (!currentPlayerId || drawPile.length === 0) return;

            const tileToDraw = drawPile[0];
            const newDrawPile = drawPile.slice(1);

            const updatedPlayers = players.map(p => {
              if (p.id === currentPlayerId) {
                return { ...p, tiles: [...p.tiles, tileToDraw] };
              }
              return p;
            });

            set({ players: updatedPlayers, drawPile: newDrawPile });
            useGameStore.getState().endTurn();
          }
        },

        toggleTileSelection: (tileId) => set((state) => {
          const selectedTiles = state.selectedTiles.includes(tileId)
            ? state.selectedTiles.filter(id => id !== tileId)
            : [...state.selectedTiles, tileId];
          return { selectedTiles };
        }),

        sortHand: () => set((state) => {
          if (!state.currentPlayerId) return {};
          const player = state.players.find(p => p.id === state.currentPlayerId);
          if (!player) return {};

          const handTiles = player.tiles.map(tid => state.tiles.find(t => t.id === tid)).filter(Boolean) as Tile[];

          handTiles.sort((a, b) => {
            if (a.number < b.number) return -1;
            if (a.number > b.number) return 1;
            if (a.color < b.color) return -1;
            if (a.color > b.color) return 1;
            return 0;
          });

          const sortedTileIds = handTiles.map(t => t.id);
          const updatedPlayers = state.players.map(p =>
            p.id === state.currentPlayerId ? { ...p, tiles: sortedTileIds } : p
          );

          return { players: updatedPlayers };
        }),
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