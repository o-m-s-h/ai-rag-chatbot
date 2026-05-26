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
        fetchConversations
    } = useChat();

    const [modalOpen, setModalOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef();

    const bottomRef = useRef();
    
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

    const fetchMessages = async () => {

        if (!conversationId) return;

            try {

                const data = await getMessages(
                    conversationId
                );

                setMessages(data);

            } catch (err) {

                console.log(err);
            }
        };

        fetchMessages();

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

        if (!file) return;

        try {

            await uploadDocument(
                conversationId,
                file
            );

            alert("Upload successful");

        } catch (err) {

            console.log(err);

            alert("Upload failed");
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
        />
    );
};

export default ChatPage;