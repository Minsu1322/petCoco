"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";
import { defaultPetImg } from "@/components/DefaultImg";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import LoadingComponent from "@/components/loadingComponents/Loading";

type PetType = UsersPetType;

const UserPetProfile = () => {
  const [petName, setPetNickName] = useState<string | null>("");
  const [age, setAge] = useState<string | null>("");
  const [majorClass, setMajorClass] = useState<string | null>("");
  const [minorClass, setMinorClass] = useState<string | null>("");
  const [maleFemale, setMaleFemale] = useState<string | null>("");
  const [neutralized, setNeutralized] = useState<string | null>("");
  const [weight, setWeight] = useState<number | null>(0);
  const [medicalRecords, setMedicalRecords] = useState<string | null>("");
  const [introduction, setIntroduction] = useState<string | null>("");
  const [petImage, setPetImage] = useState<File | null>(); //서버에 반영될 이미지 파일
  const [previewImage, setPreviewImage] = useState<string | null>(); // 이미지 변경 확인을 위해 보여줄 임시 url
  const [petImageUrl, setPetImageUrl] = useState<string | null>();
  const [filteredProfile, setFilteredProfile] = useState<PetType[]>([]);
  const params = useParams();
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const id = params?.id || 0;
  const petId = params?.petId || 0;

  const getPetData = async () => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: pet,
    isPending,
    isError
  } = useQuery<UsersPetType[]>({
    queryKey: ["pet"],
    queryFn: getPetData
  });

  useEffect(() => {
    if (!pet) {
      return;
    }
    const filtered = pet.filter((profile) => {
      return profile.id === petId;
    });
    setFilteredProfile(filtered);
  }, [pet]);

  useEffect(() => {
    setDefaultProfile();
  }, [filteredProfile]);

  const setDefaultProfile = () => {
    if (!filteredProfile || filteredProfile.length === 0) {
      return;
    }
    setPetNickName(filteredProfile[0].petName);
    setMajorClass(filteredProfile[0].majorClass);
    setMinorClass(filteredProfile[0].minorClass);
    setAge(filteredProfile[0].age);
    setMaleFemale(filteredProfile[0].male_female);
    setNeutralized(filteredProfile[0].neutralized);
    setWeight(filteredProfile[0].weight);
    setMedicalRecords(filteredProfile[0].medicalRecords);
    setIntroduction(filteredProfile[0].introduction);
    setPreviewImage(filteredProfile[0].petImage);
    setPetImageUrl(filteredProfile[0].petImage);
  };

  function toUserInfo() {
    router.push(`/userInfo/${id}`);
  }

  if (isPending || filteredProfile.length === 0) {
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
      <div className="flex justify-between bg-[#F3F2F2]">
        <div className="m-[14px] flex gap-4 overflow-x-scroll scrollbar-hide">
          {pet?.map((pet) => (
            <Link key={pet.id} href={`/userInfo/${id}/petProfile/${pet.id}`}>
              <div className="w-auto whitespace-nowrap rounded-lg bg-[#8E6EE8] px-3 py-2 text-xs font-semibold text-[#FFFFFF]">
                {pet.petName}
              </div>
              {/* <img
                  className="h-[50px] w-[50px] rounded bg-lime-300 object-cover"
                  src={pet.petImage ? pet.petImage : defaultPetImg}
                  alt="..."
                /> */}
            </Link>
          ))}
        </div>
        {/* <div className="mr-[18px] py-[22px]">
          <Link href={`/mypage2/${id}/addMyPetProfile`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.75 15.1541C10.336 15.1541 10 14.8181 10 14.4041V7.07715C10 6.66315 10.336 6.32715 10.75 6.32715C11.164 6.32715 11.5 6.66315 11.5 7.07715V14.4041C11.5 14.8181 11.164 15.1541 10.75 15.1541Z"
                fill="#42413D"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.4165 11.4902H7.0835C6.6685 11.4902 6.3335 11.1542 6.3335 10.7402C6.3335 10.3262 6.6685 9.99023 7.0835 9.99023H14.4165C14.8305 9.99023 15.1665 10.3262 15.1665 10.7402C15.1665 11.1542 14.8305 11.4902 14.4165 11.4902Z"
                fill="#42413D"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.064 1.5C3.292 1.5 1.5 3.397 1.5 6.335V15.165C1.5 18.103 3.292 20 6.064 20H15.436C18.209 20 20 18.103 20 15.165V6.335C20 3.397 18.209 1.5 15.436 1.5H6.064ZM15.436 21.5H6.064C2.437 21.5 0 18.954 0 15.165V6.335C0 2.546 2.437 0 6.064 0H15.436C19.063 0 21.5 2.546 21.5 6.335V15.165C21.5 18.954 19.063 21.5 15.436 21.5Z"
                fill="#42413D"
              />
            </svg>
          </Link>
        </div> */}
      </div>
      <div className="flex w-full flex-col px-3 py-3">
        <div className="mt-[27px] flex flex-col items-center justify-center">
          <Image
            className="h-[100px] w-[100px] rounded-xl bg-lime-300 object-cover"
            width={100}
            height={100}
            src={previewImage || defaultPetImg}
            alt=""
          />

          <div className="flex w-full flex-col justify-center px-[24px]">
            <div className="mt-[19px]">
              <p className="text-base font-medium leading-normal text-[#61646B]">이름</p>
              <input
                className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
                maxLength={8}
                defaultValue={filteredProfile![0].petName || ""}
                disabled
              />
            </div>
            <div className="mt-[35px]">
              <p className="text-base font-medium leading-normal text-[#61646B]">종류</p>
              <input
                className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
                maxLength={8}
                defaultValue={filteredProfile![0].majorClass || ""}
                disabled
              />
            </div>
            <div className="mt-[35px]">
              <p className="text-base font-medium leading-normal text-[#61646B]">품종</p>
              <input
                className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
                maxLength={8}
                defaultValue={filteredProfile![0].minorClass || ""}
                disabled
              />
            </div>
            <div className="mt-[23px]">
              <p className="text-base font-medium leading-normal text-[#61646B]">성별</p>
              <input
                className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
                defaultValue={filteredProfile![0].male_female || ""}
                disabled
              />
            </div>
            <div className="mt-[23px]">
              <p className="text-base font-medium leading-normal text-[#61646B]">중성화 여부</p>
              <input
                className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
                defaultValue={filteredProfile![0].neutralized || ""}
                disabled
              />
            </div>
            <div className="mt-[35px]">
              <p className="text-base font-medium leading-normal text-[#61646B]">나이 (살)</p>
              <input
                className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
                defaultValue={filteredProfile![0].age || ""}
                disabled
              />
            </div>
            <div className="mt-[35px]">
              <p className="text-base font-medium leading-normal text-[#61646B]">무게 (kg)</p>
              <input
                className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-3 py-3 text-[16px] font-medium leading-normal"
                defaultValue={filteredProfile![0].weight || ""}
                disabled
              />
            </div>
            <div className="mt-[19px] flex flex-col">
              <label className="text-base font-medium leading-normal text-[#61646B]">의료기록 (선택)</label>
              <textarea
                className="mt-2 h-[97px] w-full resize-none rounded-lg border-[0.5px] border-[#999999] p-3 text-[16px] font-medium leading-6 text-[#292826]"
                placeholder="예방접종 및 기타 의료 기록(최대 200자)"
                maxLength={200}
                defaultValue={filteredProfile![0].medicalRecords || ""}
                disabled
              />
              <div className="mt-[10px] flex items-end justify-end text-xs font-medium leading-normal text-[#AFB1B6]">
                {medicalRecords?.length}/200
              </div>
            </div>
            <div className="mt-[19px] flex flex-col">
              <label className="text-base font-medium leading-normal text-[#61646B]">메모 (선택)</label>
              <textarea
                className="mt-2 h-[97px] w-full resize-none rounded-lg border-[0.5px] border-[#999999] p-3 text-[16px] font-medium leading-6 text-[#292826]"
                placeholder="좋아하는 것, 싫어하는 것 등등(최대 200자)"
                maxLength={200}
                defaultValue={filteredProfile![0].introduction || ""}
                disabled
              />
              <div className="mt-[10px] flex items-end justify-end text-xs font-medium leading-normal text-[#AFB1B6]">
                {introduction?.length}/200
              </div>
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

export default UserPetProfile;
