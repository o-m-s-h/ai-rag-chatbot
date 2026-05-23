import { useState } from "react";

const NewChatModal = ({
    isOpen,
    onClose,
    onCreate
}) => {

    const [chatName, setChatName] = useState("");

    if (!isOpen) return null;

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/50
                flex
                items-center
                justify-center
                z-50
            "
        >

            <div
                className="
                    bg-[#111827]
                    p-8
                    rounded-2xl
                    w-[400px]
                    border
                    border-gray-800
                "
            >

                <h2 className="text-2xl font-bold mb-6">
                    Create New Chat
                </h2>

                <input
                    type="text"
                    placeholder="Enter chat name"
                    value={chatName}
                    onChange={(e) =>
                        setChatName(e.target.value)
                    }
                    className="
                        w-full
                        p-4
                        rounded-lg
                        bg-[#1f2937]
                        outline-none
                        mb-6
                    "
                />

                <div className="flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="
                            px-5
                            py-2
                            rounded-lg
                            border
                            border-gray-700
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {

                            onCreate(chatName);

                            setChatName("");
                        }}
                        className="
                            px-5
                            py-2
                            rounded-lg
                            bg-blue-500
                            hover:bg-blue-600
                        "
                    >
                        Create
                    </button>

                </div>

            </div>

        </div>
    );
};

export default NewChatModal;