"use client";

import { useLocation } from "@/zustand/useLocation";
//import { useRef, useState } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";

interface MapComponentProps {
  center: { lat: number; lng: number };
 //markerPosition: { lat: number; lng: number };
}

const MapComponent = ({ center }: MapComponentProps) => {
  const { position, setPosition } = useLocation();
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


  return (
    <>

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
      // mapTypeId={mapType === "roadmap" ? "ROADMAP" : "HYBRID"}
      // ref={mapRef}
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
          },
          
        }}
      >
        <div className="w-[150px] bg-mainColor text-center">산책 장소</div>
      </MapMarker>
      <MapTypeControl  position={"TOPRIGHT"} />
        <ZoomControl position={"RIGHT"} />
          
    </Map>
        {/* TODO: 커스텀을 위한 코드 */}
      {/* <div className="custom_typecontrol radius_border">
      <span
          id="btnRoadmap"
          className={mapType === "roadmap" ? "selected_btn" : "btn"}
          onClick={() => setMapType("roadmap")}
        >
          지도
        </span>
        <span
          id="btnSkyview"
          className={mapType === "skyview" ? "selected_btn" : "btn"}
          onClick={() => {
            setMapType("skyview")
          }}
        >
          스카이뷰
        </span>
      </div>
      <div className="custom_zoomcontrol radius_border">
        <span onClick={zoomIn}>
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
            alt="확대"
          />
        </span>
        <span onClick={zoomOut}>
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
            alt="축소"
          />
        </span>
      </div> */}
      </>
  );
};

export default MapComponent;
