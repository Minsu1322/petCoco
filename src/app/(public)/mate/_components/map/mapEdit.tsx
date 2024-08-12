"use client";

import { locationStore } from "@/zustand/locationStore";
// import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
//import { useRef, useState } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl, CustomOverlayMap } from "react-kakao-maps-sdk";
// import { getConvertAddress } from "../../getConvertAddress";

interface MapComponentProps {
  center: { lat: number; lng: number };
  isEditing?: boolean;
  dbPosition?: { lat: number; lng: number };
}

const MapEdit = ({ center, isEditing, dbPosition }: MapComponentProps) => {
  const { position, setPosition } = locationStore();

  // const {
  //   data: addressData,
  //   isPending,
  //   error
  // } = useQuery({
  //   queryKey: ["address", position.center],
  //   queryFn: async () => {
  //     const response = await getConvertAddress(position.center);
  //     return response;
  //   },
  //   enabled: !!position.center
  // });

  // console.log("주소 변환 데이터 확인", addressData);

  // if(position.center && addressData) {
  //   setAddress(addressData);
  // }
  // console.log("현재 위치 값", position);

  useEffect(() => {
    if (isEditing && dbPosition) {
      setPosition({
        center: dbPosition,
        isLoading: false
      });
    }
  }, []);

  // console.log('디비 데이터', dbPosition)
  // console.log('center', center)

  return (
    <>
      <Map
        center={position.center}
        style={{ width: "20.4375rem", height: "19.3125rem", borderRadius:"0.5rem" }}
        level={5}
        onClick={(_, mouseEvent) => {
          const latlng = mouseEvent.latLng;
          setPosition({
            center: {
              lat: latlng.getLat(),
              lng: latlng.getLng()
            }
          });
        }}
      >
        <MapMarker
          position={position.center}
          image={{
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN26a7CVa5ryzx5psOXRzK2a-OfomhbbUbw-zxRX7D835ImjsmTOc2tIgkc-LXQ2cFrf0&usqp=CAU",
            size: {
              width: 30,
              height: 30
            },
            options: {
              offset: {
                x: 15, 
                y: 30}}
          }}
        >
        </MapMarker>
        <CustomOverlayMap position={position.center} yAnchor={1} xAnchor={0}>
        <div className="bg-[#61646B] text-white py-[0.5rem] px-[1rem] rounded-[1rem] relative -translate-y-10 before:content-[''] before:absolute before:left-[10px] before:bottom-[-10px] before:w-0 before:h-0 before:border-t-[0.5rem] before:border-t-[#61646B] before:border-r-[0.5rem] before:border-r-transparent before:border-b-[0.5rem] before:border-b-transparent before:border-l-[0.5rem] before:border-l-[#61646B]">
  <span>산책 장소</span>
</div>
        </CustomOverlayMap>
        <MapTypeControl position={"BOTTOMLEFT"} />
        <ZoomControl position={"RIGHT"} />
      </Map>
    </>
  );
};

export default MapEdit;
