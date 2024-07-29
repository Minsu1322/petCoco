"use client";

import FilterSelectChip from "./filterSelectChip";
// import FilterDateChip from "./filterDateChip";
// import FilterWeightChip from "./filterWeightChip";
import { gender, age, position, male_female } from "../array";
import { DateValue } from "@nextui-org/react";
import { useState } from "react";

interface PostItemFilterTabProps {
  updateFilter: (filterName: string, value: any) => void;
  filters: {
    gender: string | null,
    date_time: DateValue | null,
    // position: string | null,
    male_female: string | null,
    age: string | null,
    weight: string | null,
  };
}

const PostItemFilterTab = ({ updateFilter, filters }: PostItemFilterTabProps) => {
  const [date_time, setDate_time] = useState<DateValue | null>(null);

  return (
    <div className="w-full">
      <div>
        <p className="text-lg">메이트 상세 필터</p>
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
        {/* <FilterDateChip 
          label="산책일" 
          selected={filters.date_time} 
          onSelect={(items) => updateFilter("date_time", items)} 
        />   */}
        {/* <FilterSelectChip
          label="거리"
          array={position}
          selected={filters.position}
          onSelect={(items) => updateFilter("position", items)}
        /> */}
      </div>
      <div className="mt-5">
        <p className="text-lg">반려견 정보 필터</p>
        {/* <FilterWeightChip label="반려견 몸무게" /> */}
        <FilterSelectChip
          label="성별"
          array={male_female}
          selected={filters.male_female}
          onSelect={(items) => updateFilter("male_female", items)}
        />
      </div>
    </div>
  );
};

export default PostItemFilterTab;
