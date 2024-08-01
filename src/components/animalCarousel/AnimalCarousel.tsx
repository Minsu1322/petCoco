import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import styles from "./styles/AnimalCarousel.module.css";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { NextButton, PrevButton, usePrevNextButtons } from "./components/AnimalCarouselArrowButtons";
import { DotButton, useDotButton } from "./components/AnimalCarouselDotButtons";

type AnimalCarouselProps = {
  slides: number[];
  options?: EmblaOptionsType;
};

const AnimalCarousel: React.FC<AnimalCarouselProps> = ({ slides, options }) => {
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

  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {slides.map((index) => (
            <div className={styles.embla__slide} key={index}>
              <div className={styles.embla__slide__inner} style={{ backgroundColor: `hsl(${index * 60}, 80%, 60%)` }}>
                <span className={styles.embla__slide__text}>Animal {index + 1}</span>
              </div>
              {/* <img
                className={styles.embla__slide__img}
                src={`/images/animal${index + 1}.jpg`}
                alt={`Animal ${index + 1}`}
              /> */}
            </div>
          ))}
        </div>
      </div>

      <PrevButton className={styles.embla__prev} onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton className={styles.embla__next} onClick={onNextButtonClick} disabled={nextBtnDisabled} />

      <div className={styles.embla__dots}>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`${styles.embla__dot}${index === selectedIndex ? ` ${styles.embla__dot__selected}` : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimalCarousel;
