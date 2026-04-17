import React from 'react';
import AgentCard from './AgentCard';

const Marketplace = ({ agents, purchasedIds, onBuy }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#f0f6fc] tracking-tight mb-2">Explore AI Agents</h1>
        <p className="text-[#8b949e] max-w-xl mx-auto">
          Scale your applications with production-ready AI agents. Fully integrated, secure, and ready for deployment.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            isPurchased={purchasedIds.has(agent.id)}
            onBuy={onBuy}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
