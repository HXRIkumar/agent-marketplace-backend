import React from 'react';

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="h-16 fixed top-0 w-full z-50 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-[#f0f6fc]">Agent Marketplace</span>
      </div>
      
      <div className="flex items-center gap-4">
        {username && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#21262d] border border-[#30363d] rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-[#c9d1d9]">{username}</span>
            </div>
            <button 
              onClick={onLogout}
              className="btn btn-secondary flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
