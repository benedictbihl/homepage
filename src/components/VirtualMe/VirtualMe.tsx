import { useEffect, useRef, useState } from "react";
import ChatContainer from "./ChatContainer";

const VirtualMe = () => {
  const [showChatContainer, setShowChatContainer] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  return showChatContainer ? (
    <ChatContainer />
  ) : (
    <button
      className="bg-black text-white rounded-full hover:bg-primary focus:bg-primary px-4 py-2 my-8"
      onClick={() => setShowChatContainer(true)}
    >
      Talk to me
    </button>
  );
};

export default VirtualMe;
