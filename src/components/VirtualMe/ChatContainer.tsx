import { FormEvent, useCallback, useState, useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { HumanMessage, AIMessage } from "langchain/schema";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

import { supabase } from "../../supabase";
import ChatBubble from "./ChatBubble";
import { Icon } from "@iconify/react";

const ChatContainer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inflight, setInflight] = useState(false);
  const [conversationHistory, setConversationHistory] =
    useState<ChatMessageHistory>(new ChatMessageHistory());
  const [chatBubbles, setChatBubbles] = useState<JSX.Element[]>([
    <ChatBubble
      key={0}
      message="Hi, I am Benedicts virtual representation. He told me quite some things about himself, so I can answer some questions about him. Try it out!"
    />,
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstUpdate = useRef(true);

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

  useEffect(() => {
    // don't scroll to bottom on first render -> conflict with scrollIntoView
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    //scroll to bottom of chat
    if (chatListRef.current) {
      chatListRef.current.scroll({
        top: chatListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatListRef.current && chatListRef.current.scrollHeight]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      let answer = "";
      setInput("");
      setConversationHistory((c) => {
        c.addUserMessage(input);
        return c;
      });
      setChatBubbles((c) => [
        ...c,
        <ChatBubble key={c.length} message={new HumanMessage(input)} />,
      ]);
      e.preventDefault();
      // Prevent multiple requests at once
      if (inflight) return;

      setInflight(true);
      try {
        const history = await conversationHistory.getMessages();
        await fetchEventSource(
          `${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/chat`,
          {
            method: "POST",
            body: JSON.stringify({
              input: input,
              history: history,
            }),
            headers: { "Content-Type": "application/json" },
            onmessage(ev) {
              setOutput((o) => o + ev.data); // we use this to show the answer while it's streaming in
              answer += ev.data; // we use this to save the answer to the conversation object
            },
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setInflight(false);
        setOutput("");
        setConversationHistory((c) => {
          c.addAIChatMessage(answer);
          return c;
        });
        setChatBubbles((c) => [
          ...c,
          <ChatBubble key={c.length} message={new AIMessage(answer)} />,
        ]);
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus({ preventScroll: true });
        }
      }
    },
    [input, inflight, supabase]
  );

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col h-[90vh] my-10 md:mx-16 scroll-m-9"
    >
      <ul ref={chatListRef} className="overflow-y-auto flex flex-col grow px-2">
        {chatBubbles}
        {/* while the answer is streaming in, use the output to show it directly */}
        {output && <ChatBubble message={new AIMessage(output)} />}
      </ul>
      <form onSubmit={onSubmit} className="flex mt-2">
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
          disabled={inflight}
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
