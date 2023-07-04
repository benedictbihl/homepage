import { FormEvent, useCallback, useState, useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { supabase } from "../../supabase";
import ChatBubble from "./ChatBubble";
import { Icon } from "@iconify/react";

type ChatMessage = {
  sender: "VirtualMe" | "User";
  message: string;
};

const ChatContainer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inflight, setInflight] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [convo, setConvo] = useState<ChatMessage[]>([
    {
      sender: "VirtualMe",
      message:
        "Hello, I'm the virtual representation of Benedict. While you might not reach him directly, I can answer some initial questions for you.",
    },
  ]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });

      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    }
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      setInput("");
      setConvo((c) => [...c, { sender: "User", message: input }]);
      e.preventDefault();
      // Prevent multiple requests at once
      if (inflight) return;

      // Reset output
      setInflight(true);
      setOutput("");

      try {
        await fetchEventSource(
          `${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/chat`,
          {
            method: "POST",
            body: JSON.stringify({ input }),
            headers: { "Content-Type": "application/json" },
            onmessage(ev) {
              setOutput((o) => o + ev.data);
            },
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setInflight(false);
        setConvo((c) => [...c, { sender: "VirtualMe", message: output }]);
        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [input, inflight, supabase]
  );

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col min-h-[90vh] my-10 mx-16 scroll-m-9"
    >
      <ul className="grow flex flex-col">
        {convo.map(({ sender, message }, i) => (
          <ChatBubble key={i} sender={sender} content={message} />
        ))}
      </ul>
      <form onSubmit={onSubmit} className="flex">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask..."
          className="grow px-4 border-2 border-black rounded-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={inflight}
        />
        <button
          className="ml-2 p-4 bg-black text-white rounded-full font-semibold disabled:cursor-not-allowed disabled:bg-black hover:bg-primary focus:bg-primary"
          type="submit"
          disabled={inflight || !input}
        >
          {inflight ? (
            <Icon icon="mdi:loading" className="animate-spin h-5 w-5" />
          ) : (
            <Icon icon="mdi:send" className="h-5 w-5" />
          )}
          <span className="sr-only">Ask</span>
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;
