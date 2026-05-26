import {
    FaBars,
    FaPlus,
    FaSignOutAlt
} from "react-icons/fa";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import useChat from "../../hooks/useChat";

import useAuth from "../../hooks/useAuth";

const Sidebar = ({ onNewChat }) => {

    const navigate = useNavigate();

    const location = useLocation();

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
                bg-[#171717]
                border-r
                border-[#2a2a2a]
                transition-all
                duration-300
                flex
                flex-col
                overflow-hidden
                ${sidebarOpen ? "w-[260px]" : "w-[72px]"}
            `}
        >

            {/* Top */}
            <div
                className="
                    p-3
                    flex
                    items-center
                    justify-between
                "
            >

                {
                    sidebarOpen && (

                        <h1
                            className="
                                text-xl
                                font-semibold
                                text-white
                                tracking-wide
                            "
                        >
                            AI-RAG
                        </h1>
                    )
                }

                <button
                    onClick={() =>
                        setSidebarOpen(!sidebarOpen)
                    }
                    className="
                        h-10
                        w-10
                        rounded-lg
                        hover:bg-[#2a2a2a]
                        flex
                        items-center
                        justify-center
                        transition
                    "
                >
                    <FaBars className="text-gray-300" />
                </button>

            </div>

            {/* New Chat */}
            <div className="px-3 pb-3">

                <button
                    onClick={onNewChat}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        bg-[#2f2f2f]
                        hover:bg-[#3a3a3a]
                        p-3
                        rounded-2xl
                        transition-all
                        duration-200
                    "
                >

                    <FaPlus className="text-sm" />

                    {
                        sidebarOpen &&
                        <span className="font-medium">
                            New Chat
                        </span>
                    }

                </button>

            </div>

            {/* Chats */}
            <div
                className="
                    flex-1
                    overflow-y-auto
                    px-2
                    pb-4
                "
            >

                {
                    Array.isArray(conversations) &&

                    [...conversations]
                        .reverse()
                        .map((chat) => {

                            const isActive =
                                location.pathname ===
                                `/chat/${chat.conversation_id}`;

                            return (

                                <div
                                    key={chat.conversation_id}
                                    onClick={() =>
                                        navigate(
                                            `/chat/${chat.conversation_id}`
                                        )
                                    }
                                    className={`
                                        group
                                        mb-1
                                        rounded-xl
                                        cursor-pointer
                                        transition-all
                                        duration-200
                                        flex
                                        items-center
                                        gap-3
                                        px-3
                                        py-3
                                        
                                        ${
                                            isActive
                                                ? "bg-[#2f2f2f]"
                                                : "hover:bg-[#242424]"
                                        }
                                    `}
                                >

                                    {/* Dot */}
                                    <div
                                        className={`
                                            h-2
                                            w-2
                                            rounded-full
                                            flex-shrink-0
                                            
                                            ${
                                                isActive
                                                    ? "bg-white"
                                                    : "bg-gray-500"
                                            }
                                        `}
                                    />

                                    {
                                        sidebarOpen && (

                                            <p
                                                className={`
                                                    truncate
                                                    text-sm
                                                    
                                                    ${
                                                        isActive
                                                            ? "text-white font-medium"
                                                            : "text-gray-300"
                                                    }
                                                `}
                                            >
                                                {chat.title}
                                            </p>
                                        )
                                    }

                                </div>
                            );
                        })
                }

            </div>

            {/* Bottom */}
            <div
                className="
                    p-3
                    border-t
                    border-[#2a2a2a]
                "
            >

                <button
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        hover:bg-[#2a2a2a]
                        p-3
                        rounded-xl
                        transition-all
                        duration-200
                    "
                >

                    <FaSignOutAlt className="text-gray-300" />

                    {
                        sidebarOpen &&
                        <span className="text-gray-200">
                            Logout
                        </span>
                    }

                </button>

            </div>

        </div>
    );
};

export default Sidebar;