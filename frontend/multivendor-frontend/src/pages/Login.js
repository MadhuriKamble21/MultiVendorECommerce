import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            const response = await fetch("https://multivendorecommerce-fw8x.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                navigate("/products"); // ✅ React way
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            console.error(error);
            setError("Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // 🎨 Styles
    const container = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f3f4f6",
    };

    const card = {
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    };

    const input = {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
    };

    const button = {
        padding: "10px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    };

    return (
        <div style={container}>
            <div style={card}>
                <h2 style={{ textAlign: "center" }}>Login</h2>

                {error && (
                    <p style={{ color: "red", fontSize: "14px" }}>
                        {error}
                    </p>
                )}

                <div>
                    <label>Email</label>
                    <input
                        style={input}
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        style={input}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    style={button}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}

export default Login;
