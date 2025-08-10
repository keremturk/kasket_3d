import React, { useEffect } from 'react';
import { GameScene } from './components/game/GameScene';
import { useGameStore } from './store/gameStore';
import { generateTiles } from './game/logic/TileGenerator';
import './App.css';

function App() {
  const { setTiles, gamePhase, setGamePhase } = useGameStore();

  useEffect(() => {
    // Initialize game with tiles when component mounts
    if (gamePhase === 'menu') {
      const tiles = generateTiles();
      setTiles(tiles);
      setGamePhase('setup');
    }
  }, [gamePhase, setTiles, setGamePhase]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
