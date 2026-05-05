import { useEffect, useState } from "react";
import BASE_URL from "../api";
import Navbar from "../components/Navbar";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${BASE_URL}/order/my-orders`, {
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

    
    const styles = {
        page: {
            padding: "24px",
            background: "#f8fafc",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
        },

        title: {
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "20px",
        },

        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
        },

        card: {
            background: "#fff",
            padding: "18px",
            borderRadius: "14px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "transform 0.2s",
        },

        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },

        orderId: {
            fontSize: "15px",
            fontWeight: "600",
        },

        status: {
            fontSize: "12px",
            background: "#dcfce7",
            color: "#16a34a",
            padding: "4px 8px",
            borderRadius: "6px",
            fontWeight: "500",
        },

        amount: {
            fontSize: "20px",
            fontWeight: "700",
            color: "#111827",
        },

        date: {
            fontSize: "13px",
            color: "#6b7280",
        },
    };

    return ( 
        <>
        <Navbar />
        <div style={styles.page}>
           
            <h2 style={styles.title}>My Orders</h2>

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                <div style={styles.grid}>
                    {orders.map((o) => (
                        <div key={o.orderId} style={styles.card}>
                            <div style={styles.header}>
                                <span style={styles.orderId}>
                                    Order #{o.orderId}
                                </span>

                                <span style={styles.status}>
                                    SUCCESS
                                </span>
                            </div>

                            <div style={styles.amount}>
                                ₹{o.totalAmount}
                            </div>

                            <div style={styles.date}>
                                {new Date(o.orderDate).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </>
    );
}

export default Orders;
