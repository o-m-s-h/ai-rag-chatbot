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

import Sidebar from "../components/chat/Sidebar";

import NewChatModal from "../components/chat/NewChatModal";

import ChatMessage from "../components/chat/ChatMessage";

import {
    createConversation
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
        <div className="h-screen bg-[#0f172a] text-white flex">

            <Sidebar
                onNewChat={() =>
                    setModalOpen(true)
                }
            />

            <div className="flex-1 flex flex-col">

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-10
                        py-8
                    "
                >

                    {
                        messages.length === 0 && (

                            <div
                                className="
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-500
                                    text-2xl
                                "
                            >
                                Ask anything...
                            </div>
                        )
                    }

                    {
                        messages.map(
                            (msg, index) => (

                                <ChatMessage
                                    key={index}
                                    role={msg.role}
                                    content={msg.content}
                                    sources={msg.sources}
                                />
                            )
                        )
                    }

                    {
                        loading && (

                            <div className="
                                text-gray-400
                                mt-4
                            ">
                                AI is thinking...
                            </div>
                        )
                    }

                    <div ref={bottomRef} />

                </div>

                <div
                    className="
                        p-5
                        border-t
                        border-gray-800
                        flex
                        gap-3
                    "
                >

                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        onChange={handleUpload}
                    />

                    <button
                        onClick={() =>
                            fileInputRef.current.click()
                        }
                        className="
                            bg-[#1f2937]
                            px-5
                            rounded-lg
                            hover:bg-[#374151]
                        "
                    >
                        <FaPlus />
                    </button>

                    <input
                        type="text"
                        placeholder="Ask anything..."
                        value={message}
                        onChange={(e) =>
                            setMessage(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                        className="
                            flex-1
                            bg-[#111827]
                            p-4
                            rounded-lg
                            outline-none
                        "
                    />

                    <button
                        onClick={handleSendMessage}
                        className="
                            bg-blue-500
                            hover:bg-blue-600
                            px-6
                            rounded-lg
                        "
                    >
                        Send
                    </button>

                </div>

            </div>

            <NewChatModal
                isOpen={modalOpen}
                onClose={() =>
                    setModalOpen(false)
                }
                onCreate={handleCreateChat}
            />

        </div>
    );
};

export default ChatPage;