"use client";
import { Blob } from "buffer";
import { ChangeEvent, useState } from "react";

type ModalProps = {
  clickModal: () => void;
};

const ChangeProfileModal = ({ clickModal }: ModalProps) => {
  const [nickName, setNickName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null); //서버에 반영될 이미지 파일
  const [previewImage, setPreviewImage] = useState(""); // 이미지 변경 확인을 위해 보여줄 임시 url

  // const params = useParams();
  // const id = params.id;
  // const supabase = createClient();
  // const queryClient = useQueryClient();

  // const updateProfileWithSupabase = async (newName: string, id: string) => {
  //   const { data: result } = await supabase.from("profile").update({ nickname: newName }).eq("id", id);
  //   return result;
  // };

  // const getProfileData = async () => {
  //   const data = await supabase.from("profile").select("*").eq("id", id).maybeSingle();
  //   return data;
  // };

  // const { data: profile, isPending, error } = useQuery({ queryKey: ["profile"], queryFn: getProfileData });

  // if (isPending) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // if (error) {
  //   alert("데이터 로딩 실패");
  //   return null;
  // }
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      let image = window.URL.createObjectURL(file);
      setPreviewImage(image);
      setProfileImage(file);
    }
  };

  const handleNickNameChange = (e: ChangeEvent<HTMLInputElement>) => setNickName(e.target.value);

  const submitChange = async () => {
    //   if (!profile.data) {
    // 	return;
    //   }
    //   await updateProfileWithSupabase(nickName, profile.data?.id);
    //   await updateProfileWithSupabase(nickName, profile.data?.id);
    //   queryClient.invalidateQueries({ queryKey: ["profile"] });
    console.log(profileImage);
    console.log(nickName);
    alert("프로필 변경이 성공적으로 완료되었습니다!");

    clickModal();
  };
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex my-auto justify-center items-center z-40 bg-[#00000066]/40 "
      onClick={clickModal}
    >
      <div
        className="bg-white w-[500px] h-[700px] rounded-[30px] flex flex-col my-auto justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold mt-5">프로필 수정</h1>
        <div className="flex flex-col my-auto justify-center items-center max-w-[300px] max-h-[400px] mt-5">
          <img className="max-w-[200px] max-h-[200px] object-cover" src={previewImage} alt="" />
          <br></br>
          <button
            className="rounded py-2 px-4 bg-[#24CAFF] border border-[#00BBF7] text-center text-white font-bold"
            type={"button"}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            이미지 변경하기
          </button>
          <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </div>
        <input
          className="border border-[#D2D2D2] py-[12px] px-[14px] rounded-[10px] flex items-center text-center mt-5 "
          type="text"
          placeholder="변경할 닉네임"
          onChange={handleNickNameChange}
        />
        <div className="mt-5 flex gap-[15px]">
          <button
            className="rounded py-2 px-4 bg-[#D1D1D1] border border-[#C9C9C9] text-center text-white font-bold"
            onClick={clickModal}
          >
            뒤로가기
          </button>
          <button
            className="rounded py-2 px-4 bg-[#24CAFF] border border-[#00BBF7] text-center text-white font-bold"
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
