import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
        } else {
            fetchProducts();
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://multivendorecommerce-fw8x.onrender.com/api/product/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401 || response.status === 403) {
                navigate("/");
                return;
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data.data) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item.productId === product.productId);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        setMessage("Added to cart");
        setTimeout(() => setMessage(""), 2000);
    };

    // 🎨 Styles (clean + reusable)
    const container = {
        padding: "24px",
        background: "#f9fafb",
        minHeight: "100vh",
    };

    const header = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    };

    const buttonGroup = {
        display: "flex",
        gap: "10px",
    };

    const button = {
        padding: "8px 14px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#2563eb",
        color: "white",
        fontSize: "14px",
    };

    const grid = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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

    const price = {
        color: "#6b7280",
        fontSize: "14px",
    };

    return (
        <div style={container}>
            {/* Header */}
            <div style={header}>
                <h2 style={{ fontSize: "22px", fontWeight: "600" }}>Products</h2>

                <div style={buttonGroup}>
                    <button style={button} onClick={() => navigate("/cart")}>
                        Cart
                    </button>
                    <button style={button} onClick={() => navigate("/orders")}>
                        Orders
                    </button>
                    <button style={button} onClick={() => navigate("/admin")}>
                        Admin
                    </button>
                </div>
            </div>

            {/* Feedback message */}
            {message && (
                <div style={{ marginBottom: "10px", color: "green" }}>
                    {message}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <p>Loading products...</p>
            ) : products.length === 0 ? (
                <p>No products available</p>
            ) : (
                <div style={grid}>
                    {products.map((p) => (
                        <div key={p.productId || p.id} style={card}>
                            <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                                {p.name}
                            </h3>

                            <p style={price}>₹{p.price}</p>

                            <button
                                style={button}
                                onClick={() => addToCart(p)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;
