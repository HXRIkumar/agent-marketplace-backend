import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Marketplace from "./components/Marketplace";
import ApiKeys from "./components/ApiKeys";
import Console from "./components/Console";
import Login from "./components/Login";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [agents, setAgents] = useState([]);
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem("agent_keys");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState("marketplace");

  // Derive purchased IDs for the UI
  const purchasedIds = new Set(apiKeys.map(k => k.agentId));

  const fetchAgents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/agents`);
      setAgents(res.data);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchAgents();
    }
  }, [fetchAgents, username]);

  const handleLogin = async (name) => {
    try {
      await axios.post(`${API_BASE_URL}/login`, { username: name });
      setUsername(name);
      localStorage.setItem("username", name);
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed. Please check your connection.");
    }
  };

  const handleLogout = () => {
    setUsername("");
    setApiKeys([]);
    localStorage.removeItem("username");
    localStorage.removeItem("agent_keys");
  };

  const handleBuy = async (agentId) => {
    if (!username) return; // Should not happen with auth guard
    
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/buy`, { 
        username, 
        agentId 
      });
      
      const newKeyEntry = {
        agentId: agent.id,
        agentName: agent.name,
        key: res.data.apiKey
      };

      const updatedKeys = [...apiKeys, newKeyEntry];
      setApiKeys(updatedKeys);
      localStorage.setItem("agent_keys", JSON.stringify(updatedKeys));
      
      // Auto switch to API Keys to show the new key
      setActiveTab("apikeys");
    } catch (err) {
      console.error("Purchase failed", err);
      alert("Purchase failed. Please try again.");
    }
  };

  // Auth Guard: If no username, show the Login screen
  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] antialiased">
      <Navbar username={username} onLogout={handleLogout} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pl-64 pt-16 min-h-screen">
        <div className="h-full">
          {activeTab === 'marketplace' && (
            <Marketplace 
              agents={agents} 
              purchasedIds={purchasedIds} 
              onBuy={handleBuy} 
            />
          )}
          
          {activeTab === 'apikeys' && (
            <ApiKeys apiKeys={apiKeys} />
          )}
          
          {activeTab === 'console' && (
            <Console 
              agents={agents} 
              apiKeys={apiKeys} 
            />
          )}
        </div>
      </main>
    </div>
  );
}