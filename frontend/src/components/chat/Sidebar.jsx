import { LogOut, MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";
import useAuth from "../../hooks/useAuth";
import Brand from "../common/Brand";

export default function Sidebar({ onNewChat, mobileOpen, onMobileClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { conversations, sidebarOpen, setSidebarOpen } = useChat();
    const { user, logout } = useAuth();
    return <>
        {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onMobileClose} />}
        <aside className={`chat-sidebar ${sidebarOpen ? "" : "is-collapsed"} ${mobileOpen ? "mobile-open" : ""}`}>
            <div className="sidebar-top"><div className="sidebar-brand"><Brand /></div><button className="icon-button desktop-sidebar-toggle" aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}</button><button className="icon-button mobile-close" aria-label="Close navigation" onClick={onMobileClose}><X size={20} /></button></div>
            <button className="new-chat-button" title="New conversation" onClick={() => { onNewChat(); onMobileClose(); }}><Plus size={18} /><span className="sidebar-label">New conversation</span></button>
            <div className="sidebar-section-label sidebar-label">YOUR CONVERSATIONS</div>
            <nav className="conversation-list" aria-label="Conversations">
                {Array.isArray(conversations) && [...conversations].reverse().map(chat => {
                    const active = location.pathname === `/chat/${chat.conversation_id}`;
                    return <button key={chat.conversation_id} className={`conversation-link ${active ? "active" : ""}`} title={chat.title} aria-current={active ? "page" : undefined} onClick={() => { navigate(`/chat/${chat.conversation_id}`); onMobileClose(); }}><MessageSquare size={17} /><span className="sidebar-label">{chat.title}</span></button>;
                })}
                {(!conversations || conversations.length === 0) && <p className="sidebar-empty sidebar-label">A clean slate.<br />Start your first conversation.</p>}
            </nav>
            <div className="sidebar-tip sidebar-label"><span>Good questions start here.</span><p>Add a document to give your conversation more context.</p></div>
            <div className="sidebar-profile"><span className="user-avatar">{(user?.username || "U").slice(0, 1).toUpperCase()}</span><div className="profile-name sidebar-label"><strong>{user?.username || "Your workspace"}</strong><span>Personal workspace</span></div><button className="icon-button" title="Log out" aria-label="Log out" onClick={() => { logout(); navigate("/login"); }}><LogOut size={17} /></button></div>
        </aside>
    </>;
}

