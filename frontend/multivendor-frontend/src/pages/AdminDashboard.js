import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import Navbar from "../components/Navbar";
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

            const response = await fetch(`${BASE_URL}/order/dashboard`, {
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

    const styles = {
        page: {
            padding: "24px",
            background: "#f8fafc",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
        },

        title: {
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "20px",
        },

        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
        },

        card: {
            background: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
        },

        cardHeader: {
            fontSize: "14px",
            color: "#6b7280",
            fontWeight: "500",
        },

        cardValue: {
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
        },

        error: {
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
        },
    };

    return (
        <>
           <Navbar />
        <div style={styles.page}>
            <h2 style={styles.title}>Admin Dashboard</h2>

            {error && <div style={styles.error}>{error}</div>}

            {loading ? (
                <p>Loading dashboard...</p>
            ) : data && (
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>📦 Total Orders</div>
                        <div style={styles.cardValue}>
                            {data.totalOrders}
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardHeader}>💰 Total Sales</div>
                        <div style={styles.cardValue}>
                            ₹{data.totalSales.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}

export default AdminDashboard;
