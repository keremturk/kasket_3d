import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { connectSocket, disconnectSocket } from './socketService';

export const MultiplayerManager: React.FC = () => {
  const { gameMode } = useGameStore();

  useEffect(() => {
    if (gameMode === 'multiplayer') {
      console.log('Entering multiplayer mode, connecting socket...');
      connectSocket();

      return () => {
        console.log('Leaving multiplayer mode, disconnecting socket...');
        disconnectSocket();
      };
    }
  }, [gameMode]);

  return null; // This component does not render anything
};
