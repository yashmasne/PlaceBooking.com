import React from "react";
import { FaRegCalendarCheck, FaGlobeAmericas, FaSlidersH, FaShieldAlt } from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      icon: FaRegCalendarCheck,
      title: "Flexible Reservation Options",
      description:
        "Stays with flexible cancellation options make it seamless to adjust your travel plans whenever necessary.",
    },
    {
      icon: FaGlobeAmericas,
      title: "Handpicked Stays & Destinations",
      description:
        "Curated properties with verified photographs and direct communication with accommodating local hosts.",
    },
    {
      icon: FaSlidersH,
      title: "Tailored Discovery Filters",
      description:
        "Filter by specific architectural styles, price categories, guest counts, and essential perks for your ideal vacation.",
    },
    {
      icon: FaShieldAlt,
      title: "PlaceBooking Guarantee",
      description:
        "Every reservation includes booking confirmation, date overlap protection, and customer service assistance.",
    },
  ];

  return (
    <div className="py-12 border-t border-gray-100">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Why reserve with PlaceBooking
        </h2>
        <p className="text-gray-500 text-sm mt-1.5">
          Experience world-class hospitality, transparent pricing, and unforgettable stays.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-gray-50 hover:bg-gray-100/80 transition-colors border border-gray-100 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary text-xl mb-4">
                <Icon />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
