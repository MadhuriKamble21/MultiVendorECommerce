import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("https://localhost:7107/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);

                // 👉 Redirect to products
                window.location.href = "/products";
            } else {
                alert("Invalid login");
            }
        } catch (error) {
            console.error(error);
            alert("Login failed");
        }
    };


    return (
        <div>
            <h2>Login</h2>

            <input
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <br /><br />

            <input
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
