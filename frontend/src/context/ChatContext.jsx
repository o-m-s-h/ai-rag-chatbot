import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    getConversations
} from "../services/conversationService";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const [conversations, setConversations] = useState([]);

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [loading, setLoading] = useState(false);

    const fetchConversations = async () => {

        try {

            setLoading(true);

            const data = await getConversations();

            console.log(data);

            setConversations(data.conversations || data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchConversations();

    }, []);

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