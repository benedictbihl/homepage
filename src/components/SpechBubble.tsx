interface SpechBubbleProps {
  sender: "me" | "user";
  content: string;
}

const SpechBubble: React.FC<SpechBubbleProps> = ({ sender, content }) => {
  return (
    <div
      className={`flex ${sender === "me" ? "justify-end" : "justify-start"}`}
    >
      <p
        className={`bg-secondary text-black ${
          sender === "me" ? "mr-8 ml-auto" : "ml-8 mr-auto"
        }`}
        aria-label={`chat message from ${sender}`}
      >
        {content}
      </p>
    </div>
  );
};

export default SpechBubble;
