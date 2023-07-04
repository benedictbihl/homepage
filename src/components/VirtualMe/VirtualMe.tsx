import { useEffect, useState } from "react";
import ChatContainer from "./ChatContainer";
import Modal from "./Modal";

const VirtualMe = () => {
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  return showChatContainer ? (
    <ChatContainer />
  ) : (
    <div>
      <button
        className="bg-black text-white rounded-full hover:bg-primary focus:bg-primary px-4 py-2 my-8"
        onClick={() => setShowModal(true)}
      >
        Talk to me
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
        voluptatum, quibusdam, quia, quae voluptates voluptatem quod consequatur
        voluptas quos doloribus quidem. Quisquam voluptatum, quibusdam, quia,
        quae voluptates voluptatem quod consequatur voluptas
      </Modal>
    </div>
  );
};

export default VirtualMe;
