import ReactMarkdown from "react-markdown";
import { FileText, Sparkles } from "lucide-react";

export default function ChatMessage({ role, content, sources }) {
    const isUser = role === "user";
    return <article className={`chat-message ${isUser ? "user-message" : "assistant-message"}`}>
        {!isUser && <span className="assistant-avatar"><Sparkles size={18} /></span>}
        <div className="message-content"><span className="message-author">{isUser ? "You" : "AI-RAG"}</span><div className="markdown-content"><ReactMarkdown>{content}</ReactMarkdown></div>
            {sources && sources.length > 0 && <div className="message-sources"><span className="sources-label">SOURCES</span><div>{sources.map((source, index) => <span key={index} className="source-chip"><FileText size={13} />{source}</span>)}</div></div>}
        </div>
    </article>;
}

