// src/components/Dashboard.jsx
import React, { useEffect } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useData } from "../Context/DataContext.jsx";

export default function Dashboard() {
    const { analytics } = useData();
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    // Prepare chart data safely
    const clicksData = Object.entries(analytics.pageClicks || {}).map(
        ([page, clicks]) => ({ page, clicks })
    );
    const sharesData = Object.entries(analytics.shares || {}).map(
        ([platform, value]) => ({ platform, value })
    );
    const salesTrend = analytics.salesTrend || []; // optional: fill from backend

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📊 Restaurant Analytics Dashboard
            </h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-gray-500">Total Visitors</h2>
                    <p className="text-2xl font-bold text-blue-600">
                        {clicksData.reduce((sum, d) => sum + d.clicks, 0)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-gray-500">Total Orders</h2>
                    <p className="text-2xl font-bold text-green-600">
                        {salesTrend.reduce((sum, d) => sum + (d.sales || 0), 0)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-gray-500">Avg. Order Value</h2>
                    <p className="text-2xl font-bold text-orange-500">
                        ${analytics.avgOrderValue || 18.5}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-gray-500">Top Item</h2>
                    <p className="text-2xl font-bold text-purple-500">
                        {analytics.topItem || "🍔 Burger"}
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Clicks by Page */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Clicks by Page</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={clicksData}>
                            <XAxis dataKey="page" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="clicks" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Shares by Platform */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Shares by Platform</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={sharesData}
                                dataKey="value"
                                nameKey="platform"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {sharesData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales Trend */}
                <div className="bg-white p-6 rounded-2xl shadow lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Weekly Sales Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesTrend}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#10B981"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
