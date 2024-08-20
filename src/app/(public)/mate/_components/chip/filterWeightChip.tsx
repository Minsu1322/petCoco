// import { Slider } from "@nextui-org/react";
import { useState } from "react";
import {Slider, SliderValue} from "@nextui-org/react";

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
      <Slider
        // color="foreground"
        step={1}
        maxValue={20}
        minValue={0}
        defaultValue={0}
        value={selectedValue}
        label={label}
        aria-label={label}        
        onChange={handleChange}
        getValue={(weight) => `${weight}kg 이상`}
        showTooltip={true}
        classNames={{
          base: "max-w-md",
          filler: "bg-mainColor",
          label: "text-[1rem] font-[400]",
          value: "text-sm  font-[400] text-gray-500",
          thumb: [
            "bg-mainColor",
            "border border-mainColor",
            "shadow-md",
          ],
          track: "bg-gray-200",
        }}
      />
      {/* <Slider 
        // label={label}
        color="foreground"
        step={10}
        maxValue={40}
        minValue={0}
        value={value} 
        onChange={handleChange}
        className="max-w-md"
        getValue={(value) => `${value}kg 이상`}
      /> */}
    </div>
  );
};

export default FilterWeightChip;
