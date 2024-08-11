import Link from "next/link";
import { PostsResponse } from "@/types/mainPageTypes/MainPageTypes";
import { fetchPosts } from "@/app/utils/mainPageFetch";
import { useQuery } from "@tanstack/react-query";

// 메인커뮤니티 글 호출 컴포넌트

interface MainPageRecentPostsProps {
  postCount: number;
}

const categoryStyles: { [key: string]: string } = {
  자유: "bg-[#D1FFA2] text-[#8E6EE8]",
  자랑: "bg-[#B1D0FF] text-[#8E6EE8]",
  고민: "bg-[#D2CDF6] text-[#8E6EE8]",
  신고: "bg-[#FFB9B9] text-[#8E6EE8]"
  // 추가적인 카테고리가 필요한 경우 여기에 추가 가능
};

const RecentPosts: React.FC<MainPageRecentPostsProps> = ({ postCount }) => {
  const { data, isLoading, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <div className="w-full rounded-lg bg-white p-2">
      {data?.data.slice(0, postCount).map((post, index) => (
        <div key={post.id} className={`mb-1 w-full ${index !== 0 ? "border-t border-gray-200 pt-3" : ""}`}>
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
            <div className="flex items-center space-x-2">
              <span
                className={`flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2 py-1 text-sm font-bold ${
                  categoryStyles[post.category] || "bg-gray-200 text-black"
                }`}
              >
                {post.category}
              </span>
              <div className="min-w-0 flex-grow">
                <div className="cursor-pointer truncate text-black hover:underline">
                  {post.title.length > 20 ? `${post.title.slice(0, 20)}...` : post.title}
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#8E6EE8]">
                  <span>{post.users.nickname}</span>
                  <span>-</span>
                  <span>댓글 {post.comments.length}</span>
                </div>
              </div>
              {post.post_imageURL[0] && (
                <img
                  src={post.post_imageURL[0]}
                  alt="Post Image"
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;
