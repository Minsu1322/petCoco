import { MatePostType } from "@/types/mate.type";
import Link from "next/link";

interface MatePostItemPorps {
  post: MatePostType;
}

const MatePostItem = ({ post }: MatePostItemPorps) => {

  return (
    <Link href={`/mate/posts/${post.id}`} className="flex flex-col mb-5 w-[500px] bg-blue-100 p-4">
      <div className="flex flex-row justify-between">
        
        <p>{post.title}</p>
        <p>{post.created_at}</p>
        {/* TODO: 날짜 변환시키기 현재 날짜로~ */}
      </div>
      <p>{post.content}</p>
    </Link>
  );
};

export default MatePostItem;
