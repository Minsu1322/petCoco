"use client";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";

type PetType = UsersPetType;

const fixmypetprofile = () => {
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
  if (params === null) {
    return;
  }
  const id = params.id;
  const petId = params.petId;
  const supabase = createClient();
  const queryClient = useQueryClient();

  const router = useRouter();

  function toMyPet() {
    router.push(`/mypage/${id}/mypet/mypetprofile/${petId}`);
  }

  // const updateProfileNickNameWithSupabase = async (newName: string, id: string) => {
  //   const { data: result } = await supabase.from("users").update({ nickname: newName }).eq("id", id);
  //   return result;
  // };

  // const updateProfileImgWithSupabase = async (newImg: string, id: string) => {
  //   const { data: result } = await supabase.from("users").update({ profile_img: newImg }).eq("id", id);
  //   return result;
  // };

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

    alert("프로필 변경이 성공적으로 완료되었습니다!");

    toMyPet();
  };

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

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const filteredProfile = pet.filter((profile) => {
    return profile.id === petId;
  });

  return (
    <div
      className="my-auto flex flex-col items-center justify-center rounded-[30px] bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <h1 className="mt-5 text-2xl font-bold">팻 정보 변경하기</h1>
      <div className="my-auto mt-5 flex max-h-[400px] max-w-[300px] flex-col items-center justify-center">
        <img className="max-h-[200px] max-w-[200px] object-cover" src={previewImage} alt="profile_img" />
        <br></br>
        <button
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
          type={"button"}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          이미지 변경하기
        </button>
        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
      </div>
      <br />
      이름
      <input
        className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
        type="text"
        placeholder="변경할 이름"
        defaultValue={filteredProfile[0].petName || ""}
        onChange={handlePetNameChange}
      />
      <br />
      대분류
      <input
        className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
        type="text"
        placeholder="개, 고양이, 물고기 등등"
        defaultValue={filteredProfile[0].majorClass || ""}
        onChange={handleMajorClassChange}
      />
      <br />
      소분류
      <input
        className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
        type="text"
        placeholder="치와와, 랙돌, 금붕어 등등"
        defaultValue={filteredProfile[0].minorClass || ""}
        onChange={handleMinorClassChange}
      />
      <br />
      나이
      <input
        className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
        type="text"
        placeholder="나이"
        defaultValue={filteredProfile[0].age || ""}
        onChange={handleAgeChange}
      />
      <br />
      성별
      <div>
        <input type="checkbox" name="gender" value="수" onChange={handleMaleFemaleChange} /> 수
        <br />
        <input type="checkbox" name="gender" value="암" onChange={handleMaleFemaleChange} /> 암
      </div>
      <br /> 중성화
      <input type="checkbox" name="neutralize" value="YES" onChange={handleNeutralize} />
      <br />
      무게(kg) :
      <input
        type="number"
        step="0.1"
        placeholder="1kg 미만은 소수점으로 표기"
        className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
        name="weight"
        //value={weight === null ? "" : weight}
        onChange={handleWeight}
      />
      <br />
      의료기록
      <input
        className="mt-5 flex min-h-[300px] min-w-[100px] rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
        type="text"
        placeholder="예방접종 및 기타 의료 기록"
        defaultValue={filteredProfile[0].medicalRecords || ""}
        onChange={handleMedicalRecords}
      />
      <br />
      특징
      <input
        className="mt-5 flex min-h-[300px] min-w-[100px] rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
        type="text"
        placeholder="좋아하는 것, 싫어하는 것 등등"
        defaultValue={filteredProfile[0].introduction || ""}
        onChange={handleIntroductionChange}
      />
      <div className="mt-5 flex gap-[15px]">
        <button
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={toMyPet}
        >
          뒤로가기
        </button>
        <button
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={submitChange}
        >
          변경하기
        </button>
      </div>
    </div>
  );
};

export default fixmypetprofile;
