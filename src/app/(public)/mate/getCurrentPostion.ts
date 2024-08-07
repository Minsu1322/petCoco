import { PositionData } from "./page";
import { locationStore } from "@/zustand/locationStore";

export const getCurrentPosition = (): Promise<PositionData> => {

  
  const { geoData, setGeoData } = locationStore();

  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            isLoading: false
          };
          resolve(newPosition);
        },
        (error) => {
          const defaultPosition = {
            center: { lat: 37.5556236021213, lng: 126.992199507869 },
            errMsg: error.message,
            isLoading: false
          };
          resolve(defaultPosition);
        }
      );
    } else {
      const noGeoPosition = {
        center: { lat: 37.5556236021213, lng: 126.992199507869 },
        errMsg: "Geolocation is not supported by this browser.",
        isLoading: false
      };
      resolve(noGeoPosition);
    }
  });
};