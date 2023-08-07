import { useState, useRef, FC } from "react";
import Modal from "./Modal";

interface DisclaimerProps {
  onConfirm: () => void;
}

const Disclaimer: FC<DisclaimerProps> = ({ onConfirm }) => {
  const [showModal, setShowModal] = useState(true);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      preventCloseOnClickOutside
      onOpen={() => {
        if (confirmButtonRef.current) {
          confirmButtonRef.current.focus({ preventScroll: true });
        }
      }}
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <span className="font-medium text-lg">
        ☝🏻 Before we start, please read the following:
      </span>
      <ol className="list-decimal list-inside mt-6 ">
        <li className="pb-4">
          You are not talking to a real person, but a large language model. LLMs
          are known to make things up at times, so please don't take everything
          that is said seriously.
        </li>
        <li className="pb-4">
          <span className="font-medium">This is very early stage.</span> I
          supplied far too less data about myself to enable deep conversations.
          It's still a lot of fun though!
        </li>
        <li className="pb-4">
          Everything you type here will be processed by OpenAIs servers. They do
          not use these conversations for training, but your input will be
          stored on their servers for 30 days. Check the{" "}
          <a className="underline hover:text-primary" href="/imprint">
            imprint
          </a>{" "}
          for more information.
        </li>
      </ol>
      <div className="flex gap-4 justify-center mt-2">
        <a href="/">
          <button
            className="border-black border-2 rounded-full hover:border-primary hover:text-primary focus:border-primary focus:text-primary px-4 py-2 mt-4"
            onClick={() => setShowModal(false)}
          >
            I'd rather not
          </button>
        </a>
        <button
          onClick={() => {
            onConfirm();
            setShowModal(false);
          }}
          ref={confirmButtonRef}
          className="bg-black text-white rounded-full hover:bg-primary focus:bg-primary px-4 py-2 mt-4"
        >
          Sounds good!
        </button>
      </div>
    </Modal>
  );
};

export default Disclaimer;
