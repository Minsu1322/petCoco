import { useState } from "react";

function CategorySelectButton() {
  const [selectedTab, setSelectedTab] = useState("전체");

  const tabs = ["전체", "인기글", "자유게시판", "희귀동물", "자랑하기", "고민있어요"];

  return (
    <div className="mb-8 flex justify-center space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`rounded-full px-4 py-2 hover:bg-gray-300 ${
            selectedTab === tab ? "border-2 border-[#67C047] bg-gray-200" : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default CategorySelectButton;
