import React, { useCallback } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { PetCarouselButton, useDotButton } from './petCarouselButton';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import styles from '../petCarousel/styles/css/petCarousel.module.css';

import { matepostpetsType } from "@/types/mate.type";
import PetItem from '../../posts/_components/petItem';

type PropType = {
  pets: matepostpetsType[];
  slides: number[];
  options?: EmblaOptionsType;
}

const PetCarousel: React.FC<PropType> = (props) => {
  const { slides, options, pets } = props;

  const autoplayOptions = {
    delay: 10000, // 3초 주기
    stopOnInteraction: false
  };
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(autoplayOptions)])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  return (
    <section className={styles.embla}>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.embla__container}>
          {pets.map((pet) => (
            <div key={pet.id} className={styles.embla__slide}>
              <PetItem pet={pet} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.embla__controls}>
        <div className={styles.embla__dots}>
          {scrollSnaps.map((_, index) => (
            <PetCarouselButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`${styles.embla__dot} ${
                index === selectedIndex ? styles['embla__dot--selected'] : ''
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PetCarousel;