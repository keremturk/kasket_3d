import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../../store/gameStore';
import type { Player, Tile, Meld } from '../../utils/types';

const SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-server.com'
  : 'http://localhost:3001';

let socket: Socket | null = null;

interface GameStateUpdatePayload {
  players: Player[];
  melds: Meld[];
  drawPile: string[];
  currentPlayerId: string;
}

export const connectSocket = () => {
  if (socket) return;

  socket = io(SERVER_URL, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from server:', reason);
  });

  socket.on('gameStateUpdate', (payload: GameStateUpdatePayload) => {
    console.log('Received gameStateUpdate');
    useGameStore.getState().setPlayers(payload.players);
    useGameStore.getState().setMelds(payload.melds);
    useGameStore.getState().setDrawPile(payload.drawPile);
    useGameStore.getState().setCurrentPlayer(payload.currentPlayerId);
  });

  socket.on('playerJoined', (player: Player) => {
    console.log('Player joined:', player.name);
    useGameStore.getState().addPlayer(player);
  });

  socket.on('playerLeft', (playerId: string) => {
    console.log('Player left:', playerId);
    useGameStore.getState().removePlayer(playerId);
  });

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket not connected. Call connectSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// --- Emitters ---
// These functions will be called by the UI/game logic to send events to the server.

export const emitJoinRoom = (roomId: string, playerName: string) => {
  getSocket().emit('joinRoom', { roomId, playerName });
};

export const emitPlayerAction = (action: { type: string; payload?: any }) => {
  getSocket().emit('playerAction', action);
};
