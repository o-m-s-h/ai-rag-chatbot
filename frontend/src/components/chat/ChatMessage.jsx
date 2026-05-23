import ReactMarkdown from "react-markdown";

const ChatMessage = ({
    role,
    content,
    sources
}) => {

    return (
        <div
            className={`
                w-full
                flex
                ${role === "user"
                    ? "justify-end"
                    : "justify-start"}
            `}
        >

            <div
                className={`
                    max-w-[75%]
                    p-4
                    rounded-2xl
                    mb-4
                    whitespace-pre-wrap
                    ${
                        role === "user"
                        ? "bg-blue-500"
                        : "bg-[#1f2937]"
                    }
                `}
            >

                <ReactMarkdown>
                    {content}
                </ReactMarkdown>

                {
                    sources &&
                    sources.length > 0 && (
                        <div className="mt-4">

                            <p className="
                                text-xs
                                text-gray-400
                                mb-2
                            ">
                                Sources
                            </p>

                            {
                                sources.map(
                                    (source, index) => (
                                        <div
                                            key={index}
                                            className="
                                                text-xs
                                                bg-[#111827]
                                                px-3
                                                py-1
                                                rounded-lg
                                                mb-1
                                            "
                                        >
                                            {source}
                                        </div>
                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default ChatMessage;