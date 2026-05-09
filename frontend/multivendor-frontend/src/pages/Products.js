import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import Navbar from "../components/Navbar";
import { useCallback } from "react";
import { ClipLoader } from "react-spinners";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 10;

   
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${BASE_URL}/product/all?page=${page}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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

    useEffect(() => {
        fetchProducts();
    }, [page]);

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
                        <div style={styles.loaderContainer}>
                            <ClipLoader size={50} color="#2563eb" />
                        </div>
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
                <div style={styles.pagination}>
                    <button
                        style={styles.pageBtn}
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>

                    <span style={styles.pageText}>
                        Page {page}
                    </span>

                    <button
                        style={styles.pageBtn}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
            
        </>
    );
}

const styles = {
    page: {
        background: "#f4f7fb",
        minHeight: "100vh",
        paddingBottom: "40px",
    },

    container: {
        width: "95%",
        maxWidth: "1400px",
        margin: "0 auto",
        paddingTop: "30px",
    },

    heading: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "25px",
        color: "#111827",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "18px",
    },

    card: {
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "220px",
        transition: "0.2s",
    },

    cardBody: {
        flex: 1,
    },

    productName: {
        fontSize: "17px",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#111827",
    },

    description: {
        fontSize: "13px",
        color: "#6b7280",
        marginBottom: "14px",
        lineHeight: "1.4",
        minHeight: "40px",
    },

    price: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#2563eb",
        marginBottom: "12px",
    },

    addBtn: {
        width: "100%",
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
    },

    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "14px",
        marginTop: "35px",
    },

    pageBtn: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },

    pageText: {
        fontSize: "16px",
        fontWeight: "600",
    },

    toast: {
        position: "fixed",
        top: "90px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#16a34a",
        color: "white",
        padding: "12px 24px",
        borderRadius: "10px",
        zIndex: 999,
        fontWeight: "600",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    loaderContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
    },
};

export default Products;