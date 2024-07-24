"use client";

import { useCallback, useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchData, setSearchData] = useState<any>([]);

  const handleSearchPosts = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`/api/mate/post?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchData(data); 
  
      return data;
    } catch (err) {
      console.error(err);
    }
  }, [searchQuery, setSearchData]);

  //console.log('검색결과', searchData);
  

  return (
    <div className="mb-5 flex justify-center">
      <form onSubmit={handleSearchPosts} className="flex w-[300px] flex-row items-center rounded-full border p-1">
        <input type="text" className="w-[270px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button type="submit" className="ml-2">
          🔍
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
