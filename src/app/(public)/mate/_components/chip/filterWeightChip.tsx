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
      <Slider
        color="foreground"
        step={1}
        maxValue={20}
        minValue={0}
        defaultValue={0}
        value={selectedValue}
        label={label}
        aria-label={label}
        className="w-full"
        onChange={handleChange}
      />
    </div>
  );
};

export default FilterWeightChip;
