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
    <div
      className={`relative ${
        isViewingPetProfile
          ? "before:absolute before:bottom-0 before:left-0 before:z-10 before:w-1/2 before:border-[2px] before:border-b-2 before:border-[#D2CDF6] before:content-['']"
          : "after:absolute after:bottom-0 after:right-0 after:z-10 after:w-1/2 after:border-[2px] after:border-b-2 after:border-[#D2CDF6] after:content-['']"
      }`}
    >
      <div className="flex items-center justify-around py-3">
        {pets && pets.length ? (
          <Link href={`/mypage2/${id}/fixMyPetProfile/${pets?.[0]?.id || ""}`}>
            <span className={`cursor-pointer ${isViewingPetProfile ? "font-bold" : "text-gray-600"}`}>동물 프로필</span>
          </Link>
        ) : (
          <Link href={`/mypage2/${id}/addMyPetProfile`}>
            <span className={`cursor-pointer ${isViewingPetProfile ? "font-bold" : "text-gray-600"}`}>동물 프로필</span>
          </Link>
        )}

        <Link href={`/mypage2/${id}/fixMyProfile`}>
          <span className={`cursor-pointer ${!isViewingPetProfile ? "font-bold" : "text-gray-600"}`}>내 프로필</span>
        </Link>
      </div>
    </div>
  );
};

export default MyPageTabHeader;
