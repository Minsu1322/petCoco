"use client";
import { useState } from "react";
import ChangeProfileModal from "./ChangeProfileModal";

const ChangeProfileModalButton = () => {
  const [showModal, setShowModal] = useState(false);

  const clickModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="flex flex-col my-auto justify-center items-center">
      <button
        className="rounded py-2 px-4 bg-[#24CAFF] border-[#00BBF7] text-center text-white font-bold mt-5"
        onClick={clickModal}
      >
        프로필 변경
      </button>

      {showModal && <ChangeProfileModal clickModal={clickModal} />}
    </div>
  );
};

export default ChangeProfileModalButton;
