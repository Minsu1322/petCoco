import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { UsersPetType } from "@/types/auth.type";
import { useAuthStore } from "@/zustand/useAuth";

type PetType = UsersPetType;

const MyPageTabHeader = () => {
  const params = useParams();

  const { user } = useAuthStore();
  const id = params?.id || 0;
  const pathname = usePathname();

  const isViewingPetProfile = pathname.includes("fixMyPetProfile");

  const getPetData = async () => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return data;
  };

  const {
    data: pets,
    isPending: isPetPending,
    isError: isPetError
  } = useQuery<PetType[]>({
    queryKey: ["pets", id],
    queryFn: getPetData
  });

  const getProfileData = async () => {
    const response = await fetch(`/api/mypage/${id}/myprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: users,
    isPending,
    isError
  } = useQuery({
    queryKey: ["user"],
    queryFn: getProfileData
  });

  return (
    <div className="border-y border-gray-300">
      <div className="flex items-center justify-center py-3">
        {pets && pets.length ? (
          <Link href={`/mypage2/${id}/fixMyPetProfile/${pets?.[0]?.id || ""}`}>
            <span className={`cursor-pointer px-4 ${isViewingPetProfile ? "font-bold" : "text-gray-600"}`}>
              동물 프로필
            </span>
          </Link>
        ) : (
          <Link href={`/mypage2/${id}/addMyPetProfile`}>
            <span className={`cursor-pointer px-4 ${isViewingPetProfile ? "font-bold" : "text-gray-600"}`}>
              동물 프로필
            </span>
          </Link>
        )}
        <div className="h-6 w-px bg-gray-300"></div>
        <Link href={`/mypage2/${id}/fixMyProfile`}>
          <span className={`cursor-pointer px-4 ${!isViewingPetProfile ? "font-bold" : "text-gray-600"}`}>
            내 프로필
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MyPageTabHeader;
