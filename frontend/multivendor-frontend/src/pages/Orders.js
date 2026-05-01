import { useEffect, useState } from "react";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://localhost:7107/api/order/my-orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    
    const container = {
        padding: "24px",
        background: "#f9fafb",
        minHeight: "100vh",
    };

    const grid = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
    };

    const card = {
        background: "white",
        padding: "16px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    };

    const orderId = {
        fontSize: "16px",
        fontWeight: "600",
    };

    const amount = {
        fontSize: "18px",
        fontWeight: "700",
        color: "#16a34a",
    };

    const dateStyle = {
        fontSize: "13px",
        color: "#6b7280",
    };

    return (
        <div style={container}>
            <h2 style={{ marginBottom: "20px" }}>My Orders</h2>

            {/* Loading */}
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                <div style={grid}>
                    {orders.map((o) => (
                        <div key={o.orderId} style={card}>
                            <div style={orderId}>Order #{o.orderId}</div>

                            <div style={amount}>
                                ₹{o.totalAmount}
                            </div>

                            <div style={dateStyle}>
                                {new Date(o.orderDate).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
