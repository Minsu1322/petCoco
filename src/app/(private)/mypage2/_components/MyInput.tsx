import { forwardRef, InputHTMLAttributes, Ref } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const MyInput = forwardRef<HTMLInputElement, InputProps>(({ label, ...inputProps }, ref) => {
  return (
    <>
      <label htmlFor="changeNickName" className="text-base font-medium leading-normal text-[#61646B]">
        {label}
      </label>
      <input
        ref={ref as Ref<HTMLInputElement>}
        className="mt-1 w-full rounded-lg border-[0.5px] border-[#AFB1B6] px-4 py-3 text-base font-medium text-[#292826]"
        {...inputProps}
      />
    </>
  );
});

MyInput.displayName = "MyInput";

export default MyInput;
