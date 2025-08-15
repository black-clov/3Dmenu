import React from 'react';
import './ui.css';

export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
    return (
        <button
            className={`ui-button ui-button-${variant}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
