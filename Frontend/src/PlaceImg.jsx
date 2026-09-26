import Image from "./Image.jsx";

export default function PlaceImg({ place, index = 1, className = null }) {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }
  return (
    <Image
      className={`${className} h-[300px] w-[400px]  object-cover md:w-[600px] rounded-md`}
      src={place.photos[index]}
      alt=""
    />
  );
}
