"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";
import { Input, Textarea } from "@nextui-org/input";

type PetType = UsersPetType;

const FixMypetProfile = () => {
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

    alert("프로필 변경이 성공적으로 완료되었습니다!");

    toMyPet();
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
    mutationFn: updateProfileWithSupabase
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
    router.push(`/mypage/${id}/myprofile`);
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    let image = window.URL.createObjectURL(file);
    setPreviewImage(image);
    setPetImage(file);
  };

  const handlePetNameChange = (e: ChangeEvent<HTMLInputElement>) => setPetNickName(e.target.value);

  const handleMajorClassChange = (e: ChangeEvent<HTMLInputElement>) => setMajorClass(e.target.value);
  const handleMinorClassChange = (e: ChangeEvent<HTMLInputElement>) => setMinorClass(e.target.value);

  const handleMaleFemaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaleFemale(e.currentTarget.value);
  };

  const handleNeutralize = (e: ChangeEvent<HTMLInputElement>) => {
    setNeutralized(e.currentTarget.value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => setAge(e.target.value);
  const handleWeight = (e: ChangeEvent<HTMLInputElement>) => setWeight(Number(e.target.value));
  const handleMedicalRecords = (e: ChangeEvent<HTMLInputElement>) => setMedicalRecords(e.target.value);
  const handleIntroductionChange = (e: ChangeEvent<HTMLInputElement>) => setIntroduction(e.target.value);

  if (isPending || filteredProfile.length === 0)
    return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div
      className="my-auto flex flex-col items-center justify-center rounded-[30px] bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <h1 className="mt-5 text-2xl font-bold">팻 정보 변경하기</h1>
      <div className="my-auto mt-5 flex max-h-[400px] max-w-[300px] flex-col items-center justify-center">
        <img
          className="max-h-[200px] max-w-[200px] object-cover"
          src={previewImage ? previewImage : ""}
          alt="profile_img"
        />
        <br></br>
        <button
          className="rounded bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
          type={"button"}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          이미지 변경하기
        </button>
        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
      </div>
      <div className="w-[600px]">
        <br />
        <p className="font-bold">이름</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="변경할 이름(최대 8자)"
          maxLength={8}
          defaultValue={filteredProfile![0].petName || ""}
          onChange={handlePetNameChange}
        />
        <br />
        <p className="font-bold">대분류</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="개, 고양이, 물고기 등등"
          maxLength={20}
          defaultValue={filteredProfile![0].majorClass || ""}
          onChange={handleMajorClassChange}
        />
        <br />
        <p className="font-bold">소분류</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="치와와, 랙돌, 금붕어 등등"
          maxLength={20}
          defaultValue={filteredProfile![0].minorClass || ""}
          onChange={handleMinorClassChange}
        />
        <br />
        <p className="font-bold">나이</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="나이"
          maxLength={100}
          defaultValue={filteredProfile![0].age || ""}
          onChange={handleAgeChange}
        />
        <br />
        <p className="font-bold">성별</p>
        <div className="mt-2 flex gap-[10px] pl-2">
          <input type="checkbox" name="gender" value="암" onChange={handleMaleFemaleChange} /> 암&nbsp;
          <input type="checkbox" name="gender" value="수" onChange={handleMaleFemaleChange} /> 수
        </div>
        <br />
        <p className="font-bold">중성화 여부</p>
        <div className="mt-2 flex gap-[10px] pl-2">
          <input type="checkbox" name="neutralize" value="YES" onChange={handleNeutralize} /> YES &nbsp;
          <input type="checkbox" name="neutralize" value="No" onChange={handleNeutralize} /> No
        </div>
        <br />
        <p className="font-bold">무게(kg)</p>
        <input
          type="number"
          step="0.1"
          placeholder="1kg 미만은 소수점으로 표기"
          maxLength={100}
          defaultValue={filteredProfile![0].weight || ""}
          className="mt-2 h-[40px] rounded-md bg-gray-100 px-2"
          name="weight"
          //value={weight === null ? "" : weight}
          onChange={handleWeight}
        />
        <br />
        <p className="mt-6 font-bold">의료기록(최대 200자)</p>
        <Textarea
          className="mt-2"
          placeholder="예방접종 및 기타 의료 기록(최대 200자)"
          maxLength={200}
          defaultValue={filteredProfile![0].medicalRecords || ""}
          onChange={handleMedicalRecords}
        />
        <br />
        <p className="font-bold">특징(최대 200자)</p>
        <Textarea
          className="mt-2"
          placeholder="좋아하는 것, 싫어하는 것 등등(최대 200자)"
          maxLength={200}
          defaultValue={filteredProfile![0].introduction || ""}
          onChange={handleIntroductionChange}
        />
      </div>
      <div className="mb-20 mt-5 flex gap-[15px]">
        <button
          className="rounded bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={toMyPet}
        >
          뒤로가기
        </button>
        <button
          className="rounded bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={submitChange}
        >
          변경하기
        </button>
      </div>
    </div>
  );
};

export default FixMypetProfile;
