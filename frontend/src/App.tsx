import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.tsx";
import Game from "./components/Game.tsx";
import Webcam from "./components/Webcam.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/play" element={<Game />} />
                    <Route path="/video" element={<Webcam />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
