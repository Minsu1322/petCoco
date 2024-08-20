import { defaultPetImg } from "@/components/DefaultImg";
import { UsersPetType } from "@/types/usersPet.type";
import Image from "next/image";
import { FaMars, FaVenus } from "react-icons/fa";

interface PetItemProps {
  pet: UsersPetType;
}

const PetItem = ({ pet }: PetItemProps) => {
  // 값이 없을 때 빈 문자열로 처리
  const petName = pet.petName ? `${pet.petName}` : "익명";
  const age = pet.age ? `${pet.age}살` : "";
  const gender = pet.male_female === "수" ? "남" : "여";
  const weight = pet.weight ? `${pet.weight}kg` : "";
  const neutralized = pet.neutralized === "TRUE" ? "했어요" : "안했어요";
  const introduction = pet.introduction || "";

  return (
    <div className="mb-[0.44rem] flex gap-x-[1rem] rounded-lg border border-[#C2C0BD] px-[0.69rem] py-[0.79rem]">
      <div className="my-auto flex flex-col items-center gap-y-[0.5rem] px-[1rem]">
        <div className="h-[3.75rem] w-[3.75rem]">
          <Image
            className="h-full w-full rounded-full object-cover"
            width={60}
            height={60}
            src={pet.petImage ? pet.petImage : defaultPetImg}
            alt="반려견 이미지"
          />
        </div>
        <div className="whitespace-nowrap rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-600">
          호스트 반려견
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center">
          <p className="mr-2 text-[1.25rem] font-bold">{petName}</p>
          <span className="flex items-center text-[1rem]">
            ({gender === "남" ? <FaMars className="inline-block" /> : <FaVenus className="inline-block" />})
          </span>
        </div>
        <div className="flex gap-x-[0.5rem] text-[1rem]">
          <p className="text-[#939396]">몸무게</p>
          <p>{weight}</p>
        </div>
        {/* </div> */}
        <div className="flex gap-x-[0.5rem] text-[1rem]">
          <p className="text-[#939396]">중성화 여부</p>
          <p>{neutralized}</p>
        </div>
        <div className="flex gap-x-[0.5rem] text-[1rem]">
          <p className="whitespace-nowrap text-[#939396]">성향</p>
          <p className="max-h-[50px] scrollbar-hide overflow-y-auto">{introduction}</p>
        </div>
      </div>
    </div>
  );
};

export default PetItem;
