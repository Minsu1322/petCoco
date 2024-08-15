import { Slider } from "@nextui-org/react";

interface FilterWeightChipProps {
  label: string;
  selected: string | null;
  onSelect: (value: string) => void;
}

const FilterWeightChip = ({ label, selected, onSelect }: FilterWeightChipProps) => {
  const selectedValue = selected ? parseInt(selected, 10) : 0;

  const handleChange = (value: number | number[]) => {
    // value가 배열이 아닌 경우에만 처리
    if (typeof value === "number") {
      onSelect(value.toString());
    }
  };

  return (
    <div className="mt-5 flex w-full flex-col gap-6">
      <p className="text-[1rem] font-[400]">반려견 몸무게</p>
      <Slider
        color="foreground"
        step={1}
        maxValue={20}
        minValue={0}
        defaultValue={0}
        value={selectedValue}
        label={label}
        aria-label={label}        
        // classNames={{
        //   base: "max-w-md",
        //   track: "bg-gray-200 rounded-full", // 사용하지 않은 트랙 부분의 색상
        //   filler: "bg-mainColor rounded-full", // 사용한 트랙 부분의 색상
        //   thumb: "bg-mainColor border-0", // 슬라이더 핸들의 색상
         
        // }}
        onChange={handleChange}
      />
    </div>
  );
};

export default FilterWeightChip;
