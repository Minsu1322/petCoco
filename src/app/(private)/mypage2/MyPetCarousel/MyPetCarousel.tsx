import { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./components/MyPetCarouselDotButtons";
import styles from "./style/MyPetCarousel.module.css";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";
import Link from "next/link";
import { defaultPetImg } from "@/components/DefaultImg";
import Image from "next/image";
import LoadingComponent from "@/components/loadingComponents/Loading";

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

  if (isPetPending) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }

  if (isPetError) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <section className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={`${styles.embla__container} mt-3`}>
          {pets && pets.length ? (
            pets?.map((pet, i) => (
              <div className={`${styles.embla__slide} ml-[0.005rem] rounded-lg border-1 border-[#C2C0BD]`} key={i}>
                <Link key={pet.id} href={`/mypage2/${id}/fixMyPetProfile/${pet.id}`}>
                  <div className="flex items-center px-3 py-3">
                    <div className="pr-3">
                      <Image
                        className="h-[100px] w-[100px] rounded-lg bg-lime-300 object-cover"
                        width={100}
                        height={100}
                        src={pet.petImage ? pet.petImage : defaultPetImg}
                        alt="..."
                      />
                    </div>
                    <div className="">
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
                        <span className="text-base font-normal text-[#939396]">나이 </span>
                        <span className="text-base font-normal">{pet.age}살</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="mt-3 flex w-full flex-col rounded-[10px] bg-[#EFEFF0] p-3 text-center">
              <Link href={`/mypage2/${id}/addMyPetProfile`}>아직 아무 동물이 없어요!</Link>
            </div>
          )}
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
