import { Switch } from "@nextui-org/react";

interface PostListFilterTabProps {
  isCurrentPosts: boolean;
  handleToggleAllPosts: () => void;
  handleDateSort: () => void;
  handleDistanceSort: () => void;
}

const PostListFilterTab = ({isCurrentPosts, handleToggleAllPosts, handleDateSort, handleDistanceSort}: PostListFilterTabProps) => {

  return (
    <div>
      <div className="mb-3 flex flex-row justify-between z-40 ">
        <Switch defaultSelected size="sm" onClick={handleToggleAllPosts}>
          <p className="cursor-pointer text-sm sm:text-base">{isCurrentPosts ? "모집 완료된 메이트도 보기" : "모집 중인 메이트만 보기"}</p>
        </Switch>
        <div className="flex items-center gap-x-2">
          <div className="cursor-pointer text-sm sm:text-base" onClick={handleDateSort}>마감 임박순</div>
          <p className="cursor-pointer text-sm sm:text-base">|</p>
          <div className="cursor-pointer text-sm sm:text-base" onClick={handleDistanceSort}>가까운 순</div>
        </div>
      </div>
    </div>
  );
};

export default PostListFilterTab;
