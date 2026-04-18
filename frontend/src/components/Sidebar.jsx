import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const links = [
    { id: 'marketplace', label: 'Marketplace', icon: 'grid_view' },
    { id: 'apikeys', label: 'API Keys', icon: 'key' },
    { id: 'console', label: 'Developer Console', icon: 'terminal' },
  ];

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-64px)] bg-[#0d1117] border-r border-[#30363d] py-6 px-4 flex flex-col z-40">
      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === link.id
                ? 'bg-[#21262d] text-[#f0f6fc] border border-[#8b949e]'
                : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>
      
    </aside>
  );
};

export default Sidebar;
