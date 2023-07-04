import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isEntering, setIsEntering] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleEnter = () => {
    setIsEntering(true);
  };

  const handleEntered = () => {
    setIsEntering(false);
  };

  const handleLeave = () => {
    setIsLeaving(true);
  };

  const handleLeft = () => {
    setIsLeaving(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 transition-opacity flex items-center justify-center ${
            isEntering ? "ease-out duration-300 opacity-100" : "opacity-0"
          } ${isLeaving ? "ease-in duration-200 opacity-0" : "opacity-100"}`}
          aria-hidden={!isOpen}
          onAnimationEnd={isLeaving ? handleLeft : undefined}
        >
          <div
            className="absolute inset-0 bg-black opacity-20"
            onClick={handleLeave}
          ></div>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed bg-white rounded-lg shadow-lg p-6 w-1/3"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
              onAnimationEnd={isEntering ? handleEntered : undefined}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Modal;
