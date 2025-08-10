// Game constants
export const TILE_COLORS = {
  RED: '#D9473F',
  BLUE: '#3E6AD6',
  BLACK: '#1C1C1C',
  YELLOW: '#D8A400',
} as const;

export const TILE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

export const TILE_COUNTS = {
  [TILE_COLORS.RED]: 2,
  [TILE_COLORS.BLUE]: 2,
  [TILE_COLORS.BLACK]: 2,
  [TILE_COLORS.YELLOW]: 2,
} as const;

export const JOKER_COUNT = 2;

// 3D Scene constants
export const TABLE_DIMENSIONS = {
  width: 12,
  height: 0.1,
  depth: 8,
} as const;

export const TILE_DIMENSIONS = {
  width: 0.8,
  height: 0.1,
  depth: 1.2,
} as const;

export const CAMERA_PRESETS = {
  TABLE: { position: [0, 8, 10], target: [0, 0, 0] },
  MY_RACK: { position: [0, 3, 6], target: [0, 0, 4] },
  OVERVIEW: { position: [0, 12, 0], target: [0, 0, 0] },
} as const;

// Game rules
export const GAME_RULES = {
  minRunLength: 3,
  minGroupLength: 3,
  allowWrapInRuns: false,
  allowDuplicatesInGroup: false,
  jokerPolicy: {
    maxJokersPerMeld: 2,
    allowAllJokersMeld: false,
  },
  initialOpenRequirement: {
    enabled: true,
    minPoints: 30,
  },
  handSize: 14,
  tileRange: { min: 1, max: 13 },
} as const;

// Performance settings
export const PERFORMANCE_SETTINGS = {
  maxFPS: 60,
  shadowMapSize: 2048,
  instancedMeshCount: 106,
  frustumCulling: true,
} as const;

// UI constants
export const UI_CONSTANTS = {
  tileSpacing: 0.1,
  rackWidth: 10,
  rackDepth: 1.5,
  snapDistance: 0.3,
} as const;