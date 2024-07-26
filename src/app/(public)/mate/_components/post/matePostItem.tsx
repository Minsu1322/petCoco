import { MatePostAllType } from "@/types/mate.type";
import Link from "next/link";
import ItemButton from "../itemButton";
import Image from "next/image";
import { getDistanceHaversine } from "../../getDistanceHaversine";
import { locationStore } from "@/zustand/locationStore";
import { getConvertTime } from "@/app/utils/getConvertTime";

interface MatePostItemPorps {
  post: MatePostAllType;
}

const MatePostItem = ({ post }: MatePostItemPorps) => {
  const { geoData, isUseGeo } = locationStore();

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

  const extractDong = (address: string) => {
    const match = address?.match(/(\S+동)(?=\s|$)/);
    return match ? match[0] : "";
  };

  //console.log(post);

  return (
    <Link href={`/mate/posts/${post.id}`} className="mb-5 flex w-11/12 flex-col gap-y-5 rounded-xl bg-gray-200 p-5">
      <div className="flex flex-row gap-x-5">
        <div className="ml-1">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN26a7CVa5ryzx5psOXRzK2a-OfomhbbUbw-zxRX7D835ImjsmTOc2tIgkc-LXQ2cFrf0&usqp=CAU"
            alt="사용자 프로필 이미지"
            width={70}
            height={70}
          />
          <p className="mt-2 w-16 overflow-hidden overflow-ellipsis whitespace-nowrap text-center">
            {" "}
            {post && post.users?.nickname}
          </p>
        </div>
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <p className="w-52 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {`${extractDong(post.address || "")}, ${post.place_name || ""}`}
            </p>
            {distance !== null ? <p>현재 위치에서의 거리: {distance} km</p> : <p></p>}
          </div>
          {/* <p>{post.content}</p> */}
          <p>날짜 : {post.date_time?.split("T")[0]}</p>
          <p>시간 : {getConvertTime({ date_time: post.date_time || "" })}</p>
          <p>모집인원 수 {post.members}</p>
          <div className="mt-2 flex flex-row gap-x-2">
            <ItemButton
              text={`${Array.isArray(post.matePostPets) ?` ${post.matePostPets.length} 마리` : ""}`}
              className="flex h-7 w-20 items-center justify-center rounded-full bg-white"
            />
            <ItemButton
              text={post.matePostPets[0]?.characteristics}
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
