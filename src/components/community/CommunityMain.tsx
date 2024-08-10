import Link from "next/link";
import { PostsResponse } from "@/types/mainPageTypes/MainPageTypes";
import { fetchPosts } from "@/app/utils/mainPageFetch";
import { useQuery } from "@tanstack/react-query";

// 메인커뮤니티 글 호출 컴포넌트

interface MainPageRecentPostsProps {
  postCount: number;
}

const RecentPosts: React.FC<MainPageRecentPostsProps> = ({ postCount }) => {
  const { data, isLoading, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <div className="w-full rounded-lg border border-gray-300 bg-white p-4 shadow-md">
      {data?.data.slice(0, postCount).map((post, index) => (
        <div key={post.id} className={`mb-3 w-full ${index !== 0 ? "border-t border-gray-200 pt-3" : ""}`}>
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src={post.users.profile_img} alt="User Profile" className="h-8 w-8 rounded-md" />
                <div>
                  <div className="cursor-pointer text-black hover:underline">{post.title}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{post.users.nickname}</span>
                    <span>-</span>
                    <span>댓글 {post.comments.length}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {post.post_imageURL[0] && (
                  <img src={post.post_imageURL[0]} alt="Post Image" className="h-12 w-12 rounded-md object-cover" />
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;
