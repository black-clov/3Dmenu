import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Opening from "./opening"; // NEW
import Scan from "./Scan";       // NEW
import App from "./App";
import Floor1 from "./Floor1";
import Floor2 from "./Floor2";
import Floor from "./Floor";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Opening />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/floor0" element={<App />} />
            <Route path="/floor1" element={<Floor1 />} />
            <Route path="/floor2" element={<Floor2 />} />
            <Route path="/floor" element={<Floor />} />
        </Routes>
    </BrowserRouter>
);
