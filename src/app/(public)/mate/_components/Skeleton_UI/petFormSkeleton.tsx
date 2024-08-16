export const PetFormSkeleton = () => (
  <div className="animate-pulse">
    <div className="mt-[1.63rem] flex items-center justify-between px-[1.5rem]">
      <div className="h-6 w-40 bg-gray-200 rounded"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-[0.81rem] flex w-full">
      <div className="mx-[1.5rem] w-full">
        {[1, 2, 3].map((index) => (
          <div key={index} className="mb-2 flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);