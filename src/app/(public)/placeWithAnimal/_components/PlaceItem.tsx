import { PlaceData } from "@/types/place";

interface PlaceItemProps {
  place: PlaceData;
}

const PlaceItem = ({ place }: PlaceItemProps) => {
  return (
    <div className="w-52 gap-4 bg-gray-300 mb-5">
      <p className="fonte-bold mb-5 text-lg">{place.시설명}</p>
      <div>
        <p>{place.카테고리1}</p>
        <p>{place.카테고리2}</p>
        <p>{place.카테고리3}</p>
      </div>
      <p>{place.도로명주소}</p>
      <p>{place["반려동물 동반 가능정보"]}</p>
      <p>{place["반려동물 제한사항"]}</p>
      <p>{place.운영시간}</p>
    </div>
  );
};

export default PlaceItem;
