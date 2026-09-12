import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../common/Brand";

export default function AuthLayout({ children }) {
    return <main className="auth-page">
        <aside className="auth-story"><Brand />
            <div className="auth-story-content"><span className="eyebrow">A LITTLE LESS SEARCHING. A LOT MORE KNOWING.</span><h1>Your documents.<br />A whole new<br /><em>perspective.</em></h1><p>Turn the information you have into the answers you need. All in one conversation.</p>
                <div className="auth-note"><span className="note-icon"><FileText size={21} /></span><div><strong>From pages to possibilities</strong><p>Upload. Ask. Understand.</p></div><Sparkles size={20} /></div>
            </div><span className="auth-story-footer">Built for curious minds.</span>
        </aside>
        <section className="auth-main"><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to home</Link><div className="auth-card">{children}</div><p className="auth-bottom">Your next good idea starts with a question.</p></section>
    </main>;
}

