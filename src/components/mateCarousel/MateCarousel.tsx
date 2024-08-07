import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { MatePostsAndUsersResponse } from "@/types/mainPageTypes/MainPageTypes";

interface MateCarouselProps {
  mateResponse: MatePostsAndUsersResponse;
}

const MateCarousel: React.FC<MateCarouselProps> = ({ mateResponse }) => {
  const [emblaRef] = useEmblaCarousel({ loop: false });

  return (
    <div className="mate-embla" ref={emblaRef}>
      <style jsx>{`
        .mate-embla {
          overflow: hidden;
        }
        .mate-embla__container {
          display: flex;
        }
        .mate-embla__slide {
          flex: 0 0 100%;
          min-width: 0;
        }
      `}</style>
      <div className="embla__container">
        {mateResponse?.data.slice(0, 5).map((post) => {
          const user = mateResponse.users?.find((u) => u.id === post.user_id);
          return (
            <div key={post.id} className="embla__slide">
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate/posts/${post.id}`}>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                  <div className="flex items-center space-x-2">
                    <img src={user?.profile_img} alt="User Profile" className="h-10 w-10 rounded-full" />
                    <div>
                      <div className="font-semibold">{post.title}</div>
                      <div className="text-xs text-gray-500">{post.place_name}</div>
                      <div className="text-xs text-gray-500">
                        {post.recruitment_start && new Date(post.recruitment_start).toLocaleDateString()} ~
                        {post.recruitment_end && new Date(post.recruitment_end).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">모집인원: {post.members}</div>
                    {post.recruiting ? (
                      <div className="rounded bg-green-200 px-2 py-1 text-xs text-green-700">모집중</div>
                    ) : (
                      <div className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">모집완료</div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MateCarousel;
