import React from "react";

const TabBar = () => {
  return (
    <div className="fixed bottom-0 border border-bgGray500 bg-white pb-[1.71rem] pt-[0.44rem]">
      <div className="flex gap-x-[1.65rem] px-[1rem] py-[0.25rem]">
        <div className="flex flex-col items-center justify-center gap-y-[0.29rem] pl-[0.72rem] pr-[0.75rem]">
          <img src="/assets/svg/Kenner.svg" />
          <p className="text-center text-[0.61863rem] text-bgGray500">홈</p>
        </div>
        <div className="tems-center flex flex-col justify-center gap-y-[0.29rem] pl-[0.53rem] pr-[0.25rem]">
          <img src="/assets/svg/dog.svg" />
          <p className="text-center text-[0.61863rem] text-bgGray500">커뮤니티</p>
        </div>
        <div className="tems-center flex flex-col justify-center gap-y-[0.29rem]">
          <img src="/assets/svg/paw.svg" />
          <p className="text-center text-[0.61863rem] text-bgGray500">산책 메이트</p>
        </div>
        <div className="tems-center flex flex-col justify-center gap-y-[0.29rem] pl-[0.78rem] pr-[0.69rem]">
          <img src="/assets/svg/chat(message).svg" />
          <p className="text-center text-[0.61863rem] text-bgGray500">채팅</p>
        </div>
        <div className="tems-center flex flex-col justify-center gap-y-[0.29rem] pl-[0.3rem]">
          <img src="/assets/svg/my.svg" />
          <p className="text-center text-[0.61863rem] text-bgGray500">마이페이지</p>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
