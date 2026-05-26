import { FaPlus } from "react-icons/fa";
import Sidebar from "./Sidebar";
import NewChatModal from "./NewChatModal";
import ChatMessage from "./ChatMessage";

const ChatLayout = ({
    setModalOpen,
    messages,
    loading,
    bottomRef,
    fileInputRef,
    handleUpload,
    message,
    setMessage,
    handleSendMessage,
    modalOpen,
    handleCreateChat
}) => {
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

export default ChatLayout;