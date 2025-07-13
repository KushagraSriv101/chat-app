import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100 text-base-content">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((message, index) => {
          const isSender = message.senderId === authUser._id;
          const isOnlyImage = message.image && !message.text?.trim();

          return (
            <div
              key={message._id || index}
              className={`flex flex-col gap-1 max-w-full ${isSender ? "items-end" : "items-start"}`}
              ref={messageEndRef}
            >
              <div className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                {/* Profile Pic */}
                <div className="flex items-end">
                  <div className="size-9 rounded-full border shadow-sm overflow-hidden">
                    <img
                      src={
                        isSender
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Message Content */}
                {isOnlyImage ? (
                  // Just the image
                  <div className="max-w-[75%] overflow-hidden rounded-md">
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="w-full max-h-[300px] object-cover rounded-lg border border-base-300"
                    />
                  </div>
                ) : (
                  // Message bubble
                  <div
                    className={`relative max-w-[75%] px-4 py-3 shadow-lg whitespace-pre-wrap break-words text-sm overflow-hidden ${
                      isSender
                        ? "bg-primary text-primary-content rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md after:content-[''] after:absolute after:bottom-0 after:right-2 after:-mb-[5px] after:border-[6px] after:border-transparent after:border-t-[theme(colors.primary)]"
                        : "bg-base-200 text-base-content rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-md after:content-[''] after:absolute after:bottom-0 after:left-2 after:-mb-[5px] after:border-[6px] after:border-transparent after:border-t-base-200"
                    }`}
                  >
                    {message.image && (
                      <div className="overflow-hidden rounded-md mb-2">
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span
                className={`text-[10px] mt-1 ${
                  isSender ? "text-base-content/60 pr-12 text-right" : "text-base-content/70 pl-12 text-left"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </span>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
