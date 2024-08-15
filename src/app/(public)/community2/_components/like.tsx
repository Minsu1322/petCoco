import { useState } from "react";
import { LikeInfo } from "../[id]/page";
import { useEffect } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";

interface LikeProps {
  postId: string;
  likes: LikeInfo[];
  setLikes: (likes: LikeInfo[]) => void;
}

const Like: React.FC<LikeProps> = ({ postId, likes, setLikes }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const { user } = useAuthStore();
  useEffect(() => {
    const found = likes.find((f) => f.userid === user.id);
    if (found) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes]);

  const handleLikeClick = async () => {
    // 좋아요가 눌러져 있으면 console.log("좋아요 해제"), 좋아요가 눌러져 있지 않으면 console.log("좋아요");
    const supabase = createClient();
    if (liked) {
      // 좋아요 삭제
      await supabase.from("likes").delete().eq("userid", user.id).eq("postid", postId);
    } else {
      // 좋아요 등록
      await supabase.from("likes").insert({
        userid: user.id,
        postid: postId
      });
    }

    const { data: newLikes } = await supabase.from("likes").select("userid").eq("postid", postId);
    console.log(newLikes);
    setLikes(newLikes || []);
  };

  return (
    <div className="my-[2.62rem] flex w-full justify-center">
      <div
        className="flex h-[2.75rem] w-[7.5rem] justify-center gap-[0.5rem] rounded-[0.5rem] border border-[#D2CDF6] p-[0.5rem]"
        onClick={handleLikeClick}
      >
        {liked ? <img src="/assets/svg/heart4.svg" alt="heart4" /> : <img src="/assets/svg/heart2.svg" alt="heart2" />}
        <div className="text-[#D2CDF6]">{likes.length}</div>
      </div>
    </div>
  );
};

export default Like;
