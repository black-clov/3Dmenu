import React from "react";

export default function AdminHeader({ title }) {
    return (
        <header style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "16px",
            fontSize: "20px",
            fontWeight: "bold"
        }}>
            {title || "Admin Panel"}
        </header>
    );
}
