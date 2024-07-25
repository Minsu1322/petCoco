import { MatePostFullType } from "@/types/mate.type";
import Link from "next/link";
import ItemButton from "./itemButton";
import Image from "next/image";
import { getDistanceHaversine } from "../getDistanceHaversine";
import { locationStore } from "@/zustand/locationStore";

interface MatePostItemPorps {
  post: MatePostFullType;
}

const MatePostItem = ({ post }: MatePostItemPorps) => {
  const { geoData, setGeoData, isUseGeo, setIsUseGeo } = locationStore();
  // 시간 변환 함수로 분리
  const time = post.dateTime?.split("T")[1].split(":");
  const convertPeriod = time && (Number(time[0]) < 12 ? "오전" : "오후");
  const convertHour = time && (Number(time[0]) % 12 || 12);
  const convertMin = time && time[1];

  const calculateDistance = () => {
      if (isUseGeo && geoData && post.position) {
        const distance = getDistanceHaversine({
          curPosition: geoData.center,
          desPosition: post.position.center
        });
        return distance.toFixed(1); 
      }
    return null;
  };

  const distance = calculateDistance();

  return (
    <Link href={`/mate/posts/${post.id}`} className="mb-5 flex w-10/12 flex-col gap-y-5 rounded-xl bg-gray-200 p-5">
      <div className="flex flex-row gap-x-10">
        <div className="ml-3">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN26a7CVa5ryzx5psOXRzK2a-OfomhbbUbw-zxRX7D835ImjsmTOc2tIgkc-LXQ2cFrf0&usqp=CAU"
            alt="사용자 프로필 이미지"
            width={70}
            height={70}
          />
          <p className="mt-2 text-center w-16 overflow-hidden overflow-ellipsis whitespace-nowrap"> {post && post.users?.nickname}</p>
        </div>
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <p className="w-52 overflow-hidden overflow-ellipsis whitespace-nowrap">{post.title}</p>
            {distance !== null ? <p>현재 위치에서의 거리: {distance} km</p> : <p></p>}
          </div>
          {/* <p>{post.content}</p> */}
          <p>날짜 : {post.dateTime?.split("T")[0]}</p>
          <p>시간 : {`${convertPeriod} ${convertHour}시 ${convertMin}분`}</p>
          <p>모집인원 수 {post.members}</p>
          <div className="mt-2 flex flex-row gap-x-2">
            <ItemButton text={post.size} className="flex h-7 w-20 items-center justify-center rounded-full bg-white" />
            <ItemButton
              text={post.characteristics}
              className="flex h-7 w-20 items-center justify-center rounded-full bg-white px-2"
              p_className="w-17 overflow-hidden overflow-ellipsis whitespace-nowrap"
            />
            <ItemButton
              text={Number(post.members) > 1 ? "다인원 산책" : "소인원 산책"}
              className="flex h-7 w-24 items-center justify-center rounded-full bg-white"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-3">
        <ItemButton
          text={post.recruiting ? "모집 중" : "모집 완료"}
          className="w-24 rounded-full bg-white p-3 text-center"
        />
        <ItemButton text="1:1 채팅" className="w-24 rounded-full bg-white p-3 text-center" />
      </div>
    </Link>
  );
};

export default MatePostItem;
