import { useEffect } from "react";
import { EmblaCarouselType } from "embla-carousel";

/**
 * embla캐러셀에 사용, 상호작용시 자동 재생을 멈추도록 하는 기능,
 * 예문:useStopAutoplayOnInteraction(emblaApi)
 */

const useStopAutoplayOnInteraction = (emblaApi: EmblaCarouselType | undefined) => {
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("pointerDown", () => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;
        autoplay.stop();
      });
    }
  }, [emblaApi]);
};

export default useStopAutoplayOnInteraction;
