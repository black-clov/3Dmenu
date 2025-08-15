import React from 'react';
import './ui.css';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="ui-modal-overlay" onClick={onClose}>
            <div className="ui-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ui-modal-header">
                    <h3>{title}</h3>
                    <button className="ui-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="ui-modal-content">{children}</div>
            </div>
        </div>
    );
}
