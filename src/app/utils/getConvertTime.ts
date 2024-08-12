import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface GetConvertTimeProps {
  date_time: string;
}

export const getConvertTime = ({ date_time }: GetConvertTimeProps) => {
  const time = date_time?.split("T")[1]?.split(":") ?? [];
  if (time.length < 2) return "시간 정보 없음";

  const convertPeriod = Number(time[0]) < 12 ? "오전" : "오후";
  const convertHour = Number(time[0]) % 12 || 12;
  const convertMin = time[1];

  return `${convertPeriod} ${convertHour}:${convertMin}`;
};

export const formatDateTimeTitle = (dateTimeString: string | null) => {
  if (!dateTimeString) return '';
    
  const date = parseISO(dateTimeString);
  
  const formattedDate = format(date, "M/d(eee)", { locale: ko });
  const formattedTime = format(date, "h:mma").toLowerCase();
  
  return `${formattedDate} ${formattedTime}`;
}

export const  formatDateTimeContent = (dateTimeString: string | null) => {
  if (!dateTimeString) return '';
    
  const date = parseISO(dateTimeString);
  
  const formattedDate = format(date, "M/d(eee)", { locale: ko });
  const formattedTime = format(date, "h:mma").toLowerCase();
  
  return `${formattedDate} | ${formattedTime}`;
}