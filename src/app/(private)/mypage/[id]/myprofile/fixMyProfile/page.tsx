// "use client";
// import { v4 as uuidv4 } from "uuid";
// import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { createClient } from "@/supabase/client";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { UserInfoType } from "@/types/auth.type";

// type UserType = UserInfoType;

const FixMyProfile = () => {
  //   const [nickName, setNickName] = useState("");
  //   const [age, setAge] = useState("");
  //   const [mbti, setMbti] = useState("");
  //   const [selectedGender, setSelectedGender] = useState("");
  //   const [introduction, setIntroduction] = useState("");
  //   const [profileImage, setProfileImage] = useState<File | null>(); //서버에 반영될 이미지 파일
  //   const [previewImage, setPreviewImage] = useState(""); // 이미지 변경 확인을 위해 보여줄 임시 url
  //   const params = useParams();
  //   const id = params.id;
  //   const supabase = createClient();
  //   const queryClient = useQueryClient();

  //   const router = useRouter();

  //   // const updateProfileNickNameWithSupabase = async (newName: string, id: string) => {
  //   //   const { data: result } = await supabase.from("users").update({ nickname: newName }).eq("id", id);
  //   //   return result;
  //   // };

  //   // const updateProfileImgWithSupabase = async (newImg: string, id: string) => {
  //   //   const { data: result } = await supabase.from("users").update({ profile_img: newImg }).eq("id", id);
  //   //   return result;
  //   // };

  //   const ageOptions = [
  //     { value: "null", label: "연령대 선택" },
  //     { value: "10대", label: "10대" },
  //     { value: "20대", label: "20대" },
  //     { value: "30대", label: "30대" },
  //     { value: "40대", label: "40대" },
  //     { value: "50대", label: "50대" },
  //     { value: "60대", label: "60대" },
  //     { value: "70대 이상", label: "70대 이상" }
  //   ];

  //   const getProfileData = async () => {
  //     const response = await fetch(`/api/mypage/${id}/myprofile`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" }
  //     });
  //     const data = response.json();

  //     return data;
  //   };

  //   const {
  //     data: user,
  //     isPending,
  //     isError
  //   } = useQuery({
  //     queryKey: ["user"],
  //     queryFn: getProfileData
  //   });
  //   if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  //   if (isError) {
  //     alert("데이터 로딩 실패");
  //     return null;
  //   }

  //   function toMyProfile() {
  //     router.push(`/mypage/${user.id}/myprofile`);
  //   }

  //   const updateProfileWithSupabase = async ({
  //     nickname,
  //     profile_img,
  //     age,
  //     mbti,
  //     gender,
  //     introduction
  //   }: Pick<UserType, "nickname" | "profile_img" | "age" | "gender" | "mbti" | "introduction">) => {
  //     const response = await fetch(`/api/mypage/${id}/myprofile`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ nickname, profile_img, age, mbti, gender, introduction })
  //     });
  //     return response.json();
  //   };

  //   const updateMutate = useMutation({
  //     mutationFn: updateProfileWithSupabase,
  //     onSuccess: () => {
  //       queryClient.refetchQueries({ queryKey: ["user"] });
  //     }
  //   });

  //   const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files![0];
  //     let image = window.URL.createObjectURL(file);
  //     setPreviewImage(image);
  //     setProfileImage(file);
  //   };

  //   const handleNickNameChange = (e: ChangeEvent<HTMLInputElement>) => setNickName(e.target.value);

  //   const handleMbtiChange = (e: ChangeEvent<HTMLInputElement>) => setMbti(e.target.value);

  //   const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     setSelectedGender(e.currentTarget.value);
  //   };

  //   const handleAgeChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //     setAge(e.currentTarget.value);
  //   };

  //   const handleIntroductionChange = (e: ChangeEvent<HTMLInputElement>) => setIntroduction(e.target.value);

  //   const submitChange = async (e: MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();
  //     const imageId = uuidv4();
  //     const FILE_NAME = "profile_image";
  //     const fileUrl = `${FILE_NAME}_${imageId}`;

  //     // await updateProfileNickNameWithSupabase(nickName, user.id);
  //     // //유저 닉네임 변경
  //     // if (profileImage === null) {
  //     //   return;
  //     // } else if (profileImage) {
  //     //   const { data, error } = await supabase.storage.from("profile_img").upload(fileUrl, profileImage);
  //     //   const publicUrl = supabase.storage.from("profile_img").getPublicUrl(`${data!.path}`);

  //     //   await updateProfileImgWithSupabase(publicUrl.data.publicUrl, user.id);
  //     // } //유저 프로필 사진 변경

  //     // if (nickName !== user.nickname) {
  //     //   updatingData.nickname = nickName;
  //     // }
  //     let profileImageUrl = "";
  //     if (profileImage) {
  //       const imgData = await supabase.storage.from("profile_img").upload(fileUrl, profileImage);
  //       const imgUrl = supabase.storage.from("profile_img").getPublicUrl(imgData.data!.path);
  //       profileImageUrl = imgUrl.data.publicUrl;
  //     }

  //     updateMutate.mutate({
  //       nickname: nickName,
  //       profile_img: profileImageUrl,
  //       age: age,
  //       mbti: mbti,
  //       gender: selectedGender,
  //       introduction: introduction
  //     });

  //     alert("프로필 변경이 성공적으로 완료되었습니다!");

  //     toMyProfile();
  //   };

  return (
    <>FixMyProfile</>
    //     <div
    //       className="my-auto flex h-[700px] w-[500px] flex-col items-center justify-center rounded-[30px] bg-white"
    //       onClick={(e) => e.stopPropagation()}
    //     >
    //       <h1 className="mt-5 text-2xl font-bold">프로필 수정</h1>
    //       <div className="my-auto mt-5 flex max-h-[400px] max-w-[300px] flex-col items-center justify-center">
    //         <img className="max-h-[200px] max-w-[200px] object-cover" src={previewImage} alt="profile_img" />
    //         <br></br>
    //         <button
    //           className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
    //           type={"button"}
    //           onClick={() => document.getElementById("fileInput")?.click()}
    //         >
    //           이미지 변경하기
    //         </button>
    //         <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
    //       </div>
    //       <input
    //         className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
    //         type="text"
    //         placeholder="변경할 닉네임"
    //         defaultValue={user.nickname}
    //         onChange={handleNickNameChange}
    //       />
    //       <select onChange={handleAgeChange} value={age}>
    //         {ageOptions.map((option) => (
    //           <option key={option.value} value={option.value}>
    //             {option.label}
    //           </option>
    //         ))}
    //       </select>
    //       <div>
    //         <input type="checkbox" name="gender" value="남" onChange={handleGenderChange} /> 남
    //         <br />
    //         <input type="checkbox" name="gender" value="여" onChange={handleGenderChange} /> 여
    //       </div>
    //       <input
    //         className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
    //         type="text"
    //         placeholder="MBTI"
    //         defaultValue={user.mbti}
    //         onChange={handleMbtiChange}
    //       />
    //       <input
    //         className="mt-5 flex items-center rounded-[10px] border border-[#D2D2D2] px-[14px] py-[12px] text-center"
    //         type="text"
    //         placeholder="한줄 소개"
    //         defaultValue={user.introduction}
    //         onChange={handleIntroductionChange}
    //       />
    //       <div className="mt-5 flex gap-[15px]">
    //         <button
    //           className="rounded border border-[#C9C9C9] bg-[#D1D1D1] px-4 py-2 text-center font-bold text-white"
    //           onClick={toMyProfile}
    //         >
    //           뒤로가기
    //         </button>
    //         <button
    //           className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
    //           onClick={submitChange}
    //         >
    //           변경하기
    //         </button>
    //       </div>
    //     </div>
  );
};

export default FixMyProfile;
