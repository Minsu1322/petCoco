interface GetConvertTimeProps {
  dateTime: string
}

const GetConvertTime = ({dateTime}: GetConvertTimeProps) => {
  const time = dateTime?.split("T")[1].split(':');
  const convertPeriod  = (Number(time[0]) < 12 ? '오전' : '오후')
  const convertHour = (Number(time[0]) % 12 || 12);
  const convertMin = time[1];

  return `${convertPeriod} ${convertHour}시 ${convertMin}분`
}

export default GetConvertTime