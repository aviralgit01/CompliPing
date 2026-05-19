interface TabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    description: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: "basic" | "onboarding") => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => (
  <div className="border-b border-neutral-200">
    <nav className="grid grid-cols-2 space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as "basic" | "onboarding")}
          className={`
              flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === tab.id
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
              }
            `}
        >
          {tab.icon}
          <div className="text-left">
            <div>{tab.label}</div>
            <div className="text-xs text-neutral-500 font-normal">
              {tab.description}
            </div>
          </div>
        </button>
      ))}
    </nav>
  </div>
);
