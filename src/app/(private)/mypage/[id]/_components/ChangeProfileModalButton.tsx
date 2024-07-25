"use client";
import { useState } from "react";
import ChangeProfileModal from "./ChangeProfileModal";

const ChangeProfileModalButton = () => {
  const [showModal, setShowModal] = useState(false);

  const clickModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="my-auto flex flex-col items-center justify-center">
      <button
        className="mt-5 rounded border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
        onClick={clickModal}
      >
        프로필 변경
      </button>

      {showModal && <ChangeProfileModal clickModal={clickModal} />}
    </div>
  );
};

export default ChangeProfileModalButton;
