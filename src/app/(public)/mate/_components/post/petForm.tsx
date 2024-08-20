"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UsersPetType } from "@/types/usersPet.type";
import { Pets } from "@/types/mate.type";
import { PetFormSkeleton } from "../Skeleton_UI/petFormSkeleton";


interface handlePetSelect {
  setFormPets: React.Dispatch<React.SetStateAction<Pets[]>>;
  userId: string;
}

const PetForm = ({ setFormPets, userId }: handlePetSelect) => {
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);

  const {
    data: userPets,
    isPending: isPetPending,
    error: petError
  } = useQuery<UsersPetType[]>({
    queryKey: ["userPets", userId],
    queryFn: async () => {
      const response = await fetch(`/api/mypage/${userId}/mypetprofile`);
      return response.json();
    },
    enabled: !!userId
  });

  const handlePetSelect = (petId: string) => {
    setSelectedPetIds(prevIds => {
      if (prevIds.includes(petId)) {
        return prevIds.filter(id => id !== petId);
      } else {
        return [...prevIds, petId];
      }
    });
  
    setFormPets(prevPets => {
      const updatedPets = prevPets.map(pet => ({
        ...pet,
        pet_id: pet.pet_id ? 
          (pet.pet_id.includes(petId) ? 
            pet.pet_id.filter(id => id !== petId) : 
            [...pet.pet_id, petId]
          ) : 
          [petId]
      }));
      return updatedPets;
    });
  };


  if (isPetPending) {
    return <PetFormSkeleton />
  }

  if (petError) {
    return <div className="ml-[1.5rem]">펫 정보를 불러오는 데 문제가 발생했습니다.</div>;
  }

  return (
    <div>
      {/* 반려동물 정보 */}
      <div className="mt-[1.63rem] flex items-center justify-between px-[1.5rem]">
        {/* TODO: 폰트 정해지면 간격 재조절 필요 */}
        {/* <p className="mt-[2.19rem] text-[0.85rem] font-[500]">반려견 정보 입력</p> */}
        <button
          type="button"
          className="text-[1rem] font-[600] text-black"
          // onClick={handleAddPets}
        >
          반려동물 정보 추가
        </button>
        <p className="mb-2 text-sm font-semibold text-subTitle1">다중 선택 가능</p>
      </div>
      <div className="mt-[0.81rem] flex w-full">
      <div className="mx-[1.5rem] w-full">
        {userPets && userPets.length > 0 ? (
          userPets.map((pet) => (
            <div key={pet.id} className="mb-2 flex items-center">
              <input
                type="checkbox"
                id={`pet-${pet.id}`}
                value={pet.id}
                onChange={() => handlePetSelect(pet.id)}
                checked={selectedPetIds.includes(pet.id)}
                className="mr-2"
              />
              <label htmlFor={`pet-${pet.id}`}>{pet.petName}</label>
            </div>
          ))
        ) : (
          <div className="text-subTitle2">
            <p>반려견 정보가 없습니다! </p>
            <p>마이페이지에서 반려견을 등록해 주세요🐾</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default PetForm;
