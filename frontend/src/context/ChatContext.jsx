import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    getConversations
} from "../services/conversationService";
import useAuth from "../hooks/useAuth";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const { user } = useAuth();

    const [conversations, setConversations] = useState([]);

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [loading, setLoading] = useState(false);

    const fetchConversations = async () => {

        const token = localStorage.getItem("token");
        if (!user || !token) return;

        try {

            setLoading(true);

            const data = await getConversations();

            // Ignore responses from a session that ended while the request was pending.
            if (localStorage.getItem("token") !== token) return;

            setConversations(data.conversations || data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        if (!user) setConversations([]);

    }, [user]);

    return (
        <ChatContext.Provider
            value={{
                conversations,
                setConversations,
                fetchConversations,
                sidebarOpen,
                setSidebarOpen,
                loading
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
