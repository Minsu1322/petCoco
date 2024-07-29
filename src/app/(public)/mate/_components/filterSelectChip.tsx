import { Select, SelectSection, SelectItem } from "@nextui-org/react";

interface FilterSelectChipProps {
  label: string;
  array: Array<{ key: string; label: string }>;
  onSelect: (value: string) => void;
  selected: string | null;
}

const FilterSelectChip = ({ label, array, onSelect, selected }: FilterSelectChipProps) => {
  return (
    <div className="mt-5 flex w-full">
      <Select
        size="sm"
        radius="full"
        label={label}
        color="default"
        className="w-full max-w-xs"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value || "")}
      >
        {array.map((arr) => (
          <SelectItem key={arr.key} value={arr.key}>
            {arr.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default FilterSelectChip;
