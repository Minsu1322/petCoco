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
import MyInput from "../../../_components/MyInput";
import ButtonGroup from "../../../_components/ButtonGroup";
import MyPageTabHeader from "./../../../_components/MyPageTabHeader";
import Image from "next/image";
import LoadingComponent from "@/components/loadingComponents/Loading";

type PetType = UsersPetType;

const FixMyPetProfile = () => {
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

  const submitChange = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const imageId = uuidv4();
    const FILE_NAME = "profile_image";
    const fileUrl = `${FILE_NAME}_${imageId}`;

    let uploadUrl = null;
    if (petImage) {
      const imgData = await supabase.storage.from("pet_image").upload(fileUrl, petImage);
      const imgUrl = supabase.storage.from("pet_image").getPublicUrl(imgData.data!.path);
      setPetImageUrl(imgUrl.data.publicUrl);
      uploadUrl = imgUrl.data.publicUrl;
    } else {
      setPetImageUrl(filteredProfile![0].petImage);
      uploadUrl = filteredProfile![0].petImage;
    }

    updateMutate.mutate({
      petName: petName,
      petImage: uploadUrl,
      age: age,
      majorClass: majorClass,
      minorClass: minorClass,
      male_female: maleFemale,
      neutralized: neutralized,
      weight: weight,
      medicalRecords: medicalRecords,
      introduction: introduction
    });
  };

  const updateProfileWithSupabase = async ({
    petName,
    petImage,
    age,
    male_female,
    neutralized,
    majorClass,
    minorClass,
    weight,
    medicalRecords,
    introduction
  }: Pick<
    PetType,
    | "petName"
    | "petImage"
    | "age"
    | "male_female"
    | "majorClass"
    | "minorClass"
    | "weight"
    | "medicalRecords"
    | "neutralized"
    | "introduction"
  >) => {
    const response = await fetch(`/api/mypage/${petId}/mypetprofile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petName,
        petImage,
        age,
        neutralized,
        male_female,
        majorClass,
        minorClass,
        weight,
        medicalRecords,
        introduction
      })
    });
    return response.json();
  };

  const updateMutate = useMutation({
    mutationFn: updateProfileWithSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet"] });
      Swal.fire({
        title: "success!",
        text: "프로필 변경이 완료되었습니다!"
      });

      toMyPet();
    }
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

  function toMyPet() {
    router.push(`/mypage2/${id}`);
  }

  const deleteProfile = async (id: string) => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const { mutate: deleteMutation } = useMutation<UsersPetType, Error, string>({
    mutationFn: (id) => deleteProfile(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pet"] })
  });

  const handleDelte = async (id: string) => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "warning",

      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",

      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteMutation(id);
        } catch (error) {
        }

        Swal.fire({
          title: "success!",
          text: "삭제가 완료되었습니다."
        });

        toMyPet();
      }
    });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    let image = window.URL.createObjectURL(file);
    setPreviewImage(image);
    setPetImage(file);
  };

  const handlePetNameChange = (e: ChangeEvent<HTMLInputElement>) => setPetNickName(e.target.value);

  const handleMajorClassChange = (e: ChangeEvent<HTMLInputElement>) => setMajorClass(e.target.value);
  const handleMinorClassChange = (e: ChangeEvent<HTMLInputElement>) => setMinorClass(e.target.value);

  const handleMaleFemaleChange = (value: string) => {
    setMaleFemale(value);
  };

  const handleNeutralize = (value: string) => {
    setNeutralized(value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => setAge(e.target.value);
  const handleWeight = (e: ChangeEvent<HTMLInputElement>) => setWeight(Number(e.target.value));
  const handleMedicalRecords = (e: ChangeEvent<HTMLTextAreaElement>) => setMedicalRecords(e.target.value);
  const handleIntroductionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setIntroduction(e.target.value);

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
      <MyPageTabHeader />
      <div className="flex justify-between bg-[#F3F2F2]">
        <div className="m-[14px] flex gap-4 overflow-x-scroll scrollbar-hide">
          {pet?.map((pet) => (
            <Link key={pet.id} href={`/mypage2/${id}/fixMyPetProfile/${pet.id}`}>
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
        <div className="mr-[18px] py-[22px]">
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
        </div>
      </div>
      <div className="flex w-full flex-col px-3 py-3">
        <div className="mt-[27px] flex flex-col items-center justify-center">
          <Image
            className="h-[100px] w-[100px] rounded-xl object-cover"
            width={100}
            height={100}
            src={previewImage || defaultPetImg}
            alt=""
          />
          <div className="inline-flex px-[9px] py-[7px]">
            <button
              className="rounded-lg bg-[#8E6EE8] px-3 py-2 text-center text-xs font-normal leading-tight text-[#FFFFFF] drop-shadow-lg"
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
          <div className="flex w-full flex-col justify-center px-[24px]">
            <div className="mt-[19px]">
              <MyInput
                label="이름"
                ref={null}
                id="changePetName"
                placeholder="변경할 이름(최대 8자)"
                maxLength={8}
                defaultValue={filteredProfile![0].petName || ""}
                onChange={handlePetNameChange}
              />
            </div>
            <div className="mt-[35px]">
              <MyInput
                label="종류"
                ref={null}
                id="changeMajorClass"
                placeholder="개, 고양이, 물고기 등등"
                maxLength={8}
                defaultValue={filteredProfile![0].majorClass || ""}
                onChange={handleMajorClassChange}
              />
            </div>
            <div className="mt-[35px]">
              <MyInput
                label="품종"
                ref={null}
                id="changeMajorClass"
                placeholder="치와와, 랙돌, 금붕어 등등"
                maxLength={8}
                defaultValue={filteredProfile![0].minorClass || ""}
                onChange={handleMinorClassChange}
              />
            </div>
            <div className="mt-[23px]">
              <ButtonGroup
                label="성별"
                buttonInfos={[
                  { text: "남아", value: "남아" },
                  { text: "여아", value: "여아" }
                ]}
                defaultValue={filteredProfile![0].male_female || ""}
                onChange={handleMaleFemaleChange}
              ></ButtonGroup>
            </div>
            <div className="mt-[23px]">
              <ButtonGroup
                label="중성화 여부"
                buttonInfos={[
                  { text: "했어요", value: "YES" },
                  { text: "안 했어요", value: "NO" }
                ]}
                defaultValue={filteredProfile![0].neutralized || ""}
                onChange={handleNeutralize}
              ></ButtonGroup>
            </div>
            <div className="mt-[35px]">
              <MyInput
                label="나이 (살)"
                ref={null}
                id="changeAge"
                placeholder="나이"
                maxLength={20}
                defaultValue={filteredProfile![0].age || ""}
                onChange={handleAgeChange}
              />
            </div>
            <div className="mt-[35px]">
              <MyInput
                label="무게 (kg)"
                ref={null}
                id="changeWeight"
                placeholder="1kg 미만은 소수점으로 표기"
                maxLength={20}
                defaultValue={filteredProfile![0].weight || ""}
                onChange={handleWeight}
              />
            </div>
            <div className="mt-[19px] flex flex-col">
              <label className="text-base font-medium leading-normal text-[#61646B]">의료기록 (선택)</label>
              <textarea
                className="mt-2 h-[97px] w-full resize-none rounded-lg border-[0.5px] border-[#999999] p-3 text-[16px] font-medium leading-6 text-[#292826]"
                placeholder="예방접종 및 기타 의료 기록(최대 200자)"
                maxLength={200}
                defaultValue={filteredProfile![0].medicalRecords || ""}
                onChange={handleMedicalRecords}
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
                onChange={handleIntroductionChange}
              />
              <div className="mt-[10px] flex items-end justify-end text-xs font-medium leading-normal text-[#AFB1B6]">
                {introduction?.length}/200
              </div>
            </div>
            <div className="flex w-full justify-evenly gap-[11px] pb-[80px] pt-[30px]">
              <button
                className="min-w-[155px] rounded-lg border border-[#8E6EE8] bg-[#FFFFFF] px-8 py-3 text-center text-[16px] font-semibold text-[#8E6EE8]"
                onClick={() => handleDelte(filteredProfile[0]?.id)}
              >
                프로필 삭제
              </button>
              <button
                className="min-w-[155px] rounded-lg bg-[#8E6EE8] px-8 py-3 text-center text-[16px] font-semibold text-[#FFFFFF]"
                onClick={submitChange}
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FixMyPetProfile;
