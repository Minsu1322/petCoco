"use client";

import FilterSelectChip from "./filterSelectChip";
import FilterDateChip from "./filterDateChip";
import FilterWeightChip from "./filterWeightChip";
import { gender, age, male_female } from "../array";

interface PostItemFilterTabProps {
  updateFilter: (filterName: string, value: any) => void;
  filters: {
    gender: string | null,
    date_time: string | undefined,
    male_female: string | null,
    age: string | null,
    weight: string | null,
  };
  onClick: () => void;
}

const PostItemFilterTab = ({ updateFilter, filters, onClick }: PostItemFilterTabProps) => {

  return (
    <div className="w-full">
      <div className="w-full">
        <p className="text-lg text-gray-500">메이트 상세 필터</p>
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
        <FilterDateChip
          label="산책일" 
          selected={filters.date_time} 
          onSelect={(items) => updateFilter("date_time", items)} 
        />  
      </div>
      <div className="mt-5">
        <p className="text-lg text-gray-500">반려견 정보 필터</p>
        <FilterWeightChip label="반려견 몸무게" selected={filters.weight} 
          onSelect={(items) => updateFilter("weight", items)}  />
        <FilterSelectChip
          label="성별"
          array={male_female}
          selected={filters.male_female}
          onSelect={(items) => updateFilter("male_female", items)}
        />
      </div>
      <div className="mt-7 flex">
            <div className="mb-4 h-12 w-full cursor-pointer items-center rounded-lg border-2 border-mainColor p-2 text-center" onClick={onClick}>
              초기화
            </div>
          </div>
    </div>
  );
};

export default PostItemFilterTab;
