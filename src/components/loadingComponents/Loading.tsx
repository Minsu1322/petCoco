import Image from "next/image";

const LoadingComponent = () => {
  return (
    <div className="my-5 flex items-center justify-center rounded-lg py-5">
      <Image
        src="/assets/svg/Loading.svg"
        alt="Loading Icon"
        width={48}
        height={48}
        className="animate-spin drop-shadow-[0_0_10px_#8E6EE8]"
        priority
      />
    </div>
  );
};

export default LoadingComponent;
