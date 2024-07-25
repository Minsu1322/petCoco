"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfoType } from "@/types/auth.type";

type ModalProps = {
  clickModal: () => void;
};
type UserType = UserInfoType;

const ChangeProfileModal = ({ clickModal }: ModalProps) => {
  const [nickName, setNickName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(); //서버에 반영될 이미지 파일
  const [previewImage, setPreviewImage] = useState(""); // 이미지 변경 확인을 위해 보여줄 임시 url
  //const [profileImageUrl, setProfileImageUrl] = useState("");

  const params = useParams();
  const id = params.id;
  const supabase = createClient();
  const queryClient = useQueryClient();

  // const updateProfileNickNameWithSupabase = async (newName: string, id: string) => {
  //   const { data: result } = await supabase.from("users").update({ nickname: newName }).eq("id", id);
  //   return result;
  // };

  // const updateProfileImgWithSupabase = async (newImg: string, id: string) => {
  //   const { data: result } = await supabase.from("users").update({ profile_img: newImg }).eq("id", id);
  //   return result;
  // };

  const updateProfileWithSupabase = async ({ nickname, profile_img }: Pick<UserType, "nickname" | "profile_img">) => {
    const response = await fetch(`/api/mypage/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, profile_img })
    });
    console.log({ nickname, profile_img });
    return response.json();

    //const { data: result } = await supabase.from("users").update(newData).eq("id", id);
    //return result;
  };

  //let updatingData = user;

  const updateMutate = useMutation({
    mutationFn: updateProfileWithSupabase,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user"] });
    }
  });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    let image = window.URL.createObjectURL(file);
    setPreviewImage(image);
    setProfileImage(file);
  };

  const handleNickNameChange = (e: ChangeEvent<HTMLInputElement>) => setNickName(e.target.value);

  const submitChange = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const imageId = uuidv4();
    const FILE_NAME = "profile_image";
    const fileUrl = `${FILE_NAME}_${imageId}`;

    // await updateProfileNickNameWithSupabase(nickName, user.id);
    // //유저 닉네임 변경
    // if (profileImage === null) {
    //   return;
    // } else if (profileImage) {
    //   const { data, error } = await supabase.storage.from("profile_img").upload(fileUrl, profileImage);
    //   const publicUrl = supabase.storage.from("profile_img").getPublicUrl(`${data!.path}`);

    //   await updateProfileImgWithSupabase(publicUrl.data.publicUrl, user.id);
    // } //유저 프로필 사진 변경

    // if (nickName !== user.nickname) {
    //   updatingData.nickname = nickName;
    // }
    let profileImageUrl = "";
    if (profileImage) {
      const imgData = await supabase.storage.from("profile_img").upload(fileUrl, profileImage);
      const imgUrl = supabase.storage.from("profile_img").getPublicUrl(imgData.data!.path);
      profileImageUrl = imgUrl.data.publicUrl;
    }
    console.log(nickName);
    console.log(profileImageUrl);

    updateMutate.mutate({ nickname: nickName, profile_img: profileImageUrl });

    alert("프로필 변경이 성공적으로 완료되었습니다!");

    clickModal();
  };

  return (
    <div
      className="fixed left-0 top-0 z-40 my-auto flex h-full w-full items-center justify-center bg-[#00000066]/40"
      onClick={clickModal}
    >
      <div
        className="my-auto flex h-[700px] w-[500px] flex-col items-center justify-center rounded-[30px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="mt-5 text-2xl font-bold">프로필 수정</h1>
        <div className="my-auto mt-5 flex max-h-[400px] max-w-[300px] flex-col items-center justify-center">
          <img className="max-h-[200px] max-w-[200px] object-cover" src={previewImage} alt="" />
          <br></br>
          <button
            className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
            type={"button"}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            이미지 변경하기
          </button>
          <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </div>
        <input
          className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
          type="text"
          placeholder="변경할 닉네임"
          onChange={handleNickNameChange}
        />
        <div className="mt-5 flex gap-[15px]">
          <button
            className="rounded border border-[#C9C9C9] bg-[#D1D1D1] px-4 py-2 text-center font-bold text-white"
            onClick={clickModal}
          >
            뒤로가기
          </button>
          <button
            className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
            onClick={submitChange}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfileModal;
