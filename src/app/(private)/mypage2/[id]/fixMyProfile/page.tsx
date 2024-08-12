"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfoType } from "@/types/auth.type";
import { defaultUserImg } from "@/components/DefaultImg";
import Swal from "sweetalert2";
import ButtonGroup from "../../_components/ButtonGroup";
import MyInput from "../../_components/MyInput";

type UserType = UserInfoType;

const FixMyProfile = () => {
  const [nickName, setNickName] = useState("");
  const [age, setAge] = useState("");
  const [mbti, setMbti] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(); //서버에 반영될 이미지 파일
  const [previewImage, setPreviewImage] = useState(""); // 이미지 변경 확인을 위해 보여줄 임시 url
  const [profileImageUrl, setProfileImageUrl] = useState(""); //서버에 반영될 이미지 URL
  const params = useParams();

  const supabase = createClient();
  const queryClient = useQueryClient();

  const id = params?.id || 0;

  const router = useRouter();

  function toMyPage() {
    router.push(`/mypage2/${user.id}`);
  }

  const ageOptions = [
    { value: "null", label: "미공개" },
    { value: "10대", label: "10대" },
    { value: "20대", label: "20대" },
    { value: "30대", label: "30대" },
    { value: "40대", label: "40대" },
    { value: "50대", label: "50대" },
    { value: "60대", label: "60대" },
    { value: "70대 이상", label: "70대 이상" }
  ];

  const getProfileData = async () => {
    const response = await fetch(`/api/mypage/${id}/myprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: user,
    isPending,
    isError
  } = useQuery({
    queryKey: ["user"],
    queryFn: getProfileData
  });

  const setDefaultProfile = () => {
    if (!user) {
      return;
    }
    setNickName(user.nickname);
    setMbti(user.mbti);
    setAge(user.age);
    setSelectedGender(user.gender);
    setIntroduction(user.introduction);
    setPreviewImage(user.profile_img);
    setProfileImageUrl(user.profile_img);
  };

  useEffect(() => {
    setDefaultProfile();
  }, [user]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    let image = window.URL.createObjectURL(file);
    setPreviewImage(image);
    setProfileImage(file);
  };

  const handleNickNameChange = (e: ChangeEvent<HTMLInputElement>) => setNickName(e.target.value);

  const handleMbtiChange = (e: ChangeEvent<HTMLInputElement>) => setMbti(e.target.value);

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAge(e.currentTarget.value);
  };

  const handleIntroductionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setIntroduction(e.target.value);

  const updateProfileWithSupabase = async ({
    nickname,
    profile_img,
    age,
    mbti,
    gender,
    introduction
  }: Pick<UserType, "nickname" | "profile_img" | "age" | "gender" | "mbti" | "introduction">) => {
    const response = await fetch(`/api/mypage/${id}/myprofile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, profile_img, age, mbti, gender, introduction })
    });
    return response.json();
  };

  const updateMutate = useMutation({
    mutationFn: updateProfileWithSupabase,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user"] });
    }
  });

  const submitChange = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const imageId = uuidv4();
    const FILE_NAME = "profile_image";
    const fileUrl = `${FILE_NAME}_${imageId}`;
    let uploadimgUrl = "";
    if (profileImage) {
      const imgData = await supabase.storage.from("profile_img").upload(fileUrl, profileImage);
      const imgUrl = supabase.storage.from("profile_img").getPublicUrl(imgData.data!.path);
      uploadimgUrl = imgUrl.data.publicUrl;
    } else {
      uploadimgUrl = user.profile_img;
    }
    setProfileImageUrl(uploadimgUrl);
    updateMutate.mutate({
      nickname: nickName,
      profile_img: uploadimgUrl,
      age: age,
      mbti: mbti,
      gender: selectedGender,
      introduction: introduction
    });

    Swal.fire({
      title: "success!",
      text: "프로필 변경이 완료되었습니다!"
    });
    toMyPage();
  };

  if (isPending) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isError) {
    return <div className="flex h-screen items-center justify-center">데이터 로딩 실패</div>;
  }

  return (
    <>
      <div className="flex w-full flex-col justify-center px-[24px]" onClick={(e) => e.stopPropagation()}>
        <div className="mt-[21px] flex flex-col items-center justify-center">
          <img
            className="h-[100px] w-[100px] rounded-xl bg-lime-300 object-cover"
            src={previewImage || defaultUserImg}
            alt=""
          />
          <div className="inline-flex px-[9px] py-[7px]">
            <button
              className="h-[26px] w-[82px] rounded-lg border border-[#C9C9C9] bg-[#CCCCCC] text-center text-xs font-normal leading-tight text-[#FFFFFF] drop-shadow-lg"
              type={"button"}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              사진 변경
            </button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="mt-[7px]">
          <MyInput
            label="닉네임"
            ref={null}
            id="changeNickName"
            placeholder="변경할 닉네임(최대 8자)"
            maxLength={8}
            defaultValue={user.nickname}
            onChange={handleNickNameChange}
          />
        </div>
        <div className="mt-[26px]">
          <ButtonGroup
            label="성별"
            buttonInfos={[
              { text: "남성", value: "남" },
              { text: "여성", value: "여" }
            ]}
            defaultValue={user.gender || ""}
            onChange={handleGenderChange}
          ></ButtonGroup>
          <div className="mt-[29px]">
            <MyInput
              label="MBTI"
              ref={null}
              id="changeMBTI"
              placeholder="MBTI"
              maxLength={4}
              defaultValue={user.mbti}
              onChange={handleMbtiChange}
            />
          </div>
          <div className="mt-[29px] flex flex-col">
            <label className="text-base font-normal leading-tight">자기소개</label>
            <textarea
              className="mt-2 h-[97px] w-full rounded-lg border-[0.5px] border-[#999999] p-3 text-[15px] font-normal leading-[20px]"
              placeholder="자기소개(최대 200자)"
              maxLength={200}
              defaultValue={user.introduction}
              onChange={handleIntroductionChange}
            />
          </div>
          <div className="py-[30px]">
            <button
              className="CCCCCC w-full rounded-lg bg-[#999999] py-3 text-center text-[16px] font-semibold text-[#FFFFFF]"
              onClick={submitChange}
            >
              수정완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FixMyProfile;
