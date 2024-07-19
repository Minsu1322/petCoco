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

export default MyPageProfile;
