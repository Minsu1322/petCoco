// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex max-h-screen items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative w-[90%] max-w-[420px] rounded p-4" onClick={(e) => e.stopPropagation()}>
        {/* <button className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white" onClick={onClose}>
          X
        </button> */}
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
          //    className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-[0.4rem] bg-gray-400"
          onClick={onClose}
        >
          <img src="/assets/svg/xIcon.svg" alt="..." />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
