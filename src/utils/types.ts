// Game Types
export type GamePhase = 'menu' | 'setup' | 'playing' | 'finished';
export type GameMode = 'single' | 'multiplayer' | 'tutorial';
export type TileColor = 'red' | 'blue' | 'black' | 'yellow' | 'joker';
export type TileState = 'deck' | 'hand' | 'board' | 'selected' | 'discarded';
export type PlayerType = 'human' | 'bot';
export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';

// Core Game Objects
export interface Tile {
  id: string;
  number: number;
  color: TileColor;
  state: TileState;
  position: [number, number, number];
  rotation: [number, number, number];
  ownerId?: string;
  isJoker: boolean;
  meshId?: number;
}

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  tiles: string[]; // tile IDs
  score: number;
  isCurrent: boolean;
  isReady: boolean;
  avatar?: string;
}

export interface GameState {
  gamePhase: GamePhase;
  gameMode: GameMode;
  currentPlayerId: string | null;
  winnerId: string | null;
  players: Player[];
  tiles: Tile[]; // Master list of all tiles
  drawPile: string[]; // Tile IDs
  melds: Meld[]; // Sets on the table
  selectedTiles: string[]; // tile IDs
  hoveredTileId: string | null;
  draggingTileId: string | null;
  settings: Settings;
  camera: CameraState;
  gameStats: GameStats;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  colorBlindMode: boolean;
  language: 'tr' | 'en';
  graphicsQuality: GraphicsQuality;
  showTutorial: boolean;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
}

export interface GameStats {
  moves: number;
  timeElapsed: number;
  hintsUsed: number;
}

// 3D Scene Types
export interface SceneConfig {
  ambientLight: {
    intensity: number;
    color: string;
  };
  directionalLight: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
  table: {
    size: [number, number, number];
    position: [number, number, number];
    color: string;
  };
}

// Game Logic Types
export interface Meld {
  id: string;
  tiles: string[]; // tile IDs
  type: 'set' | 'run';
  isValid: boolean;
  position: [number, number, number];
}

export interface GameRules {
  minPlayers: number;
  maxPlayers: number;
  tilesPerPlayer: number;
  jokerCount: number;
  minMeldSize: number;
  allowRearrangement: boolean;
  timeLimit: number | null;
}

// Network Types
export interface NetworkMessage {
  type: string;
  payload: any;
  timestamp: number;
  playerId: string;
}

export interface MultiplayerState {
  isConnected: boolean;
  roomId: string | null;
  players: Player[];
  isHost: boolean;
}

// UI Types
export interface UIState {
  showMenu: boolean;
  showSettings: boolean;
  showTutorial: boolean;
  showPause: boolean;
  showGameOver: boolean;
  activeModal: string | null;
}

// Animation Types
export interface AnimationState {
  isAnimating: boolean;
  animationQueue: AnimationAction[];
}

export interface AnimationAction {
  type: 'move' | 'rotate' | 'scale' | 'fade';
  targetId: string;
  duration: number;
  easing: string;
  from: any;
  to: any;
}

// Performance Types
export interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  memory: number;
}

// Accessibility Types
export interface AccessibilityOptions {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderEnabled: boolean;
  keyboardNavigation: boolean;
  colorBlindType: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

// Sound Types
export interface SoundConfig {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  muted: boolean;
}

// Input Types
export interface InputState {
  mouse: {
    position: [number, number];
    isDown: boolean;
    raycaster: any;
  };
  keyboard: {
    keys: Set<string>;
    modifiers: {
      shift: boolean;
      ctrl: boolean;
      alt: boolean;
    };
  };
  touch: {
    touches: Touch[];
    gesture: string | null;
  };
}

// Debug Types
export interface DebugOptions {
  showStats: boolean;
  showGrid: boolean;
  showWireframe: boolean;
  showColliders: boolean;
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
}