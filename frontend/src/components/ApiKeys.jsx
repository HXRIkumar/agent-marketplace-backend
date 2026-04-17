import React from 'react';

const ApiKeys = ({ apiKeys }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#f0f6fc] mb-1">API Keys</h1>
          <p className="text-sm text-[#8b949e]">Manage your access keys for purchased agents.</p>
        </div>
      </div>

      {apiKeys.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-[#8b949e] mb-4">vpn_key</span>
          <h2 className="text-base font-semibold text-[#f0f6fc]">No API keys found</h2>
          <p className="text-sm text-[#8b949e] mt-1">Purchase an agent from the marketplace to generate a key.</p>
        </div>
      ) : (
        <div className="border border-[#30363d] rounded-md overflow-hidden bg-[#161b22]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161b22] border-b border-[#30363d] text-[#8b949e]">
              <tr>
                <th className="px-6 py-3 font-semibold">Agent Name</th>
                <th className="px-6 py-3 font-semibold">API Key</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {apiKeys.map((item, index) => (
                <tr key={index} className="hover:bg-[#1c2229]">
                  <td className="px-6 py-4 font-medium text-[#58a6ff]">{item.agentName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <code className="bg-[#0d1117] px-2 py-1 rounded border border-[#30363d] font-mono text-[#c9d1d9]">
                        {item.key}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.key)}
                        className="p-1.5 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] rounded-md transition-all duration-200 active:scale-90"
                        title="Copy API Key"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>

                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-[#3fb950]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApiKeys;
