// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";      // Floor0 page
import Floor1 from "./Floor1"; // Simple Floor1 page
import Floor2 from "./Floor2";
import Floor from "./Floor";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/floor0" />} />
            <Route path="/floor0" element={<App />} />
            <Route path="/floor1" element={<Floor1 />} />
            <Route path="/floor2" element={<Floor2 />} />
            <Route path="/floor" element={<Floor />} />
            {/* Add further routes for floor-1, floor2, etc. */}
        </Routes>
    </BrowserRouter>
);
