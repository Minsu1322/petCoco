import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./components/MyPetCarouselDotButtons";
import styles from "./style/MyPetCarousel.module.css";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";
import Link from "next/link";
import { defaultPetImg } from "@/components/DefaultImg";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};
type PetType = UsersPetType;

const MyPetCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const params = useParams();
  const id = params?.id || 0;

  const getPetData = async () => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: pets,
    isPending: isPetPending,
    isError: isPetError
  } = useQuery<PetType[]>({
    queryKey: ["pets", id],
    queryFn: getPetData
  });

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
          {pets?.map((pet, i) => (
            <div className={`${styles.embla__slide}`} key={i}>
              <Link key={pet.id} href={`/mypage2/${id}/fixMyPetProfile/${pet.id}`}>
                <div className="flex gap-[10px]">
                  <div className="my-2 px-5">
                    <img
                      className="h-[60px] w-[60px] rounded-full bg-lime-300 object-cover"
                      src={pet.petImage ? pet.petImage : defaultPetImg}
                      alt="..."
                    />
                  </div>
                  <div className="pl-2">
                    <div>
                      <span className="text-lg font-normal">{pet.petName} </span>
                      <span className="text-sm font-normal">({pet.male_female})</span>
                    </div>
                    <div>
                      <span className="text-base font-normal text-[#939396]">몸무게 </span>
                      <span className="text-base font-normal">{pet.weight}kg</span>
                    </div>
                    <div>
                      <span className="text-base font-normal text-[#939396]">중성화 여부 </span>
                      <span className="text-base font-normal">{pet.neutralized}</span>
                    </div>
                    <div>
                      <span className="text-base font-normal text-[#939396]">성향 </span>
                      <span className="text-base font-normal">{pet.introduction}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.embla__dots}>
        {scrollSnaps.map((_, index) => (
          <DotButton key={index} onClick={() => onDotButtonClick(index)} selected={index === selectedIndex} />
        ))}
      </div>
    </section>
  );
};

export default MyPetCarousel;
