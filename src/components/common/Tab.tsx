import { type FC, type ReactNode, useState } from "react";

interface IndicatorStyle {
  left: number;
  width: number;
}

export interface TabProps {
  label: string;
  child: ReactNode;
}

interface TabItemProps {
  label: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const TabItem: FC<TabItemProps> = ({ label, index, isActive, onClick }) => (
  <li
    key={index}
    role="tab"
    aria-selected={isActive}
    aria-controls={`tab-panel-${index}`}
    tabIndex={isActive ? 0 : -1}
    className="relative"
    onClick={onClick}
  >
    <div
      className={`
        mr-2 my-1 py-1 
        transition-colors duration-100 
        cursor-pointer
        ${isActive ? "text-gray border-b" : "text-gray-600 hover:text-gray-500"}
      `}
    >
      {label}
    </div>
  </li>
);

const Tab: FC<{ tabs: TabProps[] }> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="relative mb-3 md:mb-4">
        <ul className="flex text-xs gap-2 text-gray-400" role="tablist">
          {tabs.map((tab, index) => (
            <TabItem
              key={index.toString()}
              label={tab.label}
              index={index}
              isActive={activeTab === index}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </ul>
      </div>
      <>{tabs[activeTab].child}</>
    </>
  );
};

export default Tab;
