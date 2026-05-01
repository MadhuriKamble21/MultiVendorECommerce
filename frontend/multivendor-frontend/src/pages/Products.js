import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
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

            const response = await fetch("https://localhost:7107/api/product/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 🔴 If unauthorized, redirect to login
            if (response.status === 401 || response.status === 403) {
                alert("Unauthorized. Please login again.");
                navigate("/");
                return;
            }

            const data = await response.json();

            console.log("API Response:", data);

            // ✅ Handle both cases
            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data.data) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
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

        alert("Added to cart");
    };


    return (
        <div>
            <h2>Products</h2>

            <button onClick={() => navigate("/cart")}>
                Go to Cart
            </button>


            {products.length === 0 ? (
                <p>No products found</p>
            ) : (
                products.map((p) => (
                    <div
                        key={p.productId || p.id}
                        style={{
                            border: "1px solid black",
                            margin: "10px",
                            padding: "10px",
                        }}
                    >
                        <h3>{p.name}</h3>
                        <p>Price: ₹{p.price}</p>

                        <button onClick={() => addToCart(p)}>
                            Add to Cart
                        </button>

                    </div>

                ))
            )}
        </div>
    );
}

export default Products;
