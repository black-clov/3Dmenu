import React from 'react';
import './ui.css';

export default function Input({ label, value, onChange, type = 'text', placeholder }) {
    return (
        <div className="ui-input-group">
            {label && <label className="ui-label">{label}</label>}
            <input
                className="ui-input"
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
