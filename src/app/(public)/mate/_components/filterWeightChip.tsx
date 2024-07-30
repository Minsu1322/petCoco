import { Slider } from "@nextui-org/react";

interface FilterWeightChipProps {
  label: string;
  selected: string | null;
  onSelect: (value: string) => void;
}

const FilterWeightChip = ({ label, selected, onSelect}: FilterWeightChipProps) => {
  const selectedValue = selected ? parseInt(selected, 10) : 0;

  const handleChange = (value: number | number[]) => {
    // value가 배열이 아닌 경우에만 처리
    if (typeof value === 'number') {
      onSelect(value.toString());
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mt-5">
      <Slider
        color="foreground"
        step={2}
        maxValue={20}
        minValue={0}
        defaultValue={0}
        value={selectedValue}
        label={label}
        aria-label={label}
        className="max-w-md"
        onChange={handleChange}
      />
  </div>
  );
};

export default FilterWeightChip;
