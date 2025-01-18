import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.tsx";
import Game from "./components/Game.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/play" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
