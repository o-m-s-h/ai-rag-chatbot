import {
    FaBars,
    FaPlus,
    FaSignOutAlt
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import useChat from "../../hooks/useChat";

import useAuth from "../../hooks/useAuth";

const Sidebar = ({ onNewChat }) => {

    const navigate = useNavigate();

    const {
        conversations,
        sidebarOpen,
        setSidebarOpen
    } = useChat();

    const { logout } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/login");
    };

    return (
        <div
            className={`
                h-screen
                bg-[#111827]
                border-r
                border-gray-800
                transition-all
                duration-300
                flex
                flex-col
                ${sidebarOpen ? "w-[280px]" : "w-[80px]"}
            `}
        >

            <div className="p-4 flex items-center justify-between">

                {
                    sidebarOpen && (
                        <h1 className="text-xl font-bold text-blue-500">
                            AI-RAG
                        </h1>
                    )
                }

                <button
                    onClick={() =>
                        setSidebarOpen(!sidebarOpen)
                    }
                    className="p-2 hover:bg-[#1f2937] rounded-lg"
                >
                    <FaBars />
                </button>

            </div>

            <div className="p-4">

                <button
                    onClick={onNewChat}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        bg-blue-500
                        hover:bg-blue-600
                        p-3
                        rounded-xl
                        transition
                    "
                >

                    <FaPlus />

                    {
                        sidebarOpen &&
                        <span>New Chat</span>
                    }

                </button>

            </div>

            <div className="flex-1 overflow-y-auto px-3">

                {
                    Array.isArray(conversations) &&
                    conversations.map((chat) => (

                        <div
                            key={chat.conversation_id}
                            onClick={() =>
                                navigate(
                                    `/chat/${chat.conversation_id}`
                                )
                            }
                            className="
                                p-3
                                rounded-lg
                                hover:bg-[#1f2937]
                                cursor-pointer
                                mb-2
                                transition
                            "
                        >

                            {
                                sidebarOpen &&
                                <p className="truncate text-sm">
                                    {chat.title}
                                </p>
                            }

                        </div>
                    ))
                }

            </div>

            <div className="p-4 border-t border-gray-800">

                <button
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        hover:bg-[#1f2937]
                        p-3
                        rounded-lg
                    "
                >

                    <FaSignOutAlt />

                    {
                        sidebarOpen &&
                        <span>Logout</span>
                    }

                </button>

            </div>

        </div>
    );
};

export default Sidebar;