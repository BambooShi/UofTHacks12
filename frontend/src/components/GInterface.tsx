import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startGame, canvas } from "../js/gaming.mjs";

const motionData = {
    player1: "jump",
};

// Convert the object to a string and store it in localStorage
localStorage.setItem("motionData", JSON.stringify(motionData));

export default function GInterface() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if location state exists before starting the game
        if (!location.state) {
            navigate("/"); // Navigate to home if state is not found
            return;
        }

        // Append the canvas to the container if it isn't already present
        const container = document.querySelector(".game-play-container");
        if (container && !container.contains(canvas)) {
            container.appendChild(canvas);
        }

        // Start the game
        console.log("Game started");
        startGame();

        // Cleanup: Remove the canvas on component unmount
        return () => {
            if (container && container.contains(canvas)) {
                container.removeChild(canvas);
            }
        };
    }, [location.state, navigate]); // Dependency array

    return (
        <div className="game-container">
            <div className="game-play-container"></div>
        </div>
    );
}

export { GInterface };