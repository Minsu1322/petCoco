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
    <Input 
      type="date" 
      label={label} 
      value={selected || ""} 
      radius="full" 
      onChange={handleChange} 
      className="mt-5 w-full" 
    />
  );
};

export default FilterDateChip;
