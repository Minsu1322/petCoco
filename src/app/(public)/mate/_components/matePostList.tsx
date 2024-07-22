import { MatePostFullType } from "@/types/mate.type"
import MatePostItem from './matePostItem';



interface MatePostListProps {
  posts: MatePostFullType[] | undefined;
}

const MatePostList = ({posts}: MatePostListProps) => {
  return (
    <div className="grid grid-cols-2 justify-items-center mt-5">
      {posts ? posts.map((post) => <MatePostItem key={post.id} post={post} />) : (<div> 현재 모집 중인 산책 메이트가 없습니다.</div>)}
    </div>
  )
}

export default MatePostList