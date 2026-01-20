import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../api/auth";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await registerApi(email, password);
            navigate("/login");
        } catch (err: any) {
            setError(
                err.response?.data?.message ??
                "Registration failed. Email may already exist."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "4rem auto" }}>
            <h2>Register</h2>

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
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <p style={{ marginTop: "1rem" }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
