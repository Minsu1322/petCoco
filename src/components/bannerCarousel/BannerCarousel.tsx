import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./styles/BannerCarousel.module.css";
import Image from "next/image";
import { BannerImages } from "@/app/utils/Banner";
import Autoplay from "embla-carousel-autoplay";
import useStopAutoplayOnInteraction from "@/hooks/useStopAutoplayOnInteraction";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const BannerCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel({ ...options, loop: true }, [autoplay]);

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
    return () => {
      if (emblaApi) {
        emblaApi.off("select", handleSelect);
      }
    };
  }, [emblaApi, handleSelect]);

  useStopAutoplayOnInteraction(emblaApi);

  return (
    <section className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {slides.map((index) => (
            <div className={styles.embla__slide} key={index}>
              <div style={{ position: "relative", width: "100%", height: "180px" }}>
                <Image
                  src={BannerImages[index]}
                  alt={`Banner ${index + 1}`}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;
