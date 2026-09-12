import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageSquare, X } from "lucide-react";

export default function NewChatModal({ isOpen, onClose, onCreate }) {
    const [chatName, setChatName] = useState("");
    const dialogRef = useRef(null);
    useEffect(() => {
        const dialog = dialogRef.current;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);
    return <dialog ref={dialogRef} className="new-chat-dialog" aria-labelledby="new-chat-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="dialog-content"><button className="icon-button dialog-close" aria-label="Close dialog" onClick={onClose}><X size={19} /></button><span className="welcome-symbol"><MessageSquare size={24} /></span><span className="eyebrow">A NEW THREAD OF THOUGHT</span><h2 id="new-chat-title">Let’s start something.</h2><p>Give your conversation a name. You can add documents and start exploring next.</p><form onSubmit={e => { e.preventDefault(); if (!chatName.trim()) return; onCreate(chatName); setChatName(""); }}><label htmlFor="chat-name">Conversation name</label><input autoFocus id="chat-name" placeholder="e.g. Research notes" value={chatName} onChange={e => setChatName(e.target.value)} required /><div className="dialog-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-accent" type="submit" disabled={!chatName.trim()}>Create conversation <ArrowRight size={16} /></button></div></form></div>
    </dialog>;
}

