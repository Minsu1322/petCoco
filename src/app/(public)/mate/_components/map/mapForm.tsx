"use client";

import { locationStore } from "@/zustand/locationStore";
import { useEffect } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl, CustomOverlayMap } from "react-kakao-maps-sdk";

interface MapComponentProps {
  center: { lat: number; lng: number };
}

const MapForm = ({ center }: MapComponentProps) => {
  const { position, setPosition } = locationStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          })
        },
        (error) => {
          setPosition({
            center: center,
            errMsg: error.message,
            isLoading: false
          });
        }
      )
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setPosition({
        center: center,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      })
    }
  }, [])


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
            src: "/assets/svg/ph_paw.svg",
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

export default MapForm;
