import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authService";

import useAuth from "../hooks/useAuth";

import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";

const LoginPage = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = await loginUser(formData);

            if (!data.success) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);

            login(
                data.token,
                {
                    username: data.username,
                    email: formData.email
                }
            );

            navigate("/chat");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <span className="eyebrow">YOUR KNOWLEDGE WORKSPACE</span>
            <h2>Welcome back.</h2>
            <p className="auth-description">Pick up where your curiosity left off.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" name="email" autoComplete="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <div className="password-field">
                    <input id="password" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Enter your password" required value={formData.password} onChange={handleChange} />
                    <button type="button" className="icon-button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {error && <p role="alert" className="form-error">{error}</p>}
                <button type="submit" disabled={loading} className="button button-accent auth-submit">{loading ? <><Loader2 className="animate-spin" size={18} /> Logging in...</> : <>Log in <ArrowRight size={18} /></>}</button>
            </form>
            <p className="auth-switch">New to AI-RAG? <Link to="/register">Create an account <ArrowRight size={14} /></Link></p>
        </AuthLayout>
    );
};

export default LoginPage;
