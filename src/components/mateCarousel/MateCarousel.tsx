import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./components/MateCarouselDotButtons";
import carouselStyles from "./styles/css/mateCarouselStyle.module.css";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { MatePostsAndUsersResponse } from "@/types/mainPageTypes/MainPageTypes";
import { fetchPostsMate } from "@/app/utils/mainPageFetch";
import { useQuery } from "@tanstack/react-query";
import startChat from "@/app/utils/startChat";
import Link from "next/link";
import { format, parseISO } from "date-fns";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const MateCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    data: mateResponse,
    isLoading: isMateLoading,
    error: mateError
  } = useQuery<MatePostsAndUsersResponse, Error>({
    queryKey: ["matePosts"],
    queryFn: fetchPostsMate
  });

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

  const formatDateTime = (dateTime: string) => {
    const date = parseISO(dateTime);
    return format(date, "yyyy.MM.dd | h:mm a");
  };

  return (
    <section className={carouselStyles.embla}>
      <div className={carouselStyles.embla__viewport} ref={emblaRef}>
        <div className={carouselStyles.embla__container}>
          {mateResponse?.data.map((post, index) => {
            const users = post.users[0];
            const formattedDateTime = post.date_time
              ? format(parseISO(post.date_time), "yyyy.MM.dd | h:mm a")
              : "날짜 정보 없음";

            return (
              <div className={`${carouselStyles.embla__slide}`} key={post.id}>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate/posts/${post.id}`}>
                  {/* Recruitment Period */}
                  <div className="mb-4 text-sm text-gray-600">
                    {post.recruitment_start && post.recruitment_end && (
                      <p className="whitespace-nowrap">
                        {format(parseISO(post.recruitment_start), "yyyy.MM.dd")} ~
                        {format(parseISO(post.recruitment_end), "yyyy.MM.dd")}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-md">
                    <div className="relative flex">
                      {/* Left Column for Recruitment Dates and Profile Image */}
                      <div className="flex w-1/3 flex-col items-center justify-between">
                        {/* Profile Image */}
                        <img
                          src={
                            users?.profile_img ||
                            "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/profile_img/default-profile.jpg"
                          }
                          alt="User Profile"
                          className="mb-2 h-24 w-24 rounded-full object-cover"
                        />
                        {/* Nickname and Likes */}
                        <div className="mb-4 flex flex-col items-center">
                          <p className="mb-1 text-sm text-gray-600">{users?.nickname || "닉네임"}</p>
                          <div className="flex items-center">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xl text-gray-700">
                              A
                            </div>
                            <span className="ml-2 text-sm">15</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column for Title and Details */}
                      <div className="ml-4 w-2/3">
                        {/* Title and Details */}
                        <h3 className="mb-2 text-lg font-semibold">{post.title}</h3>
                        <p className="mb-2 text-sm text-gray-600">{post.place_name}</p>
                        <p className="mb-2 text-sm text-gray-600">{formattedDateTime}</p>
                        <div className="mb-2 flex items-center">
                          <p className="mr-2 text-sm">인원: {post.members}</p>
                          {post.recruiting ? (
                            <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-700">모집중</span>
                          ) : (
                            <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">모집완료</span>
                          )}
                        </div>
                        <button
                          className="w-full rounded-lg bg-[#8E6EE8] py-2 text-white transition duration-300 hover:bg-[#7d5bcd]"
                          onClick={() => startChat(users.id, user, router)}
                        >
                          채팅하기
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className={carouselStyles.embla__dots}>
        {scrollSnaps.map((_, index) => (
          <DotButton key={index} onClick={() => onDotButtonClick(index)} selected={index === selectedIndex} />
        ))}
      </div>
    </section>
  );
};

export default MateCarousel;
