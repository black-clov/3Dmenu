import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Opening() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/Scan");
    };

    return (
        <div className="opening-container">
            <img src="/navindoora_logo.png" alt="App Logo" className="logo-img" />
            <button className="start-btn" onClick={handleStart}>
                Commencer la Navigation
            </button>
        </div>
    );
}
