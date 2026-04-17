import React, { useState } from 'react';
import axios from 'axios';

const Console = ({ agents, apiKeys }) => {
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [payload, setPayload] = useState('{}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAgentChange = (e) => {
    const id = e.target.value;
    setSelectedAgentId(id);
    const agent = agents.find(a => a.id === parseInt(id));
    if (agent) {
      // Find API key from purchased keys if it exists
      const savedKey = apiKeys.find(k => k.agentName === agent.name);
      if (savedKey) setApiKey(savedKey.key);

      // Set sample payloads
      const samples = {
        'Lumina-7B': { text: "Explain React hooks." },
        'Visionary-X': { a: 10, b: 5, operation: "multiply" },
        'DataSynth': { amount: 100 },
        'Quantum-Core': { amount: 50 }
      };
      setPayload(JSON.stringify(samples[agent.name] || {}, null, 2));
    }
  };

  const handleSendRequest = async () => {
    if (!selectedAgentId) return alert('Select an agent');
    if (!apiKey) return alert('API Key required');

    const agent = agents.find(a => a.id === parseInt(selectedAgentId));
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(`http://localhost:3000${agent.endpoint}`, 
        JSON.parse(payload),
        { headers: { Authorization: apiKey } }
      );
      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || { error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[#f0f6fc] mb-1">Developer Console</h1>
        <p className="text-sm text-[#8b949e]">Test agent endpoints and validate your integration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-4">Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c9d1d9] mb-1.5">Target Agent</label>
                <select 
                  className="input w-full bg-[#0d1117]"
                  value={selectedAgentId}
                  onChange={handleAgentChange}
                >
                  <option value="">Select an agent...</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#c9d1d9] mb-1.5">API Key (sk-xxxx)</label>
                <input 
                  type="text" 
                  className="input w-full bg-[#0d1117] font-mono" 
                  placeholder="Paste your API key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">Request Body</h2>
              <span className="text-[10px] bg-[#21262d] px-2 py-0.5 rounded text-[#8b949e] font-mono">JSON</span>
            </div>
            <textarea 
              className="input w-full flex-1 bg-[#0d1117] font-mono text-xs resize-none p-4"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              spellCheck="false"
            />
            <div className="flex justify-center mt-6">
              <button 
                onClick={handleSendRequest}
                disabled={loading}
                className="btn btn-primary px-8 py-3 min-w-[200px]"
              >
                {loading ? 'Processing...' : 'Send Request'}
              </button>
            </div>

          </div>
        </div>

        {/* Right: Response */}
        <div className="card overflow-hidden flex flex-col">
          <div className="bg-[#161b22] px-6 py-3 border-b border-[#30363d] flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">Response</h2>
            {response && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${response.error ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>
                {response.error ? 'ERROR' : '200 OK'}
              </span>
            )}
          </div>
          <div className="flex-1 bg-[#0d1117] p-6 overflow-auto">
            <pre className="font-mono text-xs text-[#c9d1d9] leading-relaxed">
              {response ? JSON.stringify(response, null, 2) : '// Your response will appear here...'}
            </pre>
          </div>
          <div className="bg-[#161b22] px-6 py-4 border-t border-[#30363d] text-[11px] text-[#8b949e] flex justify-between items-center">
            <span>Server: localhost:3000</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Console;
