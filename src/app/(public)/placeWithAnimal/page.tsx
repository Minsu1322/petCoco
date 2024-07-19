"use client";

import { useEffect, useState } from "react";
import PlaceItem from "./_components/PlaceItem";
import { PlaceData } from "@/types/place";

const PlaceWithAnimal = () => {
  const [placeData, setPlaceData] = useState<PlaceData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/withPetApi");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlaceData(data.data);
      } catch (error) {
        console.error("장소 데이터를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchData();
  }, []);

  console.log(placeData);

  return (
    <div className="grid grid-rows-3 sm:grid-rows-3 md:grid-rows-4 lg:grid-cols-4">
      {placeData.map((place) => (
        <PlaceItem place={place} />
      ))}
    </div>
  );
};

export default PlaceWithAnimal;
