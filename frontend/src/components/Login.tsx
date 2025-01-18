import React from "react";

const Login: React.FC = () => {
    return (
        <div className="Login-container">
            <form>
                <label htmlFor="player1">Player 1:</label>
                <input type="text" id="player1" name="player1"></input>
                <label htmlFor="player2">Player 2:</label>
                <input type="text" id="player2" name="player2"></input>
            </form>
        </div>
    );
};

export default Login;
