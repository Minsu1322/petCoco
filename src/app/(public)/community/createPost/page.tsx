import React, { useState } from "react";

const MAX_POST_LENGTH = 125; // 125자

export default function CreatePostPage() {
  // 게시글 내용을 저장하는 상태 변수와, 이 변수를 갱신하는 함수를 선언합니다.
  const [post, setPost] = useState("");

  // 게시글 길이를 저장하는 상태 변수와, 이 변수를 갱신하는 함수를 선언합니다.
  const [postLength, setPostLength] = useState(0);

  // 게시글을 작성할 수 있는지 여부를 저장하는 상태 변수와, 이 변수를 갱신하는 함수를 선언합니다.
  const [isPostable, setIsPostable] = useState(false);

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
  const handlePostSubmit = () => {
    // 게시가 불가능한 경우 함수 실행을 종료합니다.
    if (!isPostable) return;

    // 여기에 게시글 작성 API를 호출하는 코드를 추가합니다.
  };

  // 컴포넌트의 UI를 반환합니다.
  return (
    <div>
      {/* 텍스트 영역입니다. 사용자가 게시글을 입력할 수 있습니다. */}
      <textarea value={post} onChange={handlePostChange} placeholder="게시글을 작성해주세요." />
      {/* 게시글 길이를 표시합니다. */}
      <span>
        {postLength} / {MAX_POST_LENGTH}
      </span>
      {/* 게시 버튼입니다. 게시가 가능할 때만 활성화됩니다. */}
      <button onClick={handlePostSubmit} disabled={!isPostable}>
        게시
      </button>
    </div>
  );
}
