import {DatePicker, Input} from "@nextui-org/react";

interface FilterDateChipProps {
  label: string;
}

const FilterDateChip = ({ label }: FilterDateChipProps) => {
  return (
    <DatePicker label={label} className="max-w-xs mt-5 w-full" radius="full" />
    //  <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-5">
    //   <Input type="date" label={label} size="sm" radius="full"/>
    // </div>
  )
};

export default FilterDateChip;
