import React, { useEffect } from 'react';
import { GameScene } from './components/game/GameScene';
import { useGameStore } from './store/gameStore';
import { generateTiles } from './game/logic/TileGenerator';
import { MultiplayerManager } from './game/multiplayer/MultiplayerManager';
import './App.css';

import { v4 as uuidv4 } from 'uuid';

function App() {
  const {
    setTiles,
    setPlayers,
    setDrawPile,
    gamePhase,
    setGamePhase,
    currentPlayerId,
    players,
    drawTile,
    endTurn,
    sortHand,
    winnerId,
  } = useGameStore();

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const winner = players.find(p => p.id === winnerId);

  useEffect(() => {
    // Initialize game with tiles and players when component mounts
    if (gamePhase === 'menu') {
      const allTiles = generateTiles();
      const tileIds = allTiles.map(t => t.id);

      // Create players
      const player1Id = uuidv4();
      const player2Id = uuidv4();
      const players = [
        { id: player1Id, name: 'Player 1', type: 'human', tiles: [], score: 0, isCurrent: true, isReady: true },
        { id: player2Id, name: 'Bot 1', type: 'bot', tiles: [], score: 0, isCurrent: false, isReady: true },
      ];

      // Deal tiles
      const TILES_PER_PLAYER = 14;
      players[0].tiles = tileIds.splice(0, TILES_PER_PLAYER);
      players[1].tiles = tileIds.splice(0, TILES_PER_PLAYER);

      setPlayers(players);
      setTiles(allTiles);
      setDrawPile(tileIds); // The rest of the tiles are the draw pile

      // Create some sample melds for testing
      const sampleMeldTiles1 = players[0].tiles.splice(0, 3);
      const sampleMeld1 = { id: uuidv4(), tiles: sampleMeldTiles1, type: 'run', isValid: true, position: [0,0,0] };

      const sampleMeldTiles2 = players[1].tiles.splice(0, 3);
      const sampleMeld2 = { id: uuidv4(), tiles: sampleMeldTiles2, type: 'set', isValid: true, position: [0,0,0] };

      useGameStore.getState().setMelds([sampleMeld1, sampleMeld2]);


      setGamePhase('playing');
    }
  }, [gamePhase, setTiles, setPlayers, setDrawPile, setGamePhase]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      <MultiplayerManager />
      <div className="relative w-full h-full">
        <GameScene />
        
        {/* UI Overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4 text-white">
            <h1 className="text-3xl font-bold mb-2">Kasket 3D</h1>
            <p className="text-sm opacity-75">Modern Rummikub Experience</p>
          </div>
          
          <div className="absolute top-4 right-4 text-white">
            <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Game Status</h3>
              <p className="text-sm">Phase: {gamePhase}</p>
              <p className="text-sm">Current Player: {currentPlayer?.name}</p>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-white flex space-x-4">
            <button
              onClick={drawTile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Draw Tile
            </button>
            <button
              onClick={sortHand}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Sort Hand
            </button>
            <button
              onClick={endTurn}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Pass Turn
            </button>
          </div>
        </div>

        {gamePhase === 'finished' && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white z-50">
            <h2 className="text-6xl font-bold mb-4 animate-pulse">Game Over</h2>
            <p className="text-3xl">Winner: {winner?.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
