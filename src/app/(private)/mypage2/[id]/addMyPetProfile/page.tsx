"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";
import { Input, Textarea } from "@nextui-org/input";
import { defaultPetImg } from "@/components/DefaultImg";
import Swal from "sweetalert2";
import MyInput from "../../_components/MyInput";
import ButtonGroup from "../../_components/ButtonGroup";

type PetType = UsersPetType;

const addMyPetProfile = () => {
  const [petName, setPetNickName] = useState("");
  const [age, setAge] = useState("");
  const [majorClass, setMajorClass] = useState("");
  const [minorClass, setMinorClass] = useState("");
  const [maleFemale, setMaleFemale] = useState("");
  const [neutralized, setNeutralized] = useState("");
  const [weight, setWeight] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [petImage, setPetImage] = useState<File | null>(); //서버에 반영될 이미지 파일
  const [previewImage, setPreviewImage] = useState(""); // 이미지 변경 확인을 위해 보여줄 임시 url
  const params = useParams();
  const supabase = createClient();
  const router = useRouter();
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
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "POST",
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
    mutationFn: updateProfileWithSupabase
  });

  if (params === null) {
    return;
  }
  const id = params.id;

  const toMyPage = () => {
    router.push(`/mypage2/${id}`);
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

  const submitChange = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const imageId = uuidv4();
    const FILE_NAME = "profile_image";
    const fileUrl = `${FILE_NAME}_${imageId}`;

    let petImageUrl = "";
    if (petImage) {
      const imgData = await supabase.storage.from("pet_image").upload(fileUrl, petImage);
      const imgUrl = supabase.storage.from("pet_image").getPublicUrl(imgData.data!.path);
      petImageUrl = imgUrl.data.publicUrl;
    }

    updateMutate.mutate({
      petName: petName,
      petImage: petImageUrl,
      age: age,
      majorClass: majorClass,
      minorClass: minorClass,
      male_female: maleFemale,
      neutralized: neutralized,
      weight: weight,
      medicalRecords: medicalRecords,
      introduction: introduction
    });

    Swal.fire({
      title: "success!",
      text: "프로필 등록이 성공적으로 완료되었습니다!"
    });

    toMyPage();
  };

  return (
    <div className="flex w-full flex-col justify-center">
      <div className="mt-[22px] flex flex-col items-center justify-center">
        <img
          className="h-[100px] w-[100px] rounded-xl bg-lime-300 object-cover"
          src={previewImage || defaultPetImg}
          alt=""
        />
        <button
          className="mt-2 h-[26px] w-[82px] rounded-lg border border-[#C9C9C9] bg-[#CCCCCC] text-center text-xs font-normal leading-tight text-[#FFFFFF] drop-shadow-lg"
          type={"button"}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          사진 변경
        </button>
        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
      </div>

      <div className="flex w-full flex-col justify-center px-[24px]">
        <div className="mt-[37px]">
          <MyInput
            label="이름"
            ref={null}
            id="changePetName"
            placeholder="애완동물의 이름(최대 8자)"
            maxLength={8}
            defaultValue={petName}
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
            defaultValue={majorClass}
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
            defaultValue={minorClass}
            onChange={handleMinorClassChange}
          />
        </div>
        <div className="mt-[23px]">
          <ButtonGroup
            label="성별"
            buttonInfos={[
              { text: "남아", value: "수" },
              { text: "여아", value: "암" }
            ]}
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
            onChange={handleNeutralize}
          ></ButtonGroup>
        </div>
        <div className="mt-[35px]">
          <MyInput
            label="연령"
            ref={null}
            id="changeAge"
            placeholder="나이"
            maxLength={20}
            defaultValue={age}
            onChange={handleAgeChange}
          />
        </div>
        <div className="mt-[35px]">
          <MyInput
            label="무게"
            ref={null}
            id="changeWeight"
            placeholder="1kg 미만은 소수점으로 표기"
            maxLength={20}
            defaultValue={weight}
            onChange={handleWeight}
          />
        </div>
        <div className="mt-[23px] flex flex-col">
          <label className="text-base font-normal leading-tight">의료기록</label>
          <textarea
            className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-4 py-3 text-[15px] font-normal leading-[20px]"
            placeholder="예방접종 및 기타 의료 기록(최대 200자)"
            maxLength={200}
            defaultValue={medicalRecords}
            onChange={handleMedicalRecords}
          />
        </div>
        <div className="mt-[22px] flex flex-col">
          <label className="text-base font-normal leading-tight">자기소개</label>
          <textarea
            className="mt-2 w-full rounded-lg border-[0.5px] border-[#999999] px-4 py-3 text-[15px] font-normal leading-[20px]"
            placeholder="좋아하는 것, 싫어하는 것 등등(최대 200자)"
            maxLength={200}
            defaultValue={introduction}
            onChange={handleIntroductionChange}
          />
        </div>
        <div className="py-[70px]">
          <button
            className="CCCCCC w-full rounded-lg bg-[#999999] py-3 text-center text-[16px] font-semibold text-[#FFFFFF]"
            onClick={submitChange}
          >
            작성완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default addMyPetProfile;
