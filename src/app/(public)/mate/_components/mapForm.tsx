"use client";

import { locationStore } from "@/zustand/locationStore";

import { useEffect, useState } from "react";
//import { useRef, useState } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";


interface MapComponentProps {
  center: { lat: number; lng: number };
}

const MapForm = ({ center }: MapComponentProps) => {
  const { position, setPosition} = locationStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude // 경도
            },
            isLoading: false
          });
        },
        (error) => {
          setPosition({
            center: center,
            errMsg: error.message,
            isLoading: false
          });
        }
      );
    }
    if (!navigator.geolocation) {
      setPosition({
        center: center,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false
      });
    }
    // console.log('geo',navigator);

  
  }, []);

  return (
    <>
      <Map
        center={position.center}
        style={{ width: "500px", height: "360px" }}
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
              width: 64,
              height: 69
            }, 
            options: {
              offset: {
                x: 27,
                y: 69
              } 
            }
          }}
        >
          <div className="w-[150px] bg-mainColor text-center">산책 장소</div>
        </MapMarker>
        <MapTypeControl position={"TOPRIGHT"} />
        <ZoomControl position={"RIGHT"} />
      </Map>
    </>
  );
};

export default MapForm;
