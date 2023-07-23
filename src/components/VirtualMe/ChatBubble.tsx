import type { AIMessage, HumanMessage } from "langchain/schema";

interface ChatBubbleProps {
  message: HumanMessage | AIMessage | string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const content = typeof message === "string" ? message : message.content;
  const type = typeof message === "string" ? "ai" : message._getType();
  return (
    <li
      className={`flex max-w-[75%] rounded-3xl p-4 my-3 text-left ${
        type === "ai"
          ? "self-start rounded-bl-none bg-accent1"
          : "self-end rounded-br-none bg-accent2/75"
      }`}
      aria-label={`chat message from ${type === "human" ? "you" : "VirtualMe"}`}
    >
      {content}
    </li>
  );
};

export default ChatBubble;
