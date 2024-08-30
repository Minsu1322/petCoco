import { useCallback, useEffect } from "react";
import { EmblaCarouselType } from "embla-carousel";

/**
 * embla캐러셀에 사용, 인덱스를 가져와서 해당 인덱스로 스크롤하는 역할을 합니다.,
 * 예문:useEmblaSelect(emblaApi)
 */

const useEmblaSelect = (emblaApi: EmblaCarouselType | undefined) => {
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
};

export default useEmblaSelect;
