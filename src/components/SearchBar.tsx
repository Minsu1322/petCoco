import React from "react";
import Image from "next/image";

type SearchBarProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  value?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({ onSubmit, value, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="mb-[0.75rem] w-full rounded-full border border-mainColor">
      <form onSubmit={onSubmit} className="flex px-[1.5rem] py-[0.75rem]">
        <input
          type="text"
          className="mr-[1.12rem] w-full text-[0.875rem] placeholder-[#D2CDF6] focus:outline-none"
          placeholder="검색어를 입력하세요."
          value={value}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* setSearchTerm */}
        <button type="submit" className="">
          <div className="w-[1.5rem] h-[1.5rem]">
            <Image src="/assets/svg/search.svg" alt="검색 아이콘" width={24} height={24} className="w-full h-full object-cover" />
          {/* <img src="/assets/svg/search.svg" /> */}
          </div>
        </button>
      </form>
    </div>
  );
  
};

export default SearchBar;
