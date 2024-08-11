import React, { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import styles from "./styles/AnimalCarousel.module.css";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { usePrevNextButtons } from "./components/AnimalCarouselArrowButtons";
import { useDotButton } from "./components/AnimalCarouselDotButtons";
import { useQuery } from "@tanstack/react-query";

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

  const fetchAnimalData = async () => {
    try {
      const response = await fetch(`/api/mainPage?type=${animalType}`);
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
    queryKey: [animalType],
    queryFn: fetchAnimalData
  });

  const randomAnimals = useMemo(() => {
    if (!animalData) return [];
    const shuffled = [...animalData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  }, [animalData]);

  const autoplay = Autoplay({ delay: 3000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    autoplay.reset();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi, onNavButtonClick);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(
    emblaApi,
    onNavButtonClick
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("pointerDown", () => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;
        autoplay.stop();
      });
    }
  }, [emblaApi]);

  if (isLoading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleButton} ${animalType === "dog" ? styles.active : ""}`}
          onClick={() => setAnimalType("dog")}
        >
          🐶 강아지
        </button>
        <button
          className={`${styles.toggleButton} ${animalType === "cat" ? styles.active : ""}`}
          onClick={() => setAnimalType("cat")}
        >
          😺 고양이
        </button>
      </div>

      <div className={styles.toggleContainer}></div>
      <div className="relative w-full overflow-hidden">
        <div className={`${styles.embla} ${styles.shrink} w-full`}>
          <div className={`${styles.embla__viewport} w-full`} ref={emblaRef}>
            <div className={`${styles.embla__container} flex`}>
              {randomAnimals.map((animal, index) => (
                <div className={`${styles.embla__slide} w-full flex-shrink-0`} key={index}>
                  <div className="m-2 rounded-lg bg-white p-3 shadow-md">
                    <h2 className="mb-1 text-center text-base font-semibold">{animal.careAddr}</h2>
                    <div className="mb-1 flex justify-center text-xs">
                      <span className="font-medium">{animal.careNm} 📞</span>
                      <span>{animal.officetel}</span>
                    </div>
                    <div className="flex">
                      <img src={animal.popfile} alt={animal.kindCd} className="h-32 w-1/2 rounded-lg object-cover" />
                      <div className="w-1/2 space-y-0.5 pl-2 text-xs">
                        <p>
                          <span className="font-medium">나이:</span> {animal.age}
                        </p>
                        <p>
                          <span className="font-medium">색상:</span> {animal.colorCd}
                        </p>
                        <p>
                          <span className="font-medium">중성화:</span> {animal.neuterYn === "Y" ? "예" : "아니오"}
                        </p>
                        <p>
                          <span className="font-medium">성별:</span> {animal.sexCd === "M" ? "수컷" : "암컷"}
                        </p>
                        <p>
                          <span className="font-medium">체중:</span> {animal.weight}
                        </p>
                      </div>
                    </div>
                    <p className="mt-1 text-xs">
                      <span className="font-medium">특징:</span> {animal.specialMark}
                    </p>
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
