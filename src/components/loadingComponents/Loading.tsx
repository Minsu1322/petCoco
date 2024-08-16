import Image from "next/image";

const LoadingComponent = () => {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-lg bg-[#D2CDF6]">
      <Image
        src="/assets/svg/Loading.svg"
        alt="Loading Icon"
        width={64}
        height={64}
        className="animate-spin drop-shadow-[0_0_10px_#8E6EE8]"
      />
    </div>
  );
};

export default LoadingComponent;
