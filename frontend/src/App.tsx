import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.tsx";
import Game from "./components/Game.tsx";
import Webcam from "./components/Webcam.tsx";
import GInterface from "./components/GInterface.tsx";

function App() {
    return (
        <>
            <div className="h-screen w-screen">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/play" element={<Game />} />
                        <Route path="/video" element={<Webcam />} />
                    <Route path="/game" element={<GInterface />} />
                </Routes>
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;
