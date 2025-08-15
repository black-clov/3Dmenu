import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
    return (
        <div className="w-64 bg-gray-800 text-white p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <Link to="/admin/dashboard" className="hover:bg-gray-700 px-2 py-1 rounded">Dashboard</Link>
            <Link to="/admin/analytics" className="hover:bg-gray-700 px-2 py-1 rounded">Analytics</Link>
            <Link to="/admin/data" className="hover:bg-gray-700 px-2 py-1 rounded">Data Management</Link>
        </div>
    );
}
