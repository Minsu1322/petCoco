"use client";
import { createClient } from "@/supabase/client";
import React, { use, useEffect, useState } from "react";
const supabase = createClient();
const MAX_POST_LENGTH = 125; // 125자
interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}
export default function CreatePostPage() {
  const userId = "3841c2cf-d6b6-4d60-8b8d-c483f8d9bac0";
  // 게시글 내용을 저장하는 상태 변수와, 이 변수를 갱신하는 함수를 선언합니다.
  const [post, setPost] = useState("");
  // 게시글 길이를 저장하는 상태 변수와, 이 변수를 갱신하는 함수를 선언합니다.
  const [postLength, setPostLength] = useState(0);
  // 게시글을 작성할 수 있는지 여부를 저장하는 상태 변수와, 이 변수를 갱신하는 함수를 선언합니다.
  const [isPostable, setIsPostable] = useState(false);
  // posts 상태를 Post 타입의 배열로 선언합니다.
  const [posts, setPosts] = useState<Post[]>([]);
  // 게시글 내용이 변경될 때 호출되는 함수입니다.
  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 이벤트 타겟에서 입력된 값을 가져옵니다.
    const { value } = e.target;
    // 게시글 상태를 갱신합니다.
    setPost(value);
    // 게시글 길이 상태를 갱신합니다.
    setPostLength(value.length);
    // 게시글 길이에 따라 게시가 가능한지 여부를 갱신합니다.
    setIsPostable(value.length > 0 && value.length <= MAX_POST_LENGTH);
  };
  // 게시글 작성 버튼을 클릭했을 때 호출되는 함수입니다.
  // const handlePostSubmit = async () => {
  //   // 게시가 불가능한 경우 함수 실행을 종료합니다.
  //   if (!isPostable) return;
  //   const { error } = await supabase.from("posts").insert([{ content: post, user_id: userId }]);
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     setPost("");
  //     setPostLength(0);
  //     setIsPostable(false);
  //     fetchPosts();
  //   }
  // };
  // 게시글 데이터를 가져오는 함수입니다.
  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) {
      console.log(error);
    } else {
      // setPosts(data);
    }
    const handlepostUpdate = async (id: string, newContent: string) => {
      const { data, error } = await supabase.from("posts").update({ content: newContent }).eq("id", id);
      if (error) {
        console.log(error);
      } else {
        fetchPosts();
      }
      const handlePostDelete = async (id: string) => {
        const { data, error } = await supabase.from("posts").delete().eq("id", id);
        if (error) {
          console.log(error);
        } else {
          fetchPosts();
        }
      };
      useEffect(() => {
        fetchPosts();
      }, []);
      // 컴포넌트의 UI를 반환합니다.
      return (
        <div>
          <h1>테스트</h1>
          {/* 텍스트 영역입니다. 사용자가 게시글을 입력할 수 있습니다. */}
          <textarea value={post} onChange={handlePostChange} placeholder="게시글을 작성해주세요." />
          {/* 게시글 길이를 표시합니다. */}
          <span>
            {postLength} / {MAX_POST_LENGTH}
          </span>
          {/* 게시 버튼입니다. 게시가 가능할 때만 활성화됩니다. */}
          {/* <button onClick={handlePostSubmit} disabled={!isPostable}> */}
          게시
          {/* </button> */}
        </div>
      );
    };
  };
  return <>dd</>;
  {
    /* <ul>
          {posts.map((post) => (
            // <li key={post.id}>
            //   <p>{post.content}</p>
            //   <button onClick={() => handlepostUpdate(post.id, "수정된 내용")}>수정</button>
            //   <button onClick={() => handlePostDelete(post.id)}>삭제</button>{" "}
            // </li>
          ))}
        </ul> */
  }
}
