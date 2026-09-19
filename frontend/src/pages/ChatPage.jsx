import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FaPlus
} from "react-icons/fa";

import ChatLayout from "../components/chat/ChatLayout";

import {
    createConversation
} from "../services/conversationService";

import {
    getConversations
} from "../services/conversationService";

import {
    sendMessage,
    getMessages
} from "../services/chatService";

import {
    uploadDocument
} from "../services/uploadService";

import useChat from "../hooks/useChat";

const ChatPage = () => {

    const navigate = useNavigate();

    const { conversationId } = useParams();

    const {
        fetchConversations,
        setConversations
    } = useChat();

    const [modalOpen, setModalOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef();

    const bottomRef = useRef();

    const [isLoading, setIsLoading] = useState(false);

    const [uploading, setUploading] = useState(false);

    const [uploadFileName, setUploadFileName] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [uploadConversationId, setUploadConversationId] = useState(null);
    const activeConversation = useRef(conversationId);
    activeConversation.current = conversationId;
    
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        const loadConversations = async () => {

            try {

                const data =
                    await fetchConversations();
            } catch (error) {

                console.error(error);
            }
        };

        loadConversations();

    }, []);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    useEffect(() => {

    let cancelled = false;
    setMessages([]);
    setMessage("");
    setUploadError("");

    const fetchMessages = async () => {

        if (!conversationId) return;

            try {

                const data = await getMessages(
                    conversationId
                );

                if (!cancelled) setMessages(data);

            } catch (err) {

                console.log(err);
            }
        };

        fetchMessages();
        return () => { cancelled = true; };

    }, [conversationId]);

    const handleCreateChat = async (chatName) => {

        try {

            const data =
                await createConversation({
                    title: chatName
                });

            await fetchConversations();

            setModalOpen(false);

            navigate(
                `/chat/${data.conversation_id}`
            );

        } catch (err) {

            console.log(err);
        }
    };

    const handleSendMessage = async () => {

        if (!message.trim()) return;

        if (!conversationId) {
            alert("Create a chat first");
            return;
        }

        const userMessage = {
            role: "user",
            content: message
        };

        setMessages((prev) => [
            ...prev,
            userMessage
        ]);

        const currentMessage = message;

        setMessage("");

        try {

            setLoading(true);

            const data = await sendMessage(
                conversationId,
                currentMessage
            );

            const aiMessage = {
                role: "assistant",
                content: data.answer,
                sources: data.sources
            };

            if (activeConversation.current !== conversationId) return;
            setMessages((prev) => [
                ...prev,
                aiMessage
            ]);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    const handleUpload = async (e) => {

        const file = e.target.files[0];
        e.target.value = "";

        if (!file || !conversationId || uploading) return;

        try {
            setUploading(true);
            setUploadConversationId(conversationId);
            setUploadError("");
            setUploadFileName(file.name);
            const result = await uploadDocument(
                conversationId,
                file
            );
            if (!result.success) throw new Error("Document upload failed. Please try again.");
            setConversations(previous => previous.map(chat => {
                if (String(chat.conversation_id) !== conversationId) return chat;
                const document = result.document || {
                    filename: result.filename || file.name,
                    file_type: file.name.split(".").pop().toLowerCase(),
                };
                return { ...chat, documents: [...(chat.documents || []).filter(item => item.filename !== document.filename), document] };
            }));
        } catch (err) {
            if (activeConversation.current === conversationId) {
                setUploadError(err.response?.data?.detail || err.message || "Could not upload this document. Please try again.");
            }
        }finally{
            setUploading(false);
        }
    };

    return (

        <ChatLayout
            setModalOpen={setModalOpen}
            messages={messages}
            loading={loading}
            bottomRef={bottomRef}
            fileInputRef={fileInputRef}
            handleUpload={handleUpload}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            modalOpen={modalOpen}
            handleCreateChat={handleCreateChat}
            uploading={uploading && uploadConversationId === conversationId}
            uploadFileName={uploadFileName}
            uploadError={uploadError}
            uploadPending={uploading}
        />
    );
};

export default ChatPage;
