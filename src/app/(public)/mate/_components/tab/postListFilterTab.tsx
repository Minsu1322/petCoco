import { Switch } from "@nextui-org/react";
import Chip from "@/components/Chip";

interface PostListFilterTabProps {
  isCurrentPosts: boolean;
  handleToggleAllPosts: () => void;
  handleDateSort: () => void;
  handleDistanceSort: () => void;
}

const PostListFilterTab = ({isCurrentPosts, handleToggleAllPosts, handleDateSort, handleDistanceSort}: PostListFilterTabProps) => {

  return (
    <div>
      <div className="flex gap-x-[0.75rem] z-40 ml-[1.62rem]">
        <Chip text="거리순" className="bg-gray-200 py-[0.4375rem] px-[0.625rem] rounded-full text-[12px] font-semibold" onClick={handleDistanceSort}></Chip>
        <Chip text="모집중" className="bg-gray-200 py-[0.4375rem] px-[0.625rem] rounded-full text-[12px] font-semibold" onClick={handleToggleAllPosts}></Chip>
        <Chip text="최신순" className="bg-gray-200 py-[0.4375rem] px-[0.625rem] rounded-full text-[12px] font-semibold"></Chip>
        <Chip text="마감 임박순" className="bg-gray-200 py-[0.4375rem] px-[0.625rem] rounded-full text-[12px] font-semibold" onClick={handleDateSort}></Chip>
      </div>
    </div>
  );
};

export default PostListFilterTab;
