import Link from "next/link";
import PostForm from "../_components/postForm";

const MatePost = ({ params }: { params: { id: string } }) => {
  return (
    <div className="px-2">
      <Link href='/mate'>
        <div className="mt-3 flex h-10 w-20 items-center justify-center rounded-md bg-mainColor p-1 cursor-pointer">뒤로가기</div>
      </Link>
      <PostForm />
    </div>
  );
};

export default MatePost;
