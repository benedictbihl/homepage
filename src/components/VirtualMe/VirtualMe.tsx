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
        <span className="font-medium text-lg">
          ☝🏻 Before we start, please read the following:
        </span>
        <ol className="list-decimal list-inside mt-6 ">
          <li className="pb-4">
            Everything you type here will be processed by OpenAIs servers. They
            do not use these conversations for training, but your input will be
            stored on their servers for 30 days. Check the{" "}
            <a className="underline hover:text-primary" href="/imprint">
              imprint
            </a>{" "}
            for more information.
          </li>
          <li className="pb-4">
            You are not talking to a real person, but a large language model.
            LLMs are known to make up things a times, so please don't take
            everything that is said seriously.
          </li>
          <li>
            This is an experiment, so I might not be able to answer all of your
            questions.
          </li>
        </ol>
        <div className="flex gap-4 justify-center mt-2">
          <button
            className="border-black border-2 rounded-full hover:border-primary hover:text-primary focus:border-primary focus:text-primary px-4 py-2 mt-4"
            onClick={() => setShowModal(false)}
          >
            I'd rather not
          </button>
          <button
            className="bg-black text-white rounded-full hover:bg-primary focus:bg-primary px-4 py-2 mt-4"
            onClick={() => {
              setShowModal(false);
              setShowChatContainer(true);
            }}
          >
            Sounds Good!
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default VirtualMe;
