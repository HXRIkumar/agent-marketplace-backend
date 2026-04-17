import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117]">
      <div className="card w-full max-w-[340px] p-8 text-center">
        <div className="w-12 h-12 bg-[#1f6feb] rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
        </div>
        
        <h1 className="text-xl font-bold text-[#f0f6fc] mb-2">Agent Marketplace</h1>
        <p className="text-sm text-[#8b949e] mb-8">Enter your username to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b949e] mb-1.5 ml-1">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-[#161b22] text-white placeholder-gray-400 border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />

          </div>
          
          <button 
            type="submit"
            className="btn btn-primary w-full py-2.5 mt-2"
          >
            Continue
          </button>
        </form>
        
        <p className="text-[10px] text-[#8b949e] mt-6 uppercase tracking-widest font-mono">
          Ready for integration
        </p>
      </div>
    </div>
  );
};

export default Login;
