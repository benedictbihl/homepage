import {
  type FormEvent,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { HumanMessage, AIMessage } from "langchain/schema";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import Disclaimer from "./Disclaimer";

import { supabase } from "../../supabase";
import ChatBubble from "./ChatBubble";
import { Icon } from "@iconify/react";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inflight, setInflight] = useState(false);
  const isTouchDevice = "ontouchstart" in window;
  const [scrollHeight] = useState(document.body.scrollHeight);
  const [conversationID] = useState(uuidv4());

  const [conversationHistory, setConversationHistory] =
    useState<ChatMessageHistory>(new ChatMessageHistory());
  const [chatBubbles, setChatBubbles] = useState<JSX.Element[]>([
    <ChatBubble
      key={0}
      message="Hi, I am Benedicts virtual surrogate. He told me some things about himself, so I can answer questions about him. I suggest you ask about things like hobbies, music or work stuff. Try it out!"
    />,
    <ChatBubble
      key={1}
      message="Remember, I can talk about him, but I'm not him 😉"
    />,
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //scroll window to bottom, smooth
    if (chatListRef.current!.scrollHeight > scrollHeight) {
      window.scrollTo({
        top: document.body.scrollHeight + 100,
        behavior: "smooth",
      });
    }
  }, [
    chatContainerRef.current,
    chatContainerRef.current?.scrollHeight,
    chatBubbles,
  ]);

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
              conversationID: conversationID,
            }),
            headers: { "Content-Type": "application/json" },
            onmessage(ev) {
              setOutput((o) => o + ev.data); // we use this to show the answer while it's streaming in
              answer += ev.data; // we use this to save the answer to the conversation object
            },
            onerror(err) {
              throw new Error(err);
            },
          }
        );
      } catch (error) {
        console.error(error);
        answer =
          "Uhh.. looks like i'm on hibernation right now 😬 Try reminding Benedict to reactivate me?";
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
    <>
      <Disclaimer
        onConfirm={() => {
          if (inputRef.current) {
            if (!isTouchDevice && inputRef.current) {
              inputRef.current.focus({ preventScroll: true });
            }
          }
        }}
      />
      <div
        ref={chatContainerRef}
        className="flex flex-col md:mx-auto max-w-3xl justify-between"
      >
        <ul
          ref={chatListRef}
          className="pt-[56px] pb-[96px] flex flex-col px-2"
        >
          {chatBubbles}
          {/* while the answer is streaming in, use the output to show it directly */}
          {output && <ChatBubble message={new AIMessage(output)} />}
        </ul>
        <form
          onSubmit={onSubmit}
          className="flex mt-2 fixed left-0 bottom-[56px] pb-[4px] w-3xl bg-background w-full"
        >
          <div className="flex w-full px-4 md:w-[48rem] mx-auto">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask..."
              className="grow px-4 border-2 border-black rounded-full "
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
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatContainer;
