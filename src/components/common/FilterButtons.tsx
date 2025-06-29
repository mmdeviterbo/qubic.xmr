import { type ReactNode, type FC } from "react";

interface FilterButtonsProps {
  label: ReactNode;
  onClick: (value: string) => void;
  isActive: boolean;
}

const FilterButtons: FC<{
  leftButtons: FilterButtonsProps[];
  rightButtons: FilterButtonsProps[];
}> = ({ leftButtons, rightButtons }) => {
  return (
    <div className="mb-4 mt-2 flex justify-between">
      <div className="flex gap-2">
        {leftButtons?.map((b) => (
          <button
            key={b.label}
            onClick={() => b.onClick(b.label)}
            className={`z-100 cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs ${b.isActive ? "ring-1 ring-gray-500/10 ring-inset bg-gray-800 text-gray-400" : "text-gray-600 hover:bg-gray-800 hover:shadow-md"}`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {rightButtons?.map((b) => (
          <button
            key={b.label}
            onClick={() => b.onClick(b.label)}
            className={`z-100 cursor-pointer inline-flex items-center rounded-md px-2 py-1 text-xs ${b.isActive ? "ring-1 ring-gray-500/10 ring-inset bg-gray-800 text-gray-400" : "text-gray-600 hover:bg-gray-800 hover:shadow-md"}`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons;
