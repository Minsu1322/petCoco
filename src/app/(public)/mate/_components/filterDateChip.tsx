import { DatePicker, DateValue, Input } from "@nextui-org/react";

interface FilterDateChipProps {
  label: string;
  selectedDate: DateValue | null;
  onDateChange: (value: DateValue | null) => void;
}

const FilterDateChip = ({ label, selectedDate, onDateChange }: FilterDateChipProps) => {
  return (
    <DatePicker
      label={label}
      className="mt-5 w-full max-w-xs"
      radius="full"
      value={selectedDate}
      onChange={onDateChange}
    />
  );
};

export default FilterDateChip;
