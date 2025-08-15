// src/admin/ui/AdminLayout.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="p-4 bg-gray-50 flex-1">{children}</main>
            </div>
        </div>
    );
}
