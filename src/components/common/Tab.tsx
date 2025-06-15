import {
  type FC,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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
  ref: (el: HTMLLIElement | null) => void;
}

const TabItem: FC<TabItemProps> = ({
  label,
  index,
  isActive,
  onClick,
  ref,
}) => (
  <li
    key={index}
    ref={ref}
    role="tab"
    aria-selected={isActive}
    aria-controls={`tab-panel-${index}`}
    tabIndex={isActive ? 0 : -1}
    className="relative"
    onClick={onClick}
  >
    <div
      className={`
        pr-2 py-2 
        transition-colors duration-100 
        cursor-pointer
        ${isActive ? "text-gray" : "text-gray-600 hover:text-gray-500"}
      `}
    >
      {label}
    </div>
  </li>
);

const Tab: FC<{ tabs: TabProps[] }> = ({ tabs }) => {
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });
  const [activeTab, setActiveTab] = useState(0);

  useLayoutEffect(() => {
    const activeTabElement = tabsRef.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth - 9,
      });
    }
  }, [tabsRef, activeTab]);

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
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
            />
          ))}
        </ul>

        <div
          className="absolute bottom-0.5 md:bottom-0 transition-all duration-100"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            height: "1px",
            backgroundColor: "white",
          }}
        />
      </div>
      <>{tabs[activeTab].child}</>
    </>
  );
};

export default Tab;
