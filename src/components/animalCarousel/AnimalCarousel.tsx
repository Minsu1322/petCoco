import React, { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import styles from "./styles/AnimalCarousel.module.css";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { usePrevNextButtons } from "./components/AnimalCarouselArrowButtons";
import { DotButton, useDotButton } from "./components/AnimalCarouselDotButtons";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../loadingComponents/Loading";
import Image from "next/image";
type AnimalData = {
  age: string;
  careAddr: string;
  careNm: string;
  colorCd: string;
  filename: string;
  kindCd: string;
  neuterYn: string;
  officetel: string;
  popfile: string;
  sexCd: string;
  specialMark: string;
  weight: string;
};

type AnimalCarouselProps = {
  slides: number[];
  options?: EmblaOptionsType;
};

const AnimalCarousel: React.FC<AnimalCarouselProps> = ({ slides, options }) => {
  const [animalType, setAnimalType] = useState<"dog" | "cat">("dog");
  const [selectedRegion, setSelectedRegion] = useState<string>("6110000");

  const regions = [
    { orgCd: "6110000", orgdownNm: "서울특별시" },
    { orgCd: "6260000", orgdownNm: "부산광역시" },
    { orgCd: "6270000", orgdownNm: "대구광역시" },
    { orgCd: "6280000", orgdownNm: "인천광역시" },
    { orgCd: "6290000", orgdownNm: "광주광역시" },
    { orgCd: "5690000", orgdownNm: "세종특별자치시" },
    { orgCd: "6300000", orgdownNm: "대전광역시" },
    { orgCd: "6310000", orgdownNm: "울산광역시" },
    { orgCd: "6410000", orgdownNm: "경기도" },
    { orgCd: "6530000", orgdownNm: "강원특별자치도" },
    { orgCd: "6430000", orgdownNm: "충청북도" },
    { orgCd: "6440000", orgdownNm: "충청남도" },
    { orgCd: "6540000", orgdownNm: "전북특별자치도" },
    { orgCd: "6460000", orgdownNm: "전라남도" },
    { orgCd: "6470000", orgdownNm: "경상북도" },
    { orgCd: "6480000", orgdownNm: "경상남도" },
    { orgCd: "6500000", orgdownNm: "제주특별자치도" }
  ];

  const fetchAnimalData = async () => {
    try {
      const response = await fetch(`/api/mainPage?type=${animalType}&region=${selectedRegion}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.response.body.items.item as AnimalData[];
    } catch (error) {
      console.error(`Fetching ${animalType} data failed:`, error);
      throw error;
    }
  };

  const {
    data: animalData,
    isLoading,
    error
  } = useQuery({
    queryKey: [animalType, selectedRegion],
    queryFn: fetchAnimalData
  });

  const randomAnimals = useMemo(() => {
    if (!animalData) return [];
    const shuffled = [...animalData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  }, [animalData]);

  const autoplay = Autoplay({ delay: 3000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("pointerDown", () => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;
        autoplay.stop();
      });
    }
  }, [emblaApi]);

  if (isLoading) return <LoadingComponent />;
  if (error) return <div className="py-8 text-center text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="p-4 pb-2 text-2xl font-bold text-[#e67e6c]">가족을 기다리고 있어요!</h2>
      <div className="mb-4 mt-2 flex justify-center space-x-4 whitespace-nowrap px-3">
        <button
          className={`rounded-full border px-10 py-2 text-lg font-semibold transition-all duration-300 ${
            animalType === "dog"
              ? "border-[#7FA6EE] bg-[rgba(177,208,255,0.30)] font-semibold text-[#7FA6EE]"
              : "border-[#7FA6EE] bg-white text-gray-700"
          }`}
          onClick={() => setAnimalType("dog")}
        >
          🐶 강아지
        </button>
        <button
          className={`rounded-full border px-10 py-2 text-lg font-semibold transition-all duration-300 ${
            animalType === "cat"
              ? "border-[#11BBB0] bg-[rgba(17,187,176,0.10)] font-semibold text-[#11BBB0]"
              : "border-[#11BBB0] bg-white text-gray-700"
          }`}
          onClick={() => setAnimalType("cat")}
        >
          😺 고양이
        </button>
      </div>

      <div className="mb-2 px-4">
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 p-2"
        >
          {regions.map((region) => (
            <option key={region.orgCd} value={region.orgCd}>
              {region.orgdownNm}
            </option>
          ))}
        </select>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className={`${styles.embla} w-full`}>
          <div className={`${styles.embla__viewport} w-full`} ref={emblaRef}>
            <div className={`${styles.embla__container} flex`}>
              {randomAnimals.map((animal, index) => (
                <div className={`${styles.embla__slide} w-full flex-shrink-0`} key={index}>
                  <div className="m-2 rounded-lg bg-white p-2 shadow-md">
                    <h2 className="text-14 mb-1 text-base font-semibold">
                      {animal.careNm}(📞{animal.officetel})
                    </h2>
                    <p className="text-12 mb-4 truncate font-normal">{animal.careAddr}</p>
                    <div className="flex">
                      <Image
                        src={animal.popfile}
                        alt={animal.kindCd}
                        width={128}
                        height={128}
                        style={{ width: "128px", height: "128px" }}
                        className="rounded-lg object-cover"
                      />
                      <div className="ml-4 space-y-1">
                        <p className="text-14 font-normal">
                          <span className="font-medium">이름:</span> {animal.kindCd}
                        </p>
                        <p className="text-14 font-normal">
                          <span className="font-medium">성별:</span> {animal.sexCd === "M" ? "수컷" : "암컷"}
                        </p>
                        <p className="text-14 font-normal">
                          <span className="font-medium">나이:</span> {animal.age}
                        </p>
                        <p className="text-14 font-normal">
                          <span className="font-medium">색상:</span> {animal.colorCd}
                        </p>
                        <p className="text-14 font-normal">
                          <span className="font-medium">체중:</span> {animal.weight}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCarousel;
