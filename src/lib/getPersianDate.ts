import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const getPersianDate = () => {
  const today = new Date();
  const persianDate = new DateObject({
    date: today,
    calendar: persian,
    locale: persian_fa,
  });
  return persianDate.format("YYYY/MM/DD");
};
