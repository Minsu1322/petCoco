import FilterSelectChip from "./filterSelectChip";
import FilterDateChip from "./filterDateChip";
import { gender, ageRange, location, petGender } from "../array";

const PostItemFilterTab = () => {
  return (
    <div className="w-full">
      <div>
        <p className="text-lg">메이트 상세 필터</p>
        <FilterSelectChip label="성별" array={gender} />
        <FilterSelectChip label="연령대" array={ageRange} />
        <FilterDateChip label="산책일" />
        <FilterSelectChip label="거리" array={location} />
      </div>
      <div className="mt-5">
        <p className="text-lg">반려견 정보 필터</p>
        <FilterSelectChip label="성별" array={petGender} />
      </div>
    </div>
  );
};

export default PostItemFilterTab;
