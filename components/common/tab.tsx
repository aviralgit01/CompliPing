interface TabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: any) => void;
  className?: string;
  navClassName?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  navClassName,
}) => (
  <div className={`border-b border-neutral-200 ${className}`}>
    <nav className={`grid grid-cols-3  gap-3 space-x-8 w-fit ${navClassName}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
                flex cursor-pointer items-center gap-2 py-3 px-3 border-b-2 font-medium text-sm transition-colors w-fit
                ${
                  activeTab === tab.id
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
                }
              `}
        >
          {tab?.icon}
          <div className="text-left">
            <div>{tab.label}</div>
            {tab?.description && (
              <div className="text-xs text-neutral-500 font-normal">
                {tab.description}
              </div>
            )}
          </div>
        </button>
      ))}
    </nav>
  </div>
);
