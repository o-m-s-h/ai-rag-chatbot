import { FaPlus } from "react-icons/fa";
import { IoArrowUp } from "react-icons/io5";

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
    handleCreateChat,
    uploading,
    uploadFileName
}) => {
    const isBusy = loading || uploading;
    return (

        <div className="h-screen bg-[#212121] text-white flex overflow-hidden">

            <Sidebar
                onNewChat={() =>
                    setModalOpen(true)
                }
            />

            <div className="flex-1 flex flex-col relative">

                {/* Chat Area */}
                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-4
                        md:px-10
                        py-8
                    "
                >

                    {
                        messages.length === 0 && (

                            <div
                                className="
                                    h-full
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                "
                            >

                                <h1
                                    className="
                                        text-4xl
                                        md:text-5xl
                                        font-semibold
                                        text-gray-200
                                        mb-4
                                    "
                                >
                                    What can I help with?
                                </h1>

                                <p
                                    className="
                                        text-gray-500
                                        text-lg
                                    "
                                >
                                    Ask anything and upload files.
                                </p>

                            </div>
                        )
                    }

                    {/* Messages */}
                    <div
                        className="
                            max-w-4xl
                            mx-auto
                            flex
                            flex-col
                            gap-6
                        "
                    >

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

                                <div
                                    className="
                                        text-gray-400
                                        text-sm
                                        animate-pulse
                                        px-2
                                    "
                                >
                                    AI is thinking...
                                </div>
                            )
                        }

                        <div ref={bottomRef} />

                    </div>

                </div>

                {/* Input Section */}
                <div
                    className="
                        w-full
                        px-4
                        md:px-8
                        pb-6
                    "
                    >

                    {
                        uploading && (

                            <div
                                className="
                                    max-w-4xl
                                    mx-auto
                                    mb-4
                                    px-4
                                "
                            >

                                <div
                                    className="
                                        bg-[#2f2f2f]
                                        border
                                        border-[#3a3a3a]
                                        rounded-2xl
                                        px-4
                                        py-3
                                        flex
                                        items-center
                                        gap-3
                                        animate-pulse
                                    "
                                >

                                    {/* File Icon */}
                                    <div
                                        className="
                                            h-10
                                            w-10
                                            rounded-xl
                                            bg-[#404040]
                                            flex
                                            items-center
                                            justify-center
                                            text-lg
                                        "
                                    >
                                        📄
                                    </div>

                                    {/* File Details */}
                                    <div className="flex flex-col">

                                        <p className="text-sm text-white font-medium">
                                            {uploadFileName}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Processing document...
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )
                    }

                    {/* PILL SHAPED BAR */}
                    <div
                        className={`
                            max-w-4xl
                            mx-auto
                            bg-[#2f2f2f]
                            border
                            border-[#3a3a3a]
                            rounded-full
                            px-4
                            py-3
                            flex
                            items-center
                            gap-3
                            shadow-lg
                            transition-all
                            duration-300

                            ${
                                isBusy
                                    ? "opacity-60 pointer-events-none"
                                    : "opacity-100"
                            }
                        `}
                    >

                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            onChange={handleUpload}
                        />

                        {/* Upload Button */}
                        <button
                            onClick={() =>
                                fileInputRef.current.click()
                            }
                            disabled={isBusy}
                            className="
                                h-11
                                w-11
                                rounded-full
                                bg-[#404040]
                                hover:bg-[#4a4a4a]
                                flex
                                items-center
                                justify-center
                                transition-all
                                duration-200
                                flex-shrink-0
                            "
                        >
                            <FaPlus className="text-sm" />
                        </button>

                        {/* Input */}
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

                                if (e.key === "Enter" && !isBusy) {
                                    handleSendMessage();
                                }
                            }}
                            className="
                                flex-1
                                bg-transparent
                                text-white
                                placeholder:text-gray-400
                                outline-none
                                text-base
                                py-2
                            "
                        />

                        {/* ChatGPT Style Send Icon */}
                        <button
                            onClick={handleSendMessage}
                            disabled={isBusy}
                            className="
                                h-11
                                w-11
                                rounded-full
                                bg-white
                                text-black
                                hover:scale-105
                                transition-all
                                duration-200
                                flex
                                items-center
                                justify-center
                                flex-shrink-0
                            "
                        >
                            <IoArrowUp className="text-xl" />
                        </button>

                    </div>

                    {/* Footer */}
                    <p
                        className="
                            text-center
                            text-xs
                            text-gray-500
                            mt-3
                        "
                    >
                        AI can make mistakes. Check important info.
                    </p>

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