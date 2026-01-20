import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await loginApi(email, password);

            auth.login(response.token);

            navigate("/");
        } catch (err: any) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "4rem auto" }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginTop: "1rem" }}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: "1.5rem" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
