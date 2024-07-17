"use client";
import { error } from "console";
import { ChangeEvent, useState } from "react";

function MyPage() {
  //const user = useAuthStore((state) => state.user);
  //const router = useRouter();
  // if (!user) {
  //  alert("로그인되어야 마이페이지를 확인 할 수 있습니다.");
  //   router.push("/login");
  // } else {
  return (
    <div className="pt-[70px] pb-[200px]">
      <MyPageProfile />
      <ChangeProfileModalButton />
      {/* <MyPageList /> */}
    </div>
  );
  // }
}

const MyPageProfile = () => {
  // const params = useParams();
  // const id = params.id;
  // const getProfileData = async () => {
  //   const supabase = createClient();
  //   const data = await supabase.from("users").select("*").eq("id", id).maybeSingle();

  //   return data;
  // };

  // const { data: profile, isPending, error } = useQuery({ queryKey: ["profile"], queryFn: getProfileData });

  // if (isPending) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // if (error) {
  //   alert("데이터 로딩 실패");
  //   return null;
  // }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[24px] sm:text-[48px] px-[15px] lg:px-0 flex flex-col my-auto justify-center items-center">
        <img className="w-[170px] h-[170px] rounded-full object-cover bg-lime-300" src="" />
        <span className="text-[#24CAFF] text-[24px] sm:text-[48px] font-bold">테스트</span>님 반갑습니다.
      </div>
    </div>
  );
};

const ChangeProfileModalButton = () => {
  const [showModal, setShowModal] = useState(false);

  const clickModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="flex flex-col my-auto justify-center items-center">
      <button
        className="rounded py-2 px-4 bg-[#24CAFF] border-[#00BBF7] text-center text-white font-bold mt-5"
        onClick={clickModal}
      >
        프로필 변경
      </button>

      {showModal && <Modal clickModal={clickModal} />}
    </div>
  );
};

type ModalProps = {
  clickModal: () => void;
};

const Modal = ({ clickModal }: ModalProps) => {
  const [nickName, setNickName] = useState("");
  const [profileImage, setProfileImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState("");

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
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result: any = reader.result; //타입 좀 어떻게 할 것
      if (!result) {
        return alert("프로필 사진 업로드 에러");
      } else {
        setPreviewUrl(result);
      }
    };
  };

  const handleNickNameChange = (e: ChangeEvent<HTMLInputElement>) => setNickName(e.target.value);

  const submitChange = async () => {
    //   if (!profile.data) {
    // 	return;
    //   }
    //   await updateProfileWithSupabase(nickName, profile.data?.id);
    //   await updateProfileWithSupabase(nickName, profile.data?.id);
    //   queryClient.invalidateQueries({ queryKey: ["profile"] });
    console.log(previewUrl);
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
          <img className="max-w-[200px] max-h-[200px] object-cover" src={previewUrl} alt="" />
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

export default MyPage;
