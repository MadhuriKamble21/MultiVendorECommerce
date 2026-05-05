import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div style={styles.navbar}>
            <h2 style={styles.logo} onClick={() => navigate("/products")}>
                ShopEase
            </h2>

            <div style={styles.actions}>
                <button style={styles.btn} onClick={() => navigate("/products")}>
                    Products
                </button>

                <button style={styles.btn} onClick={() => navigate("/cart")}>
                    Cart
                </button>

                <button style={styles.btn} onClick={() => navigate("/orders")}>
                    Orders
                </button>

                <button style={styles.btn} onClick={() => navigate("/admin")}>
                    Admin
                </button>

                <button style={styles.logoutBtn} onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        background: "#ffffff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },

    logo: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#4f46e5",
        cursor: "pointer",
    },

    actions: {
        display: "flex",
        gap: "10px",
    },

    btn: {
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#eef2ff",
        color: "#3730a3",
        cursor: "pointer",
        fontWeight: "500",
    },

    logoutBtn: {
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#ef4444",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },
};

export default Navbar;