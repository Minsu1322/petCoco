import { Switch } from "@nextui-org/react";
import Chip from "@/components/Chip";

interface PostListFilterTabProps {
  // isCurrentPosts: boolean;
  handleAllPosts: () => void;
  handleRecruiting: () => void;
  handleDateSort: () => void;
  handleDistanceSort: () => void;
  handleNewSort: () => void;
  sortBy: string;
  defaultSort: string;
}

const PostListFilterTab = ({
  sortBy,
  defaultSort,
  handleAllPosts,
  handleRecruiting,
  handleDateSort,
  handleDistanceSort,
  handleNewSort
}: PostListFilterTabProps) => {
  const isSelected = (chipSortBy: string) => {
    return sortBy === chipSortBy || (sortBy === "" && chipSortBy === defaultSort);
  };

  return (
    <div className="z-40 ml-[1.5rem] flex w-max gap-x-[0.62rem]">
      <Chip
        text="전체"
        className={`cursor-pointer rounded-[2.25rem] px-[0.75rem] py-[0.2rem] text-[1.125rem] ${
          isSelected("all") ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleAllPosts}
      ></Chip>
      <Chip
        text="거리순"
        className={`cursor-pointer rounded-[2.25rem] px-[0.75rem] py-[0.2rem] text-[1.125rem] ${
          isSelected("distance") ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleDistanceSort}
      ></Chip>
      <Chip
        text="모집중"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.2rem] text-[1.125rem] ${
          isSelected("recruiting") ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleRecruiting}
      ></Chip>
      <Chip
        text="최신순"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.2rem] text-[1.125rem] ${
          isSelected("new") ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleNewSort}
      ></Chip>
      <Chip
        text="마감 임박순"
        className={`cursor-pointer rounded-full px-[0.75rem] py-[0.2rem] text-[1.125rem] ${
          isSelected("recruitment_end") ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"
        }`}
        onClick={handleDateSort}
      ></Chip>
    </div>
  );
};

export default PostListFilterTab;
