import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import { gender } from "../array";

interface FilterSelectChipProps {
  label: string;
  array: Array<{ key: string; label: string }>;
}

const FilterSelectChip = ({ label, array}: FilterSelectChipProps) => {
  return (
    <div className="flex w-full mt-5">
      <Select 
        size="sm"
        radius="full"
        label={label}
        color="default"
        className="max-w-xs w-full" 
      >
        {array.map((arr) => (
          <SelectItem key={arr.key}>
            {arr.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
};

export default FilterSelectChip;
