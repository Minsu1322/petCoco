export const getTimeDifference = (date: string) => {
  const now = new Date();
  const messageTime = new Date(date);
  const diffInSeconds = (now.getTime() - messageTime.getTime()) / 1000;
  if (diffInSeconds < 60) return `${Math.floor(diffInSeconds)}초 전`;
  const diffInMinutes = diffInSeconds / 60;
  if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}분 전`;
  const diffInHours = diffInMinutes / 60;
  if (diffInHours < 24) return `${Math.floor(diffInHours)}시간 전`;
  const diffInDays = diffInHours / 24;
  return `${Math.floor(diffInDays)}일 전`;
};
