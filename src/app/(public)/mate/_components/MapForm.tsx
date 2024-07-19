"use client";

import { useLocation } from "@/zustand/useLocation";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface MapComponentProps {
  center: { lat: number; lng: number };
 //markerPosition: { lat: number; lng: number };
}

const MapComponent = ({ center }: MapComponentProps) => {
  const { position, setPosition } = useLocation();

  return (
    <Map
      center={position}
      style={{ width: "500px", height: "360px" }}
      level={5}
      onClick={(_, mouseEvent) => {
        const latlng = mouseEvent.latLng;
        setPosition({
          lat: latlng.getLat(),
          lng: latlng.getLng()
        });
      }}
    >
      <MapMarker
        position={position ?? center}
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
        <div className="w-[150px] bg-blue-300 text-center">산책 장소</div>
      </MapMarker>
    </Map>
  );
};

export default MapComponent;
