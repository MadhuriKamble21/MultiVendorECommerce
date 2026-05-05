import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import Navbar from "../components/Navbar";

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

            const response = await fetch(`${BASE_URL}/product/all`, {
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

        const existing = cart.find(
            (item) => item.productId === product.productId
        );

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // ✅ Force toast re-trigger
        setMessage("");
        setTimeout(() => {
            setMessage("Added to cart");
        }, 10);

        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    return (
        <>
            <Navbar />
            {message && (
                <div style={styles.toast}>
                    ✅ {message}
                </div>
            )}

            <div style={styles.page}>
                <div style={styles.container}>
                    <h3 style={styles.heading}>Explore Products</h3>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length === 0 ? (
                        <p>No products available</p>
                    ) : (
                        <div style={styles.grid}>
                            {products.map((p) => (
                                <div
                                    key={p.productId || p.id}
                                    style={styles.card}
                                >
                                    <div style={styles.cardBody}>
                                        <h4 style={styles.productName}>
                                            {p.name}
                                        </h4>

                                        <p style={styles.description}>
                                            {p.description ||
                                                "No description available"}
                                        </p>

                                        <p style={styles.price}>
                                            ₹{p.price}
                                        </p>
                                    </div>

                                    <button
                                        style={styles.addBtn}
                                        onClick={() => addToCart(p)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const styles = {
    page: {
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
    },

    container: {
        padding: "24px",
    },

    heading: {
        marginBottom: "20px",
        fontSize: "18px",
        fontWeight: "600",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px",
    },

    card: {
        background: "#ffffff",
        borderRadius: "14px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    },

    cardBody: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    productName: {
        fontSize: "16px",
        fontWeight: "600",
    },

    description: {
        fontSize: "13px",
        color: "#6b7280",
    },

    price: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#111827",
    },

    addBtn: {
        marginTop: "12px",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#4f46e5",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
    },
    toast: {
        position: "fixed",
        top: "80px", 
        left: "50%",
        transform: "translateX(-50%)",
        background: "#22c55e",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        zIndex: 9999,
        minWidth: "220px",
        textAlign: "center",
    }
};

export default Products;