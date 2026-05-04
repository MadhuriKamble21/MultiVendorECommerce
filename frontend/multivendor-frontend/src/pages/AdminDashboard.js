import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
        } else {
            fetchDashboard();
        }
    }, [navigate]);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://multivendorecommerce-fw8x.onrender.com/api/order/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 403) {
                setError("Access denied (Admin only)");
                return;
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error(error);
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    // 🎨 Styles
    const container = {
        padding: "24px",
        background: "#f9fafb",
        minHeight: "100vh",
    };

    const grid = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "20px",
    };

    const card = {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    };

    const label = {
        fontSize: "14px",
        color: "#6b7280",
    };

    const value = {
        fontSize: "26px",
        fontWeight: "700",
    };

    return (
        <div style={container}>
            <h2 style={{ fontSize: "22px", fontWeight: "600" }}>
                Admin Dashboard
            </h2>

            {/* Error */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Loading */}
            {loading ? (
                <p>Loading dashboard...</p>
            ) : data && (
                <div style={grid}>
                    <div style={card}>
                        <span style={label}>Total Orders</span>
                        <span style={value}>{data.totalOrders}</span>
                    </div>

                    <div style={card}>
                        <span style={label}>Total Sales</span>
                        <span style={value}>
                            ₹{data.totalSales.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
