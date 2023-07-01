import { FormEvent, useCallback, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { supabase } from "../../supabase";

export const ChatContainer = () => {
  const [stream, setStream] = useState(true);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inflight, setInflight] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      console.log("first");
      // Prevent multiple requests at once
      if (inflight) return;

      // Reset output
      setInflight(true);
      setOutput("");

      try {
        if (stream) {
          // If streaming, we need to use fetchEventSource directly
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
          setInput("");
        } else {
          // If not streaming, we can use the supabase client
          const { data } = await supabase.functions.invoke("chat", {
            body: { input },
          });
          setOutput(data.text);
          setInput("");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setInflight(false);
      }
    },
    [input, stream, inflight, supabase]
  );

  return (
    <div>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <input
          type="text"
          placeholder="Ask..."
          style={{ padding: 5, width: 200, marginBottom: 10 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            id="stream"
            style={{ marginRight: 5 }}
            checked={stream}
            onChange={() => setStream((s) => !s)}
          />
          <label htmlFor="stream">Stream</label>
        </div>
        <button type="submit" disabled={inflight}>
          Submit {inflight ? "..." : ""}
        </button>
      </form>
      <div style={{ width: 200 }}>Response: {output}</div>
    </div>
  );
};
