import { MatePostType } from "@/types/mate.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DetailMatePostProps {
  post: MatePostType;
}



const DetailMatePost = ({ post }: DetailMatePostProps) => {
  const queryClient = useQueryClient();
  const userId = "3841c2cf-d6b6-4d60-8b8d-c483f8d9bac0";
  const router = useRouter();

  // TODO: 작성자에게만 이 버튼이 보이도록 수정
  const deletePost = async (id: string) => {
    console.log(id, post.id, userId, post.user_id)
    if (id !== post.id ) {
      return;
    }

    if (userId !== post.user_id) {
      alert("작성자만 접근이 가능합니다.");
      return;
    }

    if (confirm("현재 게시글을 삭제하시겠어요?")) {
      try {
        const response = await fetch(`/api/mate/post/${post.id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        router.replace("/mate");

      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matePosts'] });
    }
  });

  const handleDeletePost = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <p>{post.title}</p>
      <p className="text-gray-400">{post.created_at}</p>
      <p>{post.content}</p>
      <div className="mt-5 flex flex-row gap-10">
        <button className="w-20 bg-blue-500" onClick={() => handleDeletePost(post.id)}>
          삭제
        </button>
        <button className="w-20 bg-blue-500">수정</button>
      </div>
    </div>
  );
};

export default DetailMatePost;
