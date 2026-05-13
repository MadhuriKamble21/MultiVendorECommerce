import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BASE_URL from "../api";
import { ClipLoader } from "react-spinners";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

   

    

    const fetchProduct = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${BASE_URL}/product/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(
            (item) => item.productId === product.productId
        );

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        setMessage("Added to cart");

        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={styles.loaderContainer}>
                    <ClipLoader size={55} color="#2563eb" />
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div style={styles.notFound}>
                    Product not found
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div style={styles.page}>
                {message && (
                    <div style={styles.toast}>
                        {message}
                    </div>
                )}

                <div style={styles.container}>
                    {/* Left Side */}
                    <div style={styles.imageSection}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={styles.image}
                        />
                    </div>

                    {/* Right Side */}
                    <div style={styles.detailsSection}>
                        <h1 style={styles.name}>
                            {product.name}
                        </h1>

                        <p style={styles.price}>
                            ₹{product.price}
                        </p>

                        <p style={styles.description}>
                            {product.description}
                        </p>

                        <div style={styles.stock}>
                            Stock Available: {product.stock}
                        </div>

                        <button
                            style={styles.cartBtn}
                            onClick={addToCart}
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px 20px",
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "18px",
        padding: "30px",
        display: "grid",
        gridTemplateColumns:
            window.innerWidth < 768
                ? "1fr"
                : "1fr 1fr",
        gap: "40px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    },

    imageSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    image: {
        width: "100%",
        maxHeight: "500px",
        objectFit: "cover",
        borderRadius: "16px",
    },

    detailsSection: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

    name: {
        fontSize: "36px",
        fontWeight: "700",
        marginBottom: "15px",
        color: "#111827",
    },

    price: {
        fontSize: "30px",
        fontWeight: "700",
        color: "#2563eb",
        marginBottom: "20px",
    },

    description: {
        fontSize: "16px",
        lineHeight: "1.7",
        color: "#4b5563",
        marginBottom: "25px",
    },

    stock: {
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "25px",
        color: "#16a34a",
    },

    cartBtn: {
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        width: "220px",
    },

    loaderContainer: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb",
    },

    notFound: {
        textAlign: "center",
        marginTop: "100px",
        fontSize: "22px",
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
};

export default ProductDetails;