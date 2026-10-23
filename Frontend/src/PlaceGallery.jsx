import { useState } from "react";
import Image from "./Image.jsx";

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const photos = place?.photos || [];

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black/95 text-white z-50 overflow-y-auto p-4 sm:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur py-4 z-10 border-b border-gray-800">
            <h2 className="text-xl sm:text-2xl font-bold truncate pr-4">
              Photos of {place?.title}
            </h2>
            <button
              type="button"
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-lg shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
              Close
            </button>
          </div>

          <div className="grid gap-6 mt-6 pb-12">
            {photos.map((photo, index) => (
              <div key={index} className="flex justify-center bg-gray-900 rounded-2xl overflow-hidden">
                <Image
                  className="w-full max-h-[85vh] object-contain rounded-xl"
                  src={photo}
                  alt={`Photo ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="h-64 sm:h-80 bg-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-500 border border-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-16 h-16 text-gray-400 mb-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="font-medium">No photos uploaded for this property yet</p>
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-[480px] bg-gray-100">
        <Image
          onClick={() => setShowAllPhotos(true)}
          className="w-full h-full object-cover cursor-pointer hover:scale-[1.01] transition-transform duration-300"
          src={photos[0]}
          alt=""
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-[2fr_1fr] rounded-3xl overflow-hidden max-h-[460px]">
        <div className="h-full">
          {photos[0] && (
            <div className="h-full">
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="w-full h-full aspect-square sm:aspect-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
                src={photos[0]}
                alt=""
              />
            </div>
          )}
        </div>
        <div className="hidden sm:grid grid-rows-2 gap-2 h-full">
          {photos[1] && (
            <div className="overflow-hidden h-full">
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                src={photos[1]}
                alt=""
              />
            </div>
          )}
          {photos[2] && (
            <div className="overflow-hidden h-full">
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                src={photos[2]}
                alt=""
              />
            </div>
          )}
        </div>
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={() => setShowAllPhotos(true)}
          className="flex items-center gap-1.5 absolute bottom-3 right-3 py-2 px-4 bg-white/95 backdrop-blur hover:bg-white text-gray-800 text-sm font-semibold rounded-xl shadow-md border border-gray-200 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
          </svg>
          Show all {photos.length} photos
        </button>
      )}
    </div>
  );
}
