import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../services/authService";

import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";

const RegisterPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

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

            setError("");

            await registerUser(formData);

            navigate("/login");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <span className="eyebrow">MAKE ROOM FOR YOUR NEXT IDEA</span>
            <h2>A fresh start.</h2>
            <p className="auth-description">Create your account. Bring your knowledge to life.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="username">Username</label>
                <input id="username" type="text" name="username" autoComplete="username" placeholder="What should we call you?" required value={formData.username} onChange={handleChange} />
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" name="email" autoComplete="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <div className="password-field">
                    <input id="password" type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" placeholder="Choose a password" required value={formData.password} onChange={handleChange} />
                    <button type="button" className="icon-button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {error && <p role="alert" className="form-error">{error}</p>}
                <button type="submit" disabled={loading} className="button button-accent auth-submit">{loading ? <><Loader2 className="animate-spin" size={18} /> Creating account...</> : <>Create account <ArrowRight size={18} /></>}</button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/login">Log in <ArrowRight size={14} /></Link></p>
        </AuthLayout>
    );
};

export default RegisterPage;
