import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarSearch } from "lucide-react";
import DateObject from "react-date-object";
import type { IPersianDatePickerProps } from "../../types/type";

const PersianDatePicker: React.FC<IPersianDatePickerProps> = ({
  value,
  onChange,
}) => {
  const dateObject = value
    ? new DateObject({
        date: value,
        calendar: persian,
        locale: persian_fa,
      })
    : null;

  return (
    <div className="w-[250px] min-h-[36px] rounded-[4px] border border-[#1e7677] flex items-center justify-between pl-2">
      <DatePicker
        value={dateObject}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        format="YYYY/MM/DD"
        render={
          <input
            placeholder="تاریخ را انتخاب کنید"
            className="w-full h-full px-2 text-right outline-none text-gray-700"
          />
        }
        onChange={(date) => {
          if (date) {
            onChange(date.format("YYYY/MM/DD"));
          }
        }}
      />
      <CalendarSearch />
    </div>
  );
};

export default PersianDatePicker;
