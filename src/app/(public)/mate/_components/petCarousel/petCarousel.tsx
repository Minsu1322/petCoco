import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./components/MyPetCarouselDotButtons";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import styles from "../petCarousel/styles/css/petCarousel.module.css";

import { matepostpetsType } from "@/types/mate.type";
import PetItem from "../../posts/_components/petItem";

type PropType = {
  pets: matepostpetsType[];
  slides: number[];
  options?: EmblaOptionsType;
};

const PetCarousel: React.FC<PropType> = (props) => {
  const { slides, options, pets } = props;

  const autoplayOptions = {
    delay: 10000,
    stopOnInteraction: false
  };
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const handleSelect = useCallback(() => {
    if (emblaApi) {
      const selectedIndex = emblaApi.selectedScrollSnap();
      emblaApi.scrollTo(selectedIndex);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", handleSelect);
    }
  }, [emblaApi, handleSelect]);

  return (
    <section className={`${styles.embla}`}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {pets.map((pet) => (
           <div key={pet.id} className={`${styles.embla__slide}`}>
            <PetItem pet={pet} />
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.embla__dots}`}>
        {scrollSnaps.map((_, index) => (
          <DotButton key={index} onClick={() => onDotButtonClick(index)} selected={index === selectedIndex} />
        ))}
      </div>
    </section>
  );
};

export default PetCarousel;
