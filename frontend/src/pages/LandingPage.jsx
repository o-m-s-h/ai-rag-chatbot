import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, FileText, Layers, MessageSquare, Search, Sparkles, Upload } from "lucide-react";
import Brand from "../components/common/Brand";

const features = [
    { icon: Search, title: "Find the meaning, not just the words.", text: "Semantic and keyword search work together to find the context that matters." },
    { icon: MessageSquare, title: "Keep the conversation going.", text: "Ask follow-up questions and explore ideas with context from your conversation." },
    { icon: Layers, title: "Bring your knowledge together.", text: "Add more documents to the same chat and connect information across your files." },
];

export default function LandingPage() {
    return <div className="landing-page">
        <header className="landing-nav"><Brand /><nav aria-label="Main navigation"><a className="nav-feature" href="#how-it-works">How it works</a><Link className="text-link" to="/login">Log in</Link><Link className="button button-dark" to="/register">Get started <ArrowRight size={16} /></Link></nav></header>
        <main>
            <section className="landing-hero">
                <div className="hero-copy"><span className="eyebrow"><span className="tiny-dot" /> YOUR KNOWLEDGE, CONNECTED</span><h1>Big documents.<br />Clear answers.<br /><em>Just ask.</em></h1><p>A thoughtful AI workspace for your documents. Ask questions, uncover insights, and get answers grounded in your own knowledge.</p><div className="hero-actions"><Link className="button button-accent" to="/register">Start a conversation <ArrowRight size={18} /></Link><a className="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↗</span></a></div><span className="hero-footnote"><FileText size={14} /> Your documents. Your context. Better answers.</span></div>
                <div className="hero-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="art-caption">LESS DIGGING. MORE DISCOVERING.</span>
                    <div className="demo-window"><div className="demo-top"><span className="demo-dots"><i /><i /><i /></span><span>A conversation with your knowledge</span><Sparkles size={14} /></div><div className="demo-body"><span className="demo-label">EXAMPLE WORKSPACE</span><div className="demo-document"><span className="file-symbol"><FileText size={22} /></span><div><strong>Research notes.pdf</strong><small>Added to this conversation</small></div><span className="document-tag">PDF</span></div><div className="demo-question">What are the key takeaways?</div><div className="demo-answer"><span className="mini-brand"><Sparkles size={17} /></span><div><strong>Let’s connect the dots.</strong><p>Your notes point to three key themes:</p><ul><li>Make complex information accessible.</li><li>Connect ideas across your documents.</li><li>Turn insights into your next steps.</li></ul><span className="demo-source"><FileText size={12} /> Research notes.pdf</span></div></div><div className="demo-composer"><span>Ask a follow-up question...</span><ArrowUp size={17} /></div></div></div>
                    <div className="floating-note"><Sparkles size={19} /><span>Grounded in <strong>your knowledge</strong></span></div>
                </div>
            </section>
            <section id="how-it-works" className="how-section"><div className="section-intro"><span className="eyebrow">FROM INFORMATION TO UNDERSTANDING</span><h2>Less searching.<br />More lightbulb moments.</h2><p>Bring your files. We’ll help you see the bigger picture.</p></div><div className="step-list">{[{ icon: Upload, title: "Bring your documents", text: "Create a conversation and upload the files you want to explore." }, { icon: MessageSquare, title: "Ask what’s on your mind", text: "Summarize a topic, untangle an idea, or ask a specific question." }, { icon: Sparkles, title: "Make sense of it all", text: "Explore contextual answers with sources you can refer back to." }].map(({ icon: Icon, title, text }, i) => <div className="step" key={title}><span className="step-number">0{i + 1}</span><Icon size={21} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>
            <section className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><Icon size={23} /><h3>{title}</h3><p>{text}</p></article>)}</section>
        </main><footer className="landing-footer"><Brand /><span>A little clarity goes a long way.</span><a href="https://github.com/o-m-s-h/ai-rag-chatbot" target="_blank" rel="noopener noreferrer"><FaGithub size={17} /> View on GitHub <ArrowRight size={14} /></a></footer>
    </div>;
}


