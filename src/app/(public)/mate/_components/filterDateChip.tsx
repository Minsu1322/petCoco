import { Input } from "@nextui-org/react";

interface FilterDateChipProps {
  label: string;
  selected: string | undefined;
  onSelect: (value: string) => void;
}

const FilterDateChip = ({ label, onSelect, selected }: FilterDateChipProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value);
  };
  return (
    // <DatePicker
    //   label={label}
    //   className="mt-5 w-full max-w-xs"
    //   radius="full"
    //   value={selected}
    //   onChange={onSelect}
    // />
    <Input type="date" label={label} value={selected} onChange={handleChange} />
  );
};

export default FilterDateChip;
