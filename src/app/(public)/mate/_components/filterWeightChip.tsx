import { Slider } from "@nextui-org/react";

interface FilterWeightChipProps {
  label: string;
  // array: Array<{ key: string; label: string }>;
  // selected: string;
  // onSelect: (value: string) => void;
}

const FilterWeightChip = ({ label }: FilterWeightChipProps) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mt-5">
      <Slider
        color="foreground"
        step={2}
        maxValue={20}
        minValue={0}
        defaultValue={0}
        label={label}
        aria-label={label}
        className="max-w-md"
      />
  </div>
  );
};

export default FilterWeightChip;
