interface getDistanceHaversineProps {
  curPosition: { lat: number; lng: number };
  desPosition: { lat: number; lng: number };
}

export const getDistanceHaversine = ({curPosition, desPosition}: getDistanceHaversineProps) => {
  const currX = curPosition.lat; // 현재 내 위치 위도
  const currY = curPosition.lng; // 현재 내 위치  경도
  const destX = desPosition.lat; // 산책 장소(지도에서 찍은 곳) 위도
  const destY = desPosition.lng; // 산책 장소(지도에서 찍은 곳) 경도

  const radius = 6371; // 지구 반지름(km)
  const toRadian = Math.PI / 180;

  const deltaLat = Math.abs(currX - destX) * toRadian;
  const deltaLng = Math.abs(currY - destY) * toRadian;

  const squareSinDeltLat = Math.pow(Math.sin(deltaLat / 2), 2);
  const squareSinDeltLng = Math.pow(Math.sin(deltaLng / 2), 2);

  const squareRoot = Math.sqrt(
    squareSinDeltLat +
      Math.cos(currX * toRadian) *
        Math.cos(destX * toRadian) *
        squareSinDeltLng,
  );

  const result = 2 * radius * Math.asin(squareRoot);

  return result;
};