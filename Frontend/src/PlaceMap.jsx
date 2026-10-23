import { FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";

export default function PlaceMap({ address }) {
  if (!address) return null;
  const query = encodeURIComponent(address);

  return (
    <section id="location" className="pt-10 pb-10 border-b border-gray-200 scroll-mt-24">
      <h2 className="text-2xl font-bold text-gray-900">Where you'll be</h2>
      <p className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <FaMapMarkerAlt className="text-primary shrink-0" />
        {address}
      </p>
      <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-sm">
        <iframe
          title={`Map showing ${address}`}
          src={`https://maps.google.com/maps?q=${query}&z=13&output=embed`}
          className="w-full h-72 sm:h-96 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-gray-900 underline"
      >
        Open in Google Maps <FaExternalLinkAlt className="text-xs" />
      </a>
    </section>
  );
}
