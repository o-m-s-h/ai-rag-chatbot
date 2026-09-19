import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowUp, ArrowUpRight, FileText, Menu, Paperclip, Plus, Sparkles, BookOpen, ListChecks, Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import NewChatModal from "./NewChatModal";
import ChatMessage from "./ChatMessage";
import useChat from "../../hooks/useChat";
import DocumentCard from "./DocumentCard";

const prompts = [
    { icon: FileText, title: "The big picture", text: "Summarize the key takeaways from my documents." },
    { icon: BookOpen, title: "A little more clarity", text: "Explain the main concepts in my documents in simple terms." },
    { icon: ListChecks, title: "From insight to action", text: "What are the actionable next steps from my documents?" },
];

export default function ChatLayout({ setModalOpen, messages, loading, bottomRef, fileInputRef, handleUpload, message, setMessage, handleSendMessage, modalOpen, handleCreateChat, uploading, uploadFileName, uploadError, uploadPending }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { conversationId } = useParams();
    const { conversations } = useChat();
    const currentChat = Array.isArray(conversations) ? conversations.find(chat => String(chat.conversation_id) === conversationId) : null;
    const isBusy = loading || uploadPending;
    return <div className="chat-shell">
        <Sidebar busy={isBusy} onNewChat={() => setModalOpen(true)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <main className="chat-main">
            <header className="chat-header"><div className="chat-header-title"><button className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={21} /></button><span className="header-symbol"><MessageIcon /></span><div><strong>{currentChat?.title || "Your workspace"}</strong><span>A conversation with your knowledge</span></div></div><span className="workspace-badge"><Sparkles size={13} /> Document chat</span></header>
            <div className="chat-scroll">
                {messages.length === 0 && <section className="chat-welcome"><span className="welcome-symbol"><Sparkles size={29} /></span><span className="eyebrow">A SPACE FOR YOUR CURIOSITY</span><h1>What will you<br /><em>discover today?</em></h1><p>{conversationId ? "Bring a document, ask a question, and connect the dots." : "Start a conversation, add your documents, and find a little clarity."}</p><div className="prompt-grid">{prompts.map(({ icon: Icon, title, text }) => <button className="prompt-card" key={title} onClick={() => { setMessage(text); if (!conversationId) setModalOpen(true); }}><Icon size={21} /><strong>{title}</strong><span>{text}</span><ArrowUpRight className="prompt-arrow" size={16} /></button>)}</div>{!conversationId && <button className="text-link welcome-create" onClick={() => setModalOpen(true)}><Plus size={16} /> Create your first conversation</button>}</section>}
                <div className="message-list" aria-live="polite" aria-busy={loading}>{messages.map((msg, index) => <ChatMessage key={index} role={msg.role} content={msg.content} sources={msg.sources} />)}{loading && <div className="thinking" role="status"><Sparkles size={18} /><span>Connecting the dots</span><span className="thinking-dots"><i /><i /><i /></span></div>}<div ref={bottomRef} /></div>
            </div>
            <div className="composer-region">
                {currentChat?.documents?.length > 0 && <div className="document-list" aria-label="Uploaded documents" aria-live="polite">{currentChat.documents.map(document => <DocumentCard key={document.document_id || document.filename} document={document} />)}</div>}
                {uploading && <div className="upload-status" role="status"><Loader2 size={19} className="animate-spin" /><div><strong>{uploadFileName}</strong><span>Processing document...</span></div></div>}
                {uploadError && <p className="upload-error form-error" role="alert">{uploadError}</p>}
                <div className="composer">
                    <input type="file" accept=".pdf,.txt,.docx,.pptx" ref={fileInputRef} hidden onChange={handleUpload} />
                    <textarea aria-label="Your message" rows={2} placeholder={conversationId ? "Ask a question about your documents..." : "Your next question starts here..."} value={message} disabled={isBusy} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && !isBusy) { e.preventDefault(); if (conversationId) handleSendMessage(); else setModalOpen(true); } }} />
                    <div className="composer-toolbar"><button className="attach-button" disabled={isBusy} onClick={() => { if (conversationId) fileInputRef.current.click(); else setModalOpen(true); }}><Paperclip size={17} /><span>Add document</span></button><span className="composer-hint">Shift + Enter for a new line</span><button className="send-button" aria-label={conversationId ? "Send message" : "Create a conversation to send your message"} disabled={isBusy || !message.trim()} onClick={() => { if (conversationId) handleSendMessage(); else setModalOpen(true); }}><ArrowUp size={20} /></button></div>
                </div>
                <p className="composer-disclaimer">A little AI, a little perspective. Always check important information.</p>
            </div>
        </main>
        <NewChatModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateChat} />
    </div>;
}

function MessageIcon() { return <BookOpen size={19} />; }

