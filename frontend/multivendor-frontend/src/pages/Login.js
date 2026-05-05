import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                navigate("/products");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Login to continue</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.field}>
                    <label>Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={styles.field}>
                    <label>Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    style={{
                        ...styles.button,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}

const styles = {
    page: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
        fontFamily: "Arial, sans-serif",
    },
    card: {
        width: "350px",
        padding: "30px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    title: {
        margin: 0,
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "700",
    },
    subtitle: {
        textAlign: "center",
        fontSize: "14px",
        color: "#6b7280",
        marginBottom: "10px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        fontSize: "14px",
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        outline: "none",
        fontSize: "14px",
    },
    button: {
        marginTop: "10px",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#4f46e5",
        color: "#fff",
        fontWeight: "600",
        fontSize: "15px",
        transition: "0.2s",
    },
    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "8px",
        borderRadius: "6px",
        fontSize: "13px",
        textAlign: "center",
    },
};

export default Login;