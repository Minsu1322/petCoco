import { MatePostType } from "@/types/mate.type"
import MatePostItem from './matePostItem';



interface MatePostListProps {
  posts: MatePostType[]
}

const MatePostList = ({posts}: MatePostListProps) => {
  return (
    <div>
      {posts.map((post) => <MatePostItem key={post.id} post={post} />)}
    </div>
  )
}

export default MatePostList