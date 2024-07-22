"use client";

import { Position, locationStore } from "@/zustand/locationStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
//import { useRef, useState } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";

interface MapComponentProps {
  center: { lat: number; lng: number };
  isEditing?: boolean;
  dbPosition?: { lat: number; lng: number };
  //markerPosition: { lat: number; lng: number };
}

const MapComponent = ({ center }: MapComponentProps) => {
  const { position, setPosition, address, setAddress } = locationStore();
  // const mapRef = useRef<kakao.maps.Map>(null)
  // const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap")

  // const zoomIn = () => {
  //   const map = mapRef.current
  //   if (!map) return
  //   map.setLevel(map.getLevel() - 1)
  // }

  // const zoomOut = () => {
  //   const map = mapRef.current
  //   if (!map) return
  //   map.setLevel(map.getLevel() + 1)
  // }


  const {
    data: addressData,
    isPending,
    error
  } = useQuery({
    queryKey: ["address", position.center],
    queryFn: async () => {
      const response = await getConvertAddress(position.center);
      return response;
    },
  });

  console.log("주소 변환 데이터 확인", addressData);

  // if(position.center && addressData) {
  //   setAddress(addressData);
  // }
  // console.log('현재 위치 값', position);

  useEffect(() => {
    if (addressData) {
      // addressData의 구조에 따라 적절히 수정해야 합니다.
      // 예를 들어, addressData.address가 주소 문자열이라고 가정합니다.
      setAddress(addressData.address);
    }
  }, [addressData]);

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
        (err) => {
          setPosition({
            errMsg: err.message,
            isLoading: false
          });
        }
      );
    }

    if (!navigator.geolocation) {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용 설정
      setPosition({
        center: center,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false
      });
    }
  }, []);


  return (
    <>
      <Map
        center={ position.center ?? center}
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
        // mapTypeId={mapType === "roadmap" ? "ROADMAP" : "HYBRID"}
        // ref={mapRef}
      >
        <MapMarker
          position={ position.center ?? center}
          image={{
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN26a7CVa5ryzx5psOXRzK2a-OfomhbbUbw-zxRX7D835ImjsmTOc2tIgkc-LXQ2cFrf0&usqp=CAU",
            size: {
              width: 64,
              height: 69
            }, // 마커이미지 크기
            options: {
              offset: {
                x: 27,
                y: 69
              } // 마커이미지 옵션, 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정
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

export default MapComponent;
