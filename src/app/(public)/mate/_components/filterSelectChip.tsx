import { Select, SelectSection, SelectItem } from "@nextui-org/react";

interface FilterSelectChipProps {
  label: string;
  array: Array<{ key: string; label: string }>;
  onSelect: (value: string) => void; 
  selected: string | null;
}

const FilterSelectChip = ({ label, array, onSelect, selected }: FilterSelectChipProps) => {
  return (
    <div className="flex w-full mt-5">
      <Select 
      size="sm" 
      radius="full" 
      label={label} 
      color="default" 
      className="w-full max-w-xs"
      selectedKeys={selected ? [selected] : []}
      onSelectionChange={(keys) => {
        const selectedValue = Array.from(keys)[0] as string;
        onSelect(selectedValue);
      }}
    >
      {array.map((arr) => (
        <SelectItem key={arr.key} value={arr.key}>{arr.label}</SelectItem>
      ))}
    </Select>
    </div>
  );
};

export default FilterSelectChip;