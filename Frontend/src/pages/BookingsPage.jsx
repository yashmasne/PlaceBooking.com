import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";
import { CiMoneyCheck1 } from "react-icons/ci";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className=" flex flex-col gap-8">
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              key={booking._id}
              className="flex flex-wrap  gap-4 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="sm:w-56">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3   pl-4 grow">
                <h2 className="text-xl">{booking.place.title}</h2>
                <div className="text-xl">
                  <BookingDates
                    booking={booking}
                    className="mb-2 mt-4 text-gray-500"
                  />
                  <div className="flex gap-2 items-center pl-2">
                    <span>
                      <CiMoneyCheck1 />
                    </span>
                    Total price: ${booking.price}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
