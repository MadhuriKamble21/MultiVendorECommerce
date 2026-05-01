import { useEffect, useState } from "react";

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    }, []);

    const placeOrder = async () => {
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

            if (!response.ok) {
                throw new Error("Order failed");
            }

            alert("Order placed successfully");

            // ✅ Clear cart
            localStorage.removeItem("cart");
            setCart([]);
        } catch (error) {
            console.error(error);
            alert("Order failed");
        }
    };


    return (
        <div>
            <h2>Cart</h2>

            {cart.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                cart.map((item) => (
                    <div key={item.productId}>
                        <h3>{item.name}</h3>
                        <p>Price: ₹{item.price}</p>
                        <p>Qty: {item.quantity}</p>
                    </div>
                ))
            )}
            <button onClick={placeOrder}>
                Place Order
            </button>

        </div>
    );
}

export default Cart;
