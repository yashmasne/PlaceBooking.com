import Image from "./Image.jsx";

export default function PlaceImg({ place, index = 0, className = null }) {
  const photo = place?.photos?.[index] || place?.photos?.[0];

  if (!photo) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 ${className || "h-full w-full"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-10 h-10 mb-1 text-gray-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span className="text-xs font-medium text-gray-400">PlaceBooking</span>
      </div>
    );
  }

  const finalClass = className || "object-cover h-full w-full";

  return (
    <Image
      className={finalClass}
      src={photo}
      alt={place?.title || "Place photo"}
    />
  );
}
