import { useEffect, useState } from "react";

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

            const response = await fetch("https://localhost:7107/api/Order/place", {
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

    // 🎨 Styles
    const container = {
        padding: "24px",
        background: "#f9fafb",
        minHeight: "100vh",
    };

    const card = {
        background: "white",
        padding: "16px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const qtyControls = {
        display: "flex",
        gap: "8px",
        alignItems: "center",
    };

    const button = {
        padding: "6px 10px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#2563eb",
        color: "white",
    };

    const dangerBtn = {
        ...button,
        background: "#dc2626",
    };

    return (
        <div style={container}>
            <h2 style={{ marginBottom: "20px" }}>Your Cart</h2>

            {message && <p style={{ marginBottom: "10px" }}>{message}</p>}

            {cart.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.productId} style={card}>
                            <div>
                                <h3>{item.name}</h3>
                                <p>₹{item.price}</p>
                            </div>

                            <div style={qtyControls}>
                                <button onClick={() => decreaseQty(item.productId)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increaseQty(item.productId)}>+</button>
                            </div>

                            <div>
                                ₹{item.price * item.quantity}
                            </div>

                            <button
                                style={dangerBtn}
                                onClick={() => removeItem(item.productId)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    {/* Total + Action */}
                    <div style={{ marginTop: "20px" }}>
                        <h3>Total: ₹{totalAmount}</h3>

                        <button
                            style={{ ...button, marginTop: "10px" }}
                            onClick={placeOrder}
                            disabled={loading}
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
