import React from "react";
import {
  MdOutlineVilla,
  MdOutlineBeachAccess,
  MdOutlineCabin,
  MdOutlineLandscape,
  MdOutlineApartment,
  MdOutlinePool,
  MdOutlineHouse,
  MdFilterList,
  MdOutlinePanorama,
} from "react-icons/md";
import { TbSailboat, TbSparkles } from "react-icons/tb";

export const CATEGORIES = [
  { label: "All", icon: MdFilterList },
  { label: "Amazing views", icon: MdOutlinePanorama },
  { label: "Beachfront", icon: MdOutlineBeachAccess },
  { label: "Cabins", icon: MdOutlineCabin },
  { label: "Countryside", icon: MdOutlineLandscape },
  { label: "Design stays", icon: TbSparkles },
  { label: "Pools", icon: MdOutlinePool },
  { label: "Lakefront", icon: TbSailboat },
  { label: "City apartments", icon: MdOutlineApartment },
];

export default function CategoriesNav({ activeCategory, onSelectCategory }) {
  return (
    <div className="relative border-b border-gray-200/80 bg-white">
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-hide py-4 px-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => onSelectCategory(cat.label)}
              className={`flex flex-col items-center gap-2 pb-2 shrink-0 border-b-2 transition-all cursor-pointer group ${
                isActive
                  ? "border-gray-900 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 font-medium"
              }`}
            >
              <Icon
                className={`text-2xl transition-transform group-hover:scale-110 ${
                  isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"
                }`}
              />
              <span className="text-xs whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
