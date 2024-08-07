import { valiMatePostAllTypeForItem } from "@/types/mate.type";

const isInTimeRange = (date: Date, timeRange: string): boolean => {
  const hours = date.getHours();
  switch(timeRange) {
    case "새벽":
      return hours >= 0 && hours < 6;
    case "아침":
      return hours >= 6 && hours < 12;
    case "오후":
      return hours >= 12 && hours < 18;
    case "저녁":
      return hours >= 18 && hours < 24;
    default:
      return true;
  }
};

export const getTiemRage = (posts: valiMatePostAllTypeForItem[], timeRange: string): valiMatePostAllTypeForItem[] => {
  return posts.filter(post => {
    if (!post.date_time) {
      return false;
    }
    const postDate = new Date(post.date_time);
    return isInTimeRange(postDate, timeRange);
  });
}