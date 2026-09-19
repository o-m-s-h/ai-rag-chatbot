import { useEffect, useRef } from "react";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteChatModal({ chat, deleting, error, onClose, onDelete }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (chat && !dialog.open) dialog.showModal();
        if (!chat && dialog.open) dialog.close();
    }, [chat]);

    return <dialog ref={dialogRef} className="new-chat-dialog" aria-labelledby="delete-chat-title" onCancel={event => { event.preventDefault(); if (!deleting) onClose(); }}>
        <div className="dialog-content">
            <span className="welcome-symbol"><Trash2 size={24} /></span>
            <h2 id="delete-chat-title">Delete conversation?</h2>
            <p>“{chat?.title}” and its messages and uploaded document data will be permanently deleted.</p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="dialog-actions">
                <button autoFocus className="button button-quiet" disabled={deleting} onClick={onClose}>Cancel</button>
                <button className="button button-accent" disabled={deleting} onClick={onDelete}>{deleting ? <><Loader2 size={16} className="animate-spin" /> Deleting...</> : <>Delete <Trash2 size={16} /></>}</button>
            </div>
        </div>
    </dialog>;
}
