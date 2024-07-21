import { MatePostFullType } from "@/types/mate.type"
import MatePostItem from './matePostItem';



interface MatePostListProps {
  posts: MatePostFullType[]
}

const MatePostList = ({posts}: MatePostListProps) => {
  return (
    <div className="grid grid-cols-2 justify-items-center mt-5">
      {posts.map((post) => <MatePostItem key={post.id} post={post} />)}
    </div>
  )
}

export default MatePostList