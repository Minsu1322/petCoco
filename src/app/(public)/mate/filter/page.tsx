"use client";

import FilterDateChip from "../_components/chip/filterDateChip";
import FilterWeightChip from "../_components/chip/filterWeightChip";
import FilterSelectChip from "../_components/chip/filterSelectChip";
import Button from "@/components/Button";
import { gender, age, regions, times, male_female } from "../selectOptionArray";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Male_femaleFilter from "../_components/button/male_femaleFilter";
import NeuteredFilter from "../_components/button/neuteredFilter";

// interface PostItemFilterTabProps {
//   updateFilter: (filterName: string, value: any) => void;
//   filters: {
//     gender: string | null;
//     date_time: string | undefined;
//     male_female: string | null;
//     age: string | null;
//     weight: string | null;
//     regions: string | null;
//     times: string | null;
//   };
//   onClick: () => void;
// }
export type Filters =  {
  gender: string | null;
  age: string | null;
  date_time: string | undefined;
  male_female: string | null;
  weight: string | null;
  regions: string | null;
  times: string | null;
  neutered: string | null;
}

const FilterPage = () => {
  const [filters, setFilters] = useState<Filters>({
    gender: null,
    age: null,
    date_time: undefined,
    male_female: null,
    weight: null,
    regions: null,
    times: null,
    neutered: null
  });
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedNeutered, setSelectedNeutered] = useState<string | null>(null);

  const router = useRouter();

  const updateFilter = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const handleSaveFilter = () => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });

    router.push(`/mate?${queryParams.toString()}`);
    // router.replace(`/mate?${queryParams.toString()}`);
  };

  const handleResetFilter = () => {
    setFilters({
      gender: null,
      age: null,
      date_time: undefined,
      male_female: null,
      weight: null,
      regions: null,
      times: null,
      neutered: null
    });
    setSelectedGender(null);
    setSelectedNeutered(null);

    router.push('/mate');
  };

  // console.log(filters);

  return (
    <div>
      <div className="w-[375px] mx-auto">
        <p className="ml-[1rem] mt-[1rem] text-[1.5rem] font-[600]">산책 메이트 상세 필터</p>
        <div className="w-full px-[1.5rem]">
          <FilterSelectChip
            label="성별"
            array={gender}
            selected={filters.gender}
            onSelect={(items) => updateFilter("gender", items)}
          />
          <FilterSelectChip
            label="연령대"
            array={age}
            selected={filters.age}
            onSelect={(items) => updateFilter("age", items)}
          />
          <FilterSelectChip
            label="지역별"
            array={regions}
            selected={filters.regions}
            onSelect={(items) => updateFilter("regions", items)}
          />
          <FilterDateChip
            label="산책일"
            selected={filters.date_time}
            onSelect={(items) => updateFilter("date_time", items)}
          />
          <FilterSelectChip
            label="시간대"
            array={times}
            selected={filters.times}
            onSelect={(items) => updateFilter("times", items)}
          />
        </div>
        <p className="ml-[1rem] mt-[3.38rem] text-[1.5rem] font-[600]">반려견 정보 필터</p>
        <div className="mt-5 px-[1.5rem]">
          <Male_femaleFilter selectedGender={selectedGender} setSelectedGender={setSelectedGender} onSelect={(items) => updateFilter("male_female", items)} />
          <NeuteredFilter selectedNeutered={selectedNeutered} setSelectedNeutered={setSelectedNeutered} onSelect={(items) => updateFilter("neutered", items)} />
          <FilterWeightChip
            label="몸무게"
            selected={filters.weight}
            onSelect={(items) => updateFilter("weight", items)}
          />
        </div>
        <div className="mb-[6.63rem] mt-[3.63rem] flex flex-col gap-y-[0.5rem] px-[1.5rem]">
          <Button
            className="flex w-full cursor-pointer items-center justify-center rounded-[0.5rem] bg-mainColor px-[8.53rem] py-[0.75rem] text-[0.9375rem] font-[590] text-white"
            text="저장하기"
            onClick={handleSaveFilter}
          />
          <Button
            className="flex w-full cursor-pointer items-center justify-center rounded-[0.5rem] border-1 border-mainColor px-[8rem] py-[0.75rem] text-[0.9375rem] font-[590] text-mainColor"
            text="초기화 하기"
            onClick={handleResetFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
