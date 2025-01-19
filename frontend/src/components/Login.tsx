import React from "react";
import { NavigateFunction, useNavigate } from "react-router";

const Login: React.FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const getGamePage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement: HTMLFormElement = event.currentTarget;
        const formData = new FormData(formElement);
        const path: string = "/game";
        const player1Name = formData.get("player1") as string;
        const player2Name = formData.get("player2") as string;
        navigate(path, {
            state: { player1Name: player1Name, player2Name: player2Name },
        });
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full bg-gray-500">
            <form
                onSubmit={getGamePage}
                className="flex flex-col bg-white shadow-md rounded-lg p-6 space-y-8 w-full max-w-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
                <div className="flex flex-col justify-between items-center">
                    <div className="flex flex-col justify-center items-center">
                        <label
                            htmlFor="player1"
                            className="text-xl font-semibold text-black p-2"
                        >
                            Player 1
                        </label>
                        <input
                            type="text"
                            id="player1"
                            name="player1"
                            placeholder="Enter Name"
                            required
                            className="bg-white border border-gray-300 text-black text-center text-2xl rounded-lg p-3 focus: outlone-none focus: ring-1 focus: ring-blue-500"
                        ></input>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label
                            htmlFor="player2"
                            className="text-xl font-semibold text-black p-2"
                        >
                            Player 2
                        </label>
                        <input
                            type="text"
                            id="player2"
                            name="player2"
                            placeholder="Enter Name"
                            required
                            className="bg-white border border-gray-300 text-black text-center text-2xl rounded-lg p-3 focus: outlone-none focus: ring-1 focus: ring-blue-500"
                        ></input>
                    </div>
                </div>
                <button type="submit" className="text-xl">Locked In!</button>
            </form>
        </div>
    );
};

export default Login;
