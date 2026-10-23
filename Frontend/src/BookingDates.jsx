import { differenceInCalendarDays, format } from "date-fns";
import { IoCloudyNightSharp } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";

function formatDateSafe(dateVal) {
  if (!dateVal) return "N/A";
  const date = new Date(dateVal);
  if (Number.isNaN(date.getTime())) return "N/A";
  try {
    return format(date, "yyyy-MM-dd");
  } catch {
    return "N/A";
  }
}

export default function BookingDates({ booking, className = "" }) {
  if (!booking) return null;

  const startDate = booking.checkIn ? new Date(booking.checkIn) : null;
  const endDate = booking.checkOut ? new Date(booking.checkOut) : null;
  const validDates = startDate && endDate && !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());
  const nights = validDates ? Math.max(1, differenceInCalendarDays(endDate, startDate)) : 0;

  return (
    <div className={"flex gap-1 flex-col justify-start " + className}>
      <div className="flex gap-2 items-center text-gray-700 font-medium">
        <IoCloudyNightSharp className="text-primary" />
        <span>
          {nights} {nights === 1 ? "Night" : "Nights"}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
        <span className="flex items-center gap-1">
          <BsCalendar2Date className="text-gray-500" />
          {formatDateSafe(booking.checkIn)}
        </span>
        <span className="text-gray-400">→</span>
        <span className="flex items-center gap-1">
          <BsCalendar2Date className="text-gray-500" />
          {formatDateSafe(booking.checkOut)}
        </span>
      </div>
    </div>
  );
}
