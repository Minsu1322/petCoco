import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./components/MateCarouselDotButtons";
import carouselStyles from "./styles/css/mateCarouselStyle.module.css";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const MateCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

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
    <section className={carouselStyles.embla}>
      <div className={carouselStyles.embla__viewport} ref={emblaRef}>
        <div className={carouselStyles.embla__container}>
          {slides.map((index) => (
            <div className={carouselStyles.embla__slide} key={index}>
              <div className={carouselStyles.embla__slide__number}>{index * 3}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={carouselStyles.embla__controls}>
        <div className={carouselStyles.embla__dots}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`${carouselStyles.embla__dot} ${
                index === selectedIndex ? carouselStyles["embla__dot--selected"] : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MateCarousel;
