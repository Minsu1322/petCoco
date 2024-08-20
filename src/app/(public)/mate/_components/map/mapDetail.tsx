import { Map, MapMarker, MapTypeControl, ZoomControl, CustomOverlayMap, RoadviewMarker, Roadview, CustomOverlayRoadview } from "react-kakao-maps-sdk";
import { useState } from "react";

interface MapDetailProps {
  center: { lat: number; lng: number };
  // onMapLoad: () => void;
  //markerPosition: { lat: number; lng: number };
  tag: string;
}

const MapDetail = ({ center, tag }: MapDetailProps) => {
  const [toggle, setToggle] = useState<"map" | "roadview">("map");
  //  console.log(center)
  return (
    <div className="relative">
      {toggle === "map" ? (
        <Map center={center} style={{ width: "100%", height: "15.875rem", borderRadius: "1rem" }} level={5}>
          <MapMarker
            position={center}
            image={{
              src: "/assets/svg/ph_paw.svg",
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
          />
          <CustomOverlayMap position={center} yAnchor={1} xAnchor={0}>
            <div className="relative -translate-y-10 rounded-[1rem] bg-[#61646B] px-[1rem] py-[0.5rem] text-white before:absolute before:bottom-[-10px] before:left-[10px] before:h-0 before:w-0 before:border-b-[0.5rem] before:border-l-[0.5rem] before:border-r-[0.5rem] before:border-t-[0.5rem] before:border-b-transparent before:border-l-[#61646B] before:border-r-transparent before:border-t-[#61646B] before:content-['']">
              <span>{tag} 부근</span>
            </div>
          </CustomOverlayMap>
          <MapTypeControl position={"BOTTOMLEFT"} />
          <ZoomControl position={"RIGHT"} />
        </Map>
      ) : (
        <Roadview
          position={{ ...center, radius: 50 }}
          style={{
            width: "100%",
            height: "15.875rem",
            borderRadius: "1rem",
          }}
        >
          <RoadviewMarker position={center} image={{
            src: "/assets/svg/ph_paw.svg",
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
          }} />
          <CustomOverlayRoadview position={center} yAnchor={1} xAnchor={0}>
            <div className="relative -translate-y-10 rounded-[1rem] bg-[#61646B] px-[1rem] py-[0.5rem] text-white before:absolute before:bottom-[-10px] before:left-[10px] before:h-0 before:w-0 before:border-b-[0.5rem] before:border-l-[0.5rem] before:border-r-[0.5rem] before:border-t-[0.5rem] before:border-b-transparent before:border-l-[#61646B] before:border-r-transparent before:border-t-[#61646B] before:content-['']">
              <span>{tag} 부근</span>
            </div>
          </CustomOverlayRoadview>
        </Roadview>
      )}
      <div className="absolute top-2 left-2 z-10">
  <button
    type="button"
    onClick={() => setToggle(toggle === "map" ? "roadview" : "map")}
    className={`rounded-md ${toggle === "roadview" ? "bg-blue-500 text-white" : "bg-white text-black"} px-2 py-1.5 shadow-md text-sm`}
  >
    {toggle === "map" ? "로드뷰" : " 지도 "}
  </button>
</div>
    </div>
  );

};

export default MapDetail;
