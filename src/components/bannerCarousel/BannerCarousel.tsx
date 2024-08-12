import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./styles/BannerCarousel.module.css";
import { createClient } from "@/supabase/client";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const BannerImages = [
  "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/Mainbanner001.png",
  "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/Mainbanner002.png"
];

const BannerCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

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
    <section className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {slides.map((index) => (
            <div className={styles.embla__slide} key={index}>
              <img src={BannerImages[index]} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;
