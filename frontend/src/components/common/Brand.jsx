import { Link } from "react-router-dom";
import { Layers } from "lucide-react";

export default function Brand() {
    return <Link to="/" className="brand" aria-label="AI-RAG home"><span className="brand-mark"><Layers size={21} /></span><span>AI-RAG<span className="brand-period">.</span></span></Link>;
}

