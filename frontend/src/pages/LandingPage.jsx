import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

const sentences = [
    "Upload documents and retrieve context-aware information instantly.",

    "Experience hybrid retrieval combining vector similarity and keyword-based ranking.",

    "Generates intelligent responses grounded on retrieved knowledge chunks and reranked context.",

    "Built production-ready AI assistant powered by embeddings, retrieval pipelines, and LLM reasoning."
];

const LandingPage = () => {

    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {

        const interval = setInterval(() => {

            setFade(false);

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % sentences.length);
                setFade(true);
            }, 500);

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f8fbff] text-black isolate">
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

            <div className="relative z-10">
                <nav className="flex items-center justify-end px-10 py-6">

                    <div className="flex gap-4">

                        <Link to="/login">
                            <button
                                className="
                                px-6 py-3
                                rounded-full
                                bg-blue-400 text-white
                                text-sm font-medium
                                hover:scale-110
                                transition-all duration-300
                                "
                            >
                                Login
                            </button>
                        </Link>

                        <Link to="/register">
                            <button
                                className="
                                px-6 py-3
                                rounded-full
                                bg-blue-400 text-white
                                text-sm font-medium
                                hover:scale-110
                                transition-all duration-300
                                "
                            >
                                Register
                            </button>
                        </Link>

                    </div>
                
                </nav>

                <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-28 -mt-10">

                    {/* Typing Animation Heading */}
                    <div className="text-6xl font-extrabold leading-tight max-w-4xl min-h-[160px]">

                        <TypeAnimation
                            sequence={[
                                "Intelligent AI Chat Powered by RAG Architecture",
                            ]}
                            speed={50}
                            cursor={true}
                            repeat={0}
                        />

                    </div>

                    {/* Smooth Transition Paragraph */}
                    <div
                        className={`mt-8 text-gray-500 text-xl max-w-3xl leading-9 min-h-[120px]
                        transition-all duration-500 ease-in-out
                        ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
                        `}
                    >
                        {sentences[index]}
                    </div>

                    {/* Feature Cards */}
                    <section className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mt-6">

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-sky-500">
                                Semantic Search
                            </h2>

                            <p className="text-gray-600 leading-7">
                                Advanced embedding-based retrieval for highly relevant document context.
                            </p>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-cyan-500">
                                Hybrid Retrieval
                            </h2>

                            <p className="text-gray-600 leading-7">
                                Combines vector similarity with keyword search for better accuracy.
                            </p>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-purple-500">
                                Context-Aware AI
                            </h2>

                            <p className="text-gray-600 leading-7">
                                Uses retrieved knowledge chunks to generate intelligent responses.
                            </p>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-fuchsia-500">
                                Dynamic document addition
                            </h2>

                            <p className="text-gray-600 leading-7">
                                Can upload additional documents in the same conversation
                            </p>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-indigo-500">
                                Context Memory
                            </h2>

                            <p className="text-gray-600 leading-7">
                                Generates context aware responses using memory 
                            </p>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-teal-500">
                                LLM Model
                            </h2>

                            <p className="text-gray-600 leading-7">
                                Uses GPT OSS 120b model to generate proper responses.
                            </p>
                        </div>

                    </section>

                </section>
            </div>

            <a
                href="https://github.com/o-m-s-h/ai-rag-chatbot"
                target="_blank"
                rel="noopener noreferrer"
                className="
                fixed bottom-6 right-6
                bg-white/40 backdrop-blur-xl
                border border-white/30
                p-4 rounded-full
                shadow-lg
                hover:scale-110 hover:bg-white/60
                transition-all duration-300
                z-50
                "
            >
                <FaGithub className="text-3xl text-gray-800 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]" />
            </a>

        </div>
    );
};

export default LandingPage;