import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state) {
            navigate("/");
        }
    }, [location.state, navigate]);

    if (location.state) {
        const player1Name: string = location.state.player1Name || "player1";
        const player2Name: string = location.state.player2Name || "player2";
        return (
            <div className="flex flex-col justify-center items-center w-full h-full bg-gray-500">
                <div className="bg-blue-700 w-10/12 min-h[220px]"></div>
                <div className="camera-container"></div>
                <div className="name-container">
                    <div>{player1Name}</div>
                    <div>{player2Name}</div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}
