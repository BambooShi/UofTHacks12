import React from "react";
import { NavigateFunction, useNavigate } from "react-router";

const Login: React.FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const getGamePage = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        const formElement: HTMLFormElement = event.currentTarget;
        const formData = new FormData(formElement);
        const path: string = "./play";
        const player1Name = formData.get("player1") as string;
        const player2Name = formData.get("player2") as string;
        navigate(path, { state: { player1Name, player2Name } });
    };

    return (
        <div className="Login-container">
            <form onSubmit={getGamePage}>
                <label htmlFor="player1">Player 1:</label>
                <input type="text" id="player1" name="player1" required></input>
                <label htmlFor="player2">Player 2:</label>
                <input type="text" id="player2" name="player2" required></input>
                <button type="submit">Locked In!</button>
            </form>
        </div>
    );
};

export default Login;
