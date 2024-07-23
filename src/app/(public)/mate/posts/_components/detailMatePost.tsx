"use client";

import { MateNextPostType, MatePostFullType } from "@/types/mate.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { locationStore } from "@/zustand/locationStore";

interface DetailMatePostProps {
  post: MatePostFullType;
}

// 동적 로딩 설정
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/mapDetail"), { ssr: false });
const DynamicMapEditComponent = dynamic(() => import("@/app/(public)/mate/_components/mapEdit"), { ssr: false });

const DetailMatePost = ({ post }: DetailMatePostProps) => {
  const queryClient = useQueryClient();
  const userId = "3841c2cf-d6b6-4d60-8b8d-c483f8d9bac0";
  const router = useRouter();

  const time = post.dateTime?.split("T")[1].split(":");
  const convertPeriod = time && (Number(time[0]) < 12 ? "오전" : "오후");
  const convertHour = time && (Number(time[0]) % 12 || 12);
  const convertMin = time && time[1];

  const { position, setPosition } = locationStore();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [male_female, setMale_female] = useState<string>("");
  const [neutered, setNeutered] = useState<boolean | null>(null);
  const [numbers, setNumbers] = useState<string>("");
  const [members, setMembers] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [characteristics, setCharacteristics] = useState<string>("");

  const [isEditing, setIstEditting] = useState<boolean>(false);

  //console.log(post);

  const updatePost: Omit<MateNextPostType, "recruiting"> = {
    title,
    content,
    position,
    dateTime,
    numbers,
    neutered,
    male_female,
    members,
    size,
    weight,
    characteristics
  };

  // TODO: 작성자에게만 이 버튼이 보이도록 수정
  const deletePost = async (id: string) => {
    console.log(id, post.id, userId, post.user_id);
    if (id !== post.id) {
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

  // TODO: 게시글 수정 기능 구현
  const editPost = async (id: string) => {
    if (confirm("현재 게시글을 수정하시겠어요?")) {
      try {
        const response = await fetch(`/api/mate/post/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatePost)
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

  const togglePost = async (id: string) => {
    if (confirm("모집 상태를 변경하시겠어요?")) {
      try {
        const response = await fetch(`/api/mate/post/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ recruiting: !post.recruiting })
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
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
    }
  });

  const editMutation = useMutation({
    mutationFn: (id: string) => editPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      alert("수정이 완료되었습니다.");
      setIstEditting(false);
    },
    onError: (error) => {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => togglePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
    }
  });

  const handleDeletePost = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleUpdatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    editMutation.mutate(post.id);
  };

  const handleEditPost = () => {
    setIstEditting(true);
  };

  const handleTogglePost = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleResetEditPost = () => {
    setIstEditting(false);
    setPosition({
      center: {
        lat: Number(post.position?.center?.lat),
        lng: Number(post.position?.center?.lng)
      },
      isLoading: false
    });
  };

  useEffect(() => {
      setTitle(post.title || "");
      setContent(post.content || "");
      setDateTime(post.dateTime || "");
      setMale_female(post.male_female || "");
      setNeutered(post.neutered || null);
      setNumbers(post.numbers || "");
      setMembers(post.members || "");
      setSize(post.size || "");
      setWeight(post.weight || "");
      setCharacteristics(post.characteristics || "");
  }, []);

  return (
    <div>
      <Link href="/mate">
        <div className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1">
          뒤로가기
        </div>
      </Link>
      {isEditing ? (
        <form onSubmit={handleUpdatePost} className="flex flex-col">
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder=" 제목을 입력해 주세요"
              className="w-[300px] rounded-md border border-gray-300"
            />
            <div>
              <DynamicMapEditComponent
                center={{
                  lat: Number(post.position?.center?.lat),
                  lng: Number(post.position?.center?.lng)
                }}
                isEditing={true}
                dbPosition={{
                  lat: Number(post.position?.center?.lat),
                  lng: Number(post.position?.center?.lng)
                }}
              />
            </div>
            <div className="flex flex-row gap-x-4">
              <label htmlFor="dateTime">산책 날짜 및 시간</label>
              <input
                type="datetime-local"
                id="dateTime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-x-2">
              <p>모집인원 수 : </p>
              <input type="text" className="border" value={members} onChange={(e) => setMembers(e.target.value)} />명
            </div>
            <div className="mt-3 flex flex-col gap-x-5">
              <div className="flex flex-row gap-x-2">
                <label htmlFor="number">반려동물 수</label>
                <select
                  name="number of animals"
                  id="number"
                  className="w-12 border border-black"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className="flex flex-row gap-x-2">
                <p>성별 : </p>
                <input
                  type="checkbox"
                  name="male_female"
                  value="female"
                  onChange={(e) => setMale_female(e.target.value)}
                  checked={male_female === "female"}
                />
                <label htmlFor="male_female">암컷</label>
                <input
                  type="checkbox"
                  name="male_female"
                  value="male"
                  onChange={(e) => setMale_female(e.target.value)}
                  checked={male_female === "male"}
                />
                <label htmlFor="male_female">수컷</label>
              </div>
              <div className="flex flex-row gap-x-3">
                <p>중성화 여부 : </p>
                <input
                  type="checkbox"
                  name="neutered"
                  value="true"
                  onChange={() => setNeutered(true)}
                  checked={neutered === true}
                />
                <label>네</label>
                <input
                  type="checkbox"
                  name="neutered"
                  value="false"
                  onChange={() => setNeutered(false)}
                  checked={neutered === false}
                />
                <label>아니오</label>
              </div>
              <div className="flex flex-row gap-x-2">
                <p>크기 : </p>
                {/* TODO: 적당한 이름 찾기,, */}
                <input
                  type="checkbox"
                  name="size"
                  value="소형견"
                  onChange={(e) => setSize(e.target.value)}
                  checked={size === "소형견"}
                />
                <label htmlFor="size">소형견</label>
                <input
                  type="checkbox"
                  name="size"
                  value="중형견"
                  onChange={(e) => setSize(e.target.value)}
                  checked={size === "중형견"}
                />
                <label htmlFor="size">중형견</label>
                <input
                  type="checkbox"
                  name="size"
                  value="대형견"
                  onChange={(e) => setSize(e.target.value)}
                  checked={size === "대형견"}
                />
                <label htmlFor="size">대형견</label>
              </div>
              <div className="flex flex-row gap-x-2">
                <p>무게 : </p>
                <input type="text" className="border" value={weight} onChange={(e) => setWeight(e.target.value)} /> kg
              </div>
              <div className="flex flex-row gap-x-2">
                <p>성격 및 특징 : </p>
                <input
                  type="text"
                  className="border"
                  value={characteristics}
                  onChange={(e) => setCharacteristics(e.target.value)}
                />
              </div>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                placeholder=" 글을 작성해 주세요."
                className="mt-5 h-full w-[500px] resize-none rounded-md border border-gray-300 p-1"
              ></textarea>
              <p className="mt-1">🐾 반려동물이 2마리 이상인 경우 본문에 추가로 정보를 기재해 주세요.</p>
            </div>
          </div>
          <div className="flex flex-row gap-x-3">
            <button
              className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
              type="submit"
            >
              수정 완료
            </button>
            <button
              className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
              type="button"
              onClick={handleResetEditPost}
            >
              수정 취소
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p>{post.title}</p>
          <p>{post.content}</p>
          <p>모집인원 수 : {post.members}명</p>
          <p>날짜 : {post.dateTime?.split("T")[0]}</p>
          <p>시간 : {`${convertPeriod} ${convertHour}시 ${convertMin}분`}</p>
          <div>
            <DynamicMapComponent
              center={{
                lat: Number(post.position?.center?.lat),
                lng: Number(post.position?.center?.lng)
              }}
            />
          </div>
          <div className="mt-5">
            <p className="text-xl font-semibold">반려동물 정보 🐶</p>
            <div className="w-48 rounded-md bg-gray-100 p-2">
              <p>반려동물 수 : {post.numbers}</p>
              <p>성별 : {post.male_female}</p>
              <p>중성화 여부 : {post.neutered === true ? "예" : "아니오"}</p>
              <p>크기 : {post.size}</p>
              <p>무게 : {post.weight} kg</p>
            </div>
          </div>
          <div className="mt-5 flex flex-row gap-10">
            <button
              className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
              onClick={() => handleDeletePost(post.id)}
            >
              삭제
            </button>
            <button
              className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
              onClick={handleEditPost}
            >
              수정
            </button>
            <button
              className="mt-3 flex h-10 w-28 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
              onClick={() => handleTogglePost(post.id)}
            >
              모집상태 변경
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailMatePost;
