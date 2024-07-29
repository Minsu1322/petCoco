import { DatePicker, DateValue, Input } from "@nextui-org/react";

interface FilterDateChipProps {
  label: string;
  selected: DateValue | null;
  onSelect: (value: DateValue | null) => void;
}

const FilterDateChip = ({ label, onSelect, selected }: FilterDateChipProps) => {
  return (
    <DatePicker
      label={label}
      className="mt-5 w-full max-w-xs"
      radius="full"
      value={selected}
      onChange={onSelect}
    />
  );
};

export default FilterDateChip;
  