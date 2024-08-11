import { Switch } from "@nextui-org/react";
import Chip from "@/components/Chip";

interface PostListFilterTabProps {
  isCurrentPosts: boolean;
  handleToggleAllPosts: () => void;
  handleDateSort: () => void;
  handleDistanceSort: () => void;
  handleNewSort: () => void;
  sortBy: string;
}

const PostListFilterTab = ({
  sortBy,
  handleToggleAllPosts,
  handleDateSort,
  handleDistanceSort,
  handleNewSort,
  isCurrentPosts
}: PostListFilterTabProps) => {
  return (
    <div className="z-40 ml-[1.5rem] flex w-max gap-x-[0.62rem]">
      <Chip
        text="전체"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.5rem] text-[1.125rem] font-semibold ${
          sortBy === "all" ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        // onClick={handleAllSort}
      ></Chip>
      <Chip
        text="거리순"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.5rem] text-[1.125rem] ${
          sortBy === "distance" ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleDistanceSort}
      ></Chip>
      <Chip
        text="모집중"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.5rem] text-[1.125rem] ${
          isCurrentPosts ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleToggleAllPosts}
      ></Chip>
      <Chip
        text="최신순"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.5rem] text-[1.125rem] ${
          sortBy === "new" ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleNewSort}
      ></Chip>
      <Chip
        text="마감 임박순"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.5rem] text-[1.125rem] ${
          sortBy === "recruitment_end" ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleDateSort}
      ></Chip>
    </div>
  );
};

export default PostListFilterTab;
