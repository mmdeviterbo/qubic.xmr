import { type FC } from "react";

interface FilterButtonsProps {
  label: string;
  onClick: (value: string) => void;
  isActive: boolean;
}

const FilterButtons: FC<{ buttons: FilterButtonsProps[] }> = ({ buttons }) => {
  return (
    <div className="mb-4 mt-2 flex gap-2">
      {buttons.map((b) => (
        <button
          key={b.label}
          onClick={() => b.onClick(b.label)}
          className={`z-100 cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs ${b.isActive ? "ring-1 ring-gray-500/10 ring-inset bg-gray-800 text-gray-400" : "text-gray-600 hover:bg-gray-800 hover:shadow-md"}`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
