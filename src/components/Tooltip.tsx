import { FC } from "react";

interface TooltipProps {
  content: string;
}

const Tooltip: FC<TooltipProps> = ({ content }) => {
  return (
    <div className="has-tooltip relative">
      <div
        className="w-64 break-normal tooltip rounded shadow-lg p-2 m-2 bg-gray-700 text-xs rounded-12"
        style={{
          left: "-3rem",
          bottom: "105%",
        }}
      >
        {content}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="size-5 shrink-0 text-gray-50"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        ></path>
      </svg>
    </div>
  );
};

export default Tooltip;
