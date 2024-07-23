import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";

interface MapDetailProps {
  center: { lat: number; lng: number };
  //markerPosition: { lat: number; lng: number };
}

const MapDetail = ({center}: MapDetailProps) => {
//  console.log(center)
  return (
    <>
    <Map
      center={center}
      style={{ width: "500px", height: "360px" }}
      level={5}
    >
      <MapMarker
        position={center}
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
  )
}

export default MapDetail