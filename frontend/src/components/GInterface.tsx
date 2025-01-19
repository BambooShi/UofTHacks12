import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameEngine } from './gamelogic.ts';
import player1Img from '../assets/player1.png';
import player2Img from '../assets/player2.png';

const GInterface: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const gameEngineRef = useRef<GameEngine | null>(null);

    useEffect(() => {
        if (!location.state) {
            navigate('/');
            return;
        }

        localStorage.setItem("motionData", JSON.stringify({ player1: "idle" }));
        
        // Test device support
        GameEngine.testSupport([{ client: "Chrome" }]);

        // Initialize game engine
        gameEngineRef.current = new GameEngine(player1Img, player2Img);
        
        const container = document.querySelector(".game-play-container");
        if (container && !container.contains(GameEngine.canvas)) {
            container.appendChild(GameEngine.canvas);
        }

        // Start the game
        gameEngineRef.current.start();

        // Cleanup
        return () => {
            if (gameEngineRef.current) {
                gameEngineRef.current.stop();
            }
            if (container && container.contains(GameEngine.canvas)) {
                container.removeChild(GameEngine.canvas);
            }
        };
    }, [location.state, navigate]);

    return (
        <div className="game-container">
            <div className="game-play-container" />
        </div>
    );
};

export default GInterface;