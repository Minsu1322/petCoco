import React from "react";
import { RiSearch2Line } from "react-icons/ri";

type SearchBarProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  value?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({onSubmit, value, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="mb-5 flex flex-col">
      <p className="mt-3 text-lg text-gray-500">검색</p>
      <form onSubmit={onSubmit} className="mt-3 flex h-12 w-full flex-row items-center rounded-full border p-1">
        <input
          type="text"
          className="ml-3 w-full focus:outline-none"
          value={value}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* setSearchTerm */}
        <button type="submit" className="mx-4">
          <RiSearch2Line />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
