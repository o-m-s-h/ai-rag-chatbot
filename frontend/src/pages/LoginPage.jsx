import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authService";

import useAuth from "../hooks/useAuth";

const LoginPage = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

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

            const data = await loginUser(formData);

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
        <div className="relative min-h-screen overflow-hidden bg-[#f8fbff] isolate flex items-center justify-center px-6">

            {/* Aurora Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">

                <div className="absolute top-[-10rem] left-[-5rem] w-[40rem] h-[40rem]
                bg-blue-300 opacity-50 rounded-full blur-2xl animate-aurora1" />

                <div className="absolute top-[10rem] right-[-10rem] w-[35rem] h-[35rem]
                bg-cyan-200 opacity-50 rounded-full blur-2xl animate-aurora2" />

                <div className="absolute bottom-[-10rem] left-[20%] w-[45rem] h-[45rem]
                bg-purple-200 opacity-40 rounded-full blur-2xl animate-aurora3" />

                <div className="absolute inset-0 backdrop-blur-[80px]" />

            </div>

            {/* Login Card */}
            <div
                className="
                relative z-10
                w-full max-w-md
                bg-white/40
                backdrop-blur-2xl
                border border-white/30
                shadow-2xl
                rounded-3xl
                p-10
                "
            >

                <div className="mb-8 text-center">

                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Welcome Back
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Login to continue your AI-RAG experience
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="
                        p-4 rounded-2xl
                        bg-white/50
                        border border-white/40
                        outline-none
                        focus:ring-2 focus:ring-blue-400
                        transition-all
                        placeholder:text-gray-500
                        "
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="
                        p-4 rounded-2xl
                        bg-white/50
                        border border-white/40
                        outline-none
                        focus:ring-2 focus:ring-cyan-400
                        transition-all
                        placeholder:text-gray-500
                        "
                    />

                    {
                        error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )
                    }

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                        mt-2
                        bg-gradient-to-r from-blue-500 to-cyan-500
                        hover:scale-[1.02]
                        text-white
                        p-4 rounded-2xl
                        font-semibold
                        shadow-lg
                        transition-all duration-300
                        "
                    >
                        {
                            loading
                            ? "Logging in..."
                            : "Login"
                        }
                    </button>

                </form>

                <p className="text-center text-gray-600 mt-6">

                    Don’t have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-500 font-semibold hover:text-cyan-500 transition"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default LoginPage;