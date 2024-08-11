import React from "react";
import { RiSearch2Line } from "react-icons/ri";

type SearchBarProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  value?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({ onSubmit, value, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="rounded-full border border-mainColor mb-[0.75rem]">
      <form onSubmit={onSubmit} className="flex px-[1.5rem] py-[0.75rem]">
        <input
          type="text"
          className="mr-[1.12rem] w-full placeholder-[#D2CDF6] focus:outline-none text-[0.875rem]"
          placeholder="검색어를 입력하세요."
          value={value}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* setSearchTerm */}
        <button type="submit" className="">
          <img src="/assets/svg/search.svg" />
        </button>
      </form>
    </div>
  );
  
};

export default SearchBar;
