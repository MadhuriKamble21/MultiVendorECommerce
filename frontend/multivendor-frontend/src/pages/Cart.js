import { useEffect, useState } from "react";
import BASE_URL from "../api";
import Navbar from "../components/Navbar";
function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    }, []);

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const increaseQty = (id) => {
        const updated = cart.map(item =>
            item.productId === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        updateCart(updated);
    };

    const decreaseQty = (id) => {
        const updated = cart
            .map(item =>
                item.productId === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter(item => item.quantity > 0);

        updateCart(updated);
    };

    const removeItem = (id) => {
        const updated = cart.filter(item => item.productId !== id);
        updateCart(updated);
    };

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const placeOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const orderItems = cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));

            const response = await fetch(`${BASE_URL}/Order/place`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: orderItems,
                }),
            });

            if (!response.ok) throw new Error();

            setMessage("Order placed successfully");

            localStorage.removeItem("cart");
            setCart([]);
        } catch {
            setMessage("Order failed");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(""), 3000);
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

        layout: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
        },

        items: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
        },

        
        card: {
            background: "#fff",
            padding: "18px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            marginBottom: "14px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            alignItems: "center",
            gap: "20px",
        },

        name: {
            fontSize: "15px",
            fontWeight: "600",
        },

        price: {
            fontSize: "13px",
            color: "#6b7280",
        },

        qtyBox: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px",
            borderRadius: "8px",
        },

        total: {
            fontWeight: "600",
        },

        removeBtn: {
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
        },

        summary: {
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
        },

        summaryRow: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
        },

        checkoutBtn: {
            marginTop: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#4f46e5",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
        },

        toast: {
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#22c55e",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        },
    };

    return (
        <>
            <Navbar />
        <div style={styles.page}>
            <h2 style={styles.title}>Your Cart</h2>

            {message && <div style={styles.toast}>{message}</div>}

            {cart.length === 0 ? (
                <p style={{ padding: "20px" }}>No items in cart</p>
            ) : (
                <div style={styles.layout}>
                    {/* LEFT - ITEMS */}
                    <div style={styles.items}>
                        {cart.map((item) => (
                            <div key={item.productId} style={styles.card}>
                                <div>
                                    <h3 style={styles.name}>{item.name}</h3>
                                    <p style={styles.price}>₹{item.price}</p>
                                </div>

                                <div style={styles.qtyBox}>
                                    <button onClick={() => decreaseQty(item.productId)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQty(item.productId)}>+</button>
                                </div>

                                <div style={styles.total}>
                                    ₹{item.price * item.quantity}
                                </div>

                                <button
                                    style={styles.removeBtn}
                                    onClick={() => removeItem(item.productId)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT - SUMMARY */}
                    <div style={styles.summary}>
                        <h3>Order Summary</h3>

                        <div style={styles.summaryRow}>
                            <span>Total Items</span>
                            <span>{cart.length}</span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Total Amount</span>
                            <span>₹{totalAmount}</span>
                        </div>

                        <button
                            style={{
                                ...styles.checkoutBtn,
                                opacity: loading ? 0.7 : 1,
                            }}
                            onClick={placeOrder}
                            disabled={loading}
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}

export default Cart;
