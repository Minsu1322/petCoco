"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfoType } from "@/types/auth.type";
import { defaultUserImg } from "@/components/DefaultImg";
import Swal from "sweetalert2";
import Image from "next/image";
import LoadingComponent from "@/components/loadingComponents/Loading";

type UserType = UserInfoType;

const UserProfile = () => {
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

  function toUserInfo() {
    router.push(`/userInfo/${id}`);
  }

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
    setNickName(user.nickname || "");
    setMbti(user.mbti || "");
    setAge(user.age || "");
    setSelectedGender(user.gender || "");
    setIntroduction(user.introduction || "");
    setPreviewImage(user.profile_img || "");
    setProfileImageUrl(user.profile_img || "");
  };

  useEffect(() => {
    setDefaultProfile();
  }, [user]);

  if (isPending) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col justify-center px-6" onClick={(e) => e.stopPropagation()}>
        <div className="mt-[21px] flex flex-col items-center justify-center">
          <Image
            className="h-[100px] w-[100px] rounded-xl bg-lime-300 object-cover"
            width={100}
            height={100}
            src={previewImage || defaultUserImg}
            alt=""
          />
        </div>
        <div className="mt-[7px]">
          <div className="text-base font-medium leading-normal text-[#61646B]">닉네임</div>
          <input
            className="mt-1 w-full rounded-lg border-[0.5px] border-[#AFB1B6] px-4 py-3 text-base font-medium text-[#292826]"
            maxLength={4}
            defaultValue={user.nickname}
            disabled
          />
        </div>
        <div className="mt-[29px]">
          {/* <ButtonGroup
            label="성별"
            buttonInfos={[
              { text: "남성", value: "남" },
              { text: "여성", value: "여" }
            ]}
            defaultValue={user.gender || ""}
            onChange={handleGenderChange}
          ></ButtonGroup> */}
          <p className="text-base font-medium leading-normal text-[#61646B]">성별</p>
          <input
            className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
            value={user.gender}
            disabled
          />
          <div className="mt-[29px]">
            <p className="text-base font-medium leading-normal text-[#61646B]">연령대</p>
            <input
              className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
              value={user.age}
              disabled
            />
          </div>
          <div className="mt-[29px]">
            <div className="text-base font-medium leading-normal text-[#61646B]">MBTI</div>
            <input
              className="mt-1 w-full rounded-lg border-[0.5px] border-[#AFB1B6] px-4 py-3 text-base font-medium text-[#292826]"
              maxLength={4}
              defaultValue={user.mbti}
              disabled
            />
          </div>
          <div className="mb-24 flex flex-col">
            <label className="text-base font-medium leading-normal text-[#61646B]">자기소개</label>
            <textarea
              className="mt-2 h-[97px] resize-none rounded-lg border-[0.5px] border-[#999999] p-3 text-[16px] font-medium leading-6 text-[#292826]"
              placeholder="자기소개(선택, 최대 200자)"
              maxLength={200}
              defaultValue={user.introduction}
              disabled
            />
            <div className="flex items-end justify-end text-xs font-medium leading-normal text-[#AFB1B6]">
              {introduction?.length}/200
            </div>

            <div className="pb-[80px] pt-[30px]">
              <button
                className="w-full rounded-lg bg-[#8E6EE8] py-3 text-center text-[16px] font-semibold text-[#FFFFFF]"
                onClick={toUserInfo}
              >
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
