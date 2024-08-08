import { Map, MapMarker, MapTypeControl, ZoomControl, CustomOverlayMap } from "react-kakao-maps-sdk";

interface MapDetailProps {
  center: { lat: number; lng: number };
  // onMapLoad: () => void;
  //markerPosition: { lat: number; lng: number };
  tag: string;
}

const MapDetail = ({ center, tag }: MapDetailProps) => {
  //  console.log(center)
  return (
    <>
 <Map center={center} style={{ width: "100%", height: "15.875rem", borderRadius: "1rem" }} level={5}>
      <MapMarker
        position={center}
        image={{
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN26a7CVa5ryzx5psOXRzK2a-OfomhbbUbw-zxRX7D835ImjsmTOc2tIgkc-LXQ2cFrf0&usqp=CAU",
          size: {
            width: 30,
            height: 30
          },
          options: {
            offset: {
              x: 15, 
        y: 30
            }
          }
        }}
      >
      </MapMarker>
        <CustomOverlayMap position={center} yAnchor={1} xAnchor={0}>
        <div className="bg-[#61646B] text-white py-[0.5rem] px-[1rem] rounded-[1rem] relative -translate-y-10 before:content-[''] before:absolute before:left-[10px] before:bottom-[-10px] before:w-0 before:h-0 before:border-t-[0.5rem] before:border-t-[#61646B] before:border-r-[0.5rem] before:border-r-transparent before:border-b-[0.5rem] before:border-b-transparent before:border-l-[0.5rem] before:border-l-[#61646B]">
  <span>{tag} 부근</span>
</div>
        </CustomOverlayMap>
        <MapTypeControl position={"BOTTOMLEFT"} />
        <ZoomControl position={"RIGHT"} />
    </Map>
    </>
  );
};

export default MapDetail;
