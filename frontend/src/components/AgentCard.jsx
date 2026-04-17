import React from 'react';

const AgentCard = ({ agent, isPurchased, onBuy }) => {
  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-semibold text-[#58a6ff] hover:underline cursor-pointer">{agent.name}</h3>
        {isPurchased ? (
          <span className="px-2 py-0.5 text-[10px] font-bold text-[#3fb950] border border-[rgba(63,185,80,0.4)] bg-[rgba(63,185,80,0.1)] rounded-full">
            Purchased
          </span>
        ) : (
          <span className="text-[#8b949e] font-mono text-xs">${agent.price}/mo</span>
        )}
      </div>
      
      <p className="text-xs text-[#8b949e] mb-4 flex-grow line-clamp-2">
        {agent.description}
      </p>
      
      <div className="bg-[#0d1117] rounded-md p-2 mb-4 border border-[#30363d] font-mono text-[10px] text-[#8b949e] truncate">
        {agent.endpoint}
      </div>
      
      <button 
        onClick={() => !isPurchased && onBuy(agent.id)}
        disabled={isPurchased}
        className="btn btn-primary w-full"
      >
        {isPurchased ? 'Purchased' : 'Buy Agent'}
      </button>

    </div>
  );
};

export default AgentCard;
