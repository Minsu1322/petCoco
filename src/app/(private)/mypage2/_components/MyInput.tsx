import { forwardRef, InputHTMLAttributes, Ref } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const MyInput = forwardRef<HTMLInputElement, InputProps>(({ label, ...inputProps }, ref) => {
  return (
    <>
      <label htmlFor="changeNickName" className="text-[15px] font-normal leading-[20px] text-[#3c3c3c]">
        {label}
      </label>
      <input
        ref={ref as Ref<HTMLInputElement>}
        className="mt-1 w-full rounded-lg border-[0.5px] border-[#999999] px-4 py-3 text-[15px] font-normal leading-[20px]"
        {...inputProps}
      />
    </>
  );
});

export default MyInput;
