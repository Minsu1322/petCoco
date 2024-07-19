import { MatePostType } from "@/types/mate.type"
import MatePostItem from "./MatePostItem"

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