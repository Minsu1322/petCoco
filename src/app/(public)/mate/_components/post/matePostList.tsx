import { MatePostAllType } from "@/types/mate.type";
import MatePostItem from "./matePostItem";

interface MatePostListProps {
  posts: MatePostAllType[];
}

const MatePostList = ({ posts }: MatePostListProps) => {
  return (
    <div className="mt-5 grid grid-cols-2 justify-items-center">
      {posts ? (
        posts.map((post) => <MatePostItem key={post.id} post={post}/>)
      ) : (
        <div> 현재 모집 중인 산책 메이트가 없습니다.</div>
      )}
    </div>
  );
};

export default MatePostList;
