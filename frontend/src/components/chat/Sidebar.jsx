import { useState } from "react";
import { LogOut, MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";
import useAuth from "../../hooks/useAuth";
import Brand from "../common/Brand";
import DeleteChatModal from "./DeleteChatModal";
import { deleteConversation } from "../../services/conversationService";

export default function Sidebar({ onNewChat, mobileOpen, onMobileClose, busy }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { conversations, setConversations, sidebarOpen, setSidebarOpen } = useChat();
    const { user, logout } = useAuth();
    const [chatToDelete, setChatToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleDelete = async () => {
        if (!chatToDelete || deleting) return;
        const id = chatToDelete.conversation_id;
        setDeleting(true);
        setDeleteError("");
        try {
            await deleteConversation(id);
            setConversations(previous => previous.filter(chat => chat.conversation_id !== id));
            if (location.pathname === `/chat/${id}`) navigate("/chat", { replace: true });
            setChatToDelete(null);
        } catch (error) {
            setDeleteError(error.response?.data?.detail || "Could not delete this conversation. Please try again.");
        } finally {
            setDeleting(false);
        }
    };
    return <>
        {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onMobileClose} />}
        <aside className={`chat-sidebar ${sidebarOpen ? "" : "is-collapsed"} ${mobileOpen ? "mobile-open" : ""}`}>
            <div className="sidebar-top"><div className="sidebar-brand"><Brand /></div><button className="icon-button desktop-sidebar-toggle" aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}</button><button className="icon-button mobile-close" aria-label="Close navigation" onClick={onMobileClose}><X size={20} /></button></div>
            <button className="new-chat-button" title="New conversation" onClick={() => { onNewChat(); onMobileClose(); }}><Plus size={18} /><span className="sidebar-label">New conversation</span></button>
            <div className="sidebar-section-label sidebar-label">YOUR CONVERSATIONS</div>
            <nav className="conversation-list" aria-label="Conversations">
                {Array.isArray(conversations) && [...conversations].reverse().map(chat => {
                    const active = location.pathname === `/chat/${chat.conversation_id}`;
                    return <div key={chat.conversation_id} className={`conversation-row ${active ? "active" : ""}`}>
                        <button className={`conversation-link ${active ? "active" : ""}`} title={chat.title} aria-current={active ? "page" : undefined} onClick={() => { navigate(`/chat/${chat.conversation_id}`); onMobileClose(); }}><MessageSquare size={17} /><span className="sidebar-label">{chat.title}</span></button>
                        <button className="icon-button conversation-delete" disabled={busy} title={busy ? "Wait for the current request to finish" : "Delete conversation"} aria-label={`Delete ${chat.title}`} onClick={() => { setDeleteError(""); setChatToDelete(chat); }}><Trash2 size={15} /></button>
                    </div>;
                })}
                {(!conversations || conversations.length === 0) && <p className="sidebar-empty sidebar-label">A clean slate.<br />Start your first conversation.</p>}
            </nav>
            <div className="sidebar-tip sidebar-label"><span>Good questions start here.</span><p>Add a document to give your conversation more context.</p></div>
            <div className="sidebar-profile"><span className="user-avatar">{(user?.username || "U").slice(0, 1).toUpperCase()}</span><div className="profile-name sidebar-label"><strong>{user?.username || "Your workspace"}</strong><span>Personal workspace</span></div><button className="icon-button" title="Log out" aria-label="Log out" onClick={() => { logout(); navigate("/login"); }}><LogOut size={17} /></button></div>
        </aside>
        <DeleteChatModal chat={chatToDelete} deleting={deleting} error={deleteError} onClose={() => setChatToDelete(null)} onDelete={handleDelete} />
    </>;
}

