"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfoType } from "@/types/auth.type";
import { Input, Textarea } from "@nextui-org/input";
import { defaultUserImg } from "@/components/DefaultImg";
import Swal from "sweetalert2";

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

  function toMyProfile() {
    router.push(`/mypage/${user.id}/myprofile`);
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

  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedGender(e.currentTarget.value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.currentTarget.value);
    setAge(e.currentTarget.value);
  };

  const handleIntroductionChange = (e: ChangeEvent<HTMLInputElement>) => setIntroduction(e.target.value);

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
    toMyProfile();
  };

  if (isPending) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isError) {
    return <div className="flex h-screen items-center justify-center">데이터 로딩 실패</div>;
  }

  return (
    <div className="flex w-full justify-center" onClick={(e) => e.stopPropagation()}>
      <div className="w-full sm:w-[600px]">
        <h1 className="mt-5 text-center font-bold sm:text-2xl">프로필 수정</h1>
        <div className="my-auto mt-5 flex flex-col items-center justify-center sm:max-h-[400px]">
          <img
            className="max-h-[170px] max-w-[170px] rounded bg-lime-300 object-cover"
            src={previewImage || defaultUserImg}
            alt=""
          />
          <br></br>
          <button
            className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center font-semibold text-black sm:text-[16px]"
            type={"button"}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            이미지 변경하기
          </button>
          <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </div>
        <br />
        <div>
          <p className="font-bold">닉네임</p>
          <Input
            className="mt-2"
            type="text"
            placeholder="변경할 닉네임(최대 8자)"
            maxLength={8}
            defaultValue={user.nickname}
            onChange={handleNickNameChange}
          />
          <br />
          <p className="font-bold">연령대</p>
          <select
            className="mt-2 h-[40px] rounded-md bg-gray-100 px-2"
            onChange={handleAgeChange}
            value={age}
            defaultValue={user.age}
          >
            {ageOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <br />
          <p className="mt-5 font-bold">성별</p>
          <div className="mt-2 flex gap-[10px] pl-2">
            <input
              type="checkbox"
              name="gender"
              value="남"
              onChange={handleGenderChange}
              checked={selectedGender === "남"}
            />{" "}
            남
            <br />
            <input
              type="checkbox"
              name="gender"
              value="여"
              onChange={handleGenderChange}
              checked={selectedGender === "여"}
            />{" "}
            여
          </div>
          <br />
          <p className="font-bold">MBTI</p>
          <Input
            className="mt-2"
            type="text"
            placeholder="MBTI"
            maxLength={4}
            defaultValue={user.mbti}
            onChange={handleMbtiChange}
          />
          <br />
          <p className="font-bold">자기소개</p>
          <Textarea
            className="mt-2"
            placeholder="자기소개(최대 200자)"
            maxLength={200}
            defaultValue={user.introduction}
            onChange={handleIntroductionChange}
          />
        </div>
        <div className="mb-20 mt-10 flex flex-col gap-[15px] sm:flex-row">
          <button
            className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
            onClick={submitChange}
          >
            변경하기
          </button>
          <button
            className="rounded border border-[#C9C9C9] bg-[#D1D1D1] px-4 py-2 text-center font-bold text-black"
            onClick={toMyProfile}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FixMyProfile;
