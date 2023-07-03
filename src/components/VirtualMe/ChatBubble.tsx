interface ChatBubbleProps {
  sender: "VirtualMe" | "User";
  content: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ sender, content }) => {
  return (
    <li
      className={`flex max-w-[75%] rounded-3xl p-4 my-2 text-left ${
        sender === "VirtualMe"
          ? "self-start rounded-bl-none bg-accent1"
          : "self-end rounded-br-none bg-accent2/75"
      }`}
      aria-label={`chat message from ${sender}`}
    >
      {content}
    </li>
  );
};

export default ChatBubble;
