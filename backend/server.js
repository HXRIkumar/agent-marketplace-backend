/**
 * ============================================================================
 * BACKEND ARCHITECTURE: AI AGENT MARKETPLACE (API GATEWAY & MCP ROUTER)
 * ============================================================================
 * 
 * ROLE: Central API Gateway and Dynamic Tool Router.
 * ARCHITECTURE: Modular Microservice-Inspired.
 * 
 * DESIGN PATTERNS:
 * 1. API GATEWAY: Unified entry point for all service requests.
 * 2. AUTHENTICATION (Guard): Strict sk-xxxx verification with scoped access.
 * 3. MCP ROUTING (Dispatcher): Simulation of Model Context Protocol for tool selection.
 * ============================================================================
 */

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------------
// PERSISTENCE LAYER (IN-MEMORY)
// ----------------------------------------------------------------------------
let users = [];
let apiKeys = {}; // { sk-xxxx: { username, agentId } }

// ----------------------------------------------------------------------------
// SERVICE REGISTRY (AGENT METADATA)
// ----------------------------------------------------------------------------
const agents = [
    { 
        id: 1, 
        name: "Lumina-7B",      
        price: 49, 
        endpoint: "/api/lumina",     
        category: "Career",
        description: "High-performance language model for reasoning, text analysis, and development feedback." 
    },
    { 
        id: 2, 
        name: "Visionary-X",        
        price: 79, 
        endpoint: "/api/visionary",   
        category: "Math",
        description: "Real-time object detection, scene analysis, and geometric calculations." 
    },
    { 
        id: 3, 
        name: "DataSynth",     
        price: 29, 
        endpoint: "/api/datasynthesis", 
        category: "E-Commerce",
        description: "Automated data cleaning, synthetic generation, and price trend analysis." 
    },
    { 
        id: 4, 
        name: "Quantum-Core", 
        price: 99, 
        endpoint: "/api/quantum",    
        category: "Finance",
        description: "Advanced probabilistic computing power for edge devices and financial forecasting." 
    }
];

// ----------------------------------------------------------------------------
// AGENT SERVICE HANDLERS (MODULAR TOOLS)
// ----------------------------------------------------------------------------
const toolHandlers = {
    // LUMINA-7B (NLP/RESUME LOGIC)
    lumina: (req, res) => {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Input text is required." });

        const keywords = ["experience", "skills", "react", "node", "ai", "architecture"];
        let count = 0;
        keywords.forEach(k => { if (text.toLowerCase().includes(k)) count++; });

        const score = Math.min(100, Math.max(30, count * 15 + Math.floor(Math.random() * 10)));
        res.json({
            agent: "Lumina-7B",
            analysis: score > 70 ? "High technical density detected." : "Standard informative text.",
            relevance_score: `${score}%`,
            keywords_found: count,
            timestamp: new Date().toISOString()
        });
    },

    // VISIONARY-X (MATHEMATICAL/VISUAL LOGIC)
    visionary: (req, res) => {
        const { a, b, operation } = req.body;
        // Re-using math logic for geometric/spatial simulation
        if (typeof a !== 'number' || typeof b !== 'number') return res.status(400).json({ error: "Spatial coordinates 'a' and 'b' (numbers) are required." });
        
        let result;
        switch(operation) {
            case "add":      result = a + b; break;
            case "subtract": result = a - b; break;
            case "multiply": result = a * b; break;
            case "divide":   result = b !== 0 ? a / b : "Error: Division by zero"; break;
            default:         result = Math.sqrt(a * a + b * b); // Euclidean distance as default
        }
        res.json({ 
            agent: "Visionary-X", 
            detected_objects: ["Rectangle", "Point"],
            calculated_dimension: result,
            confidence: 0.98,
            timestamp: new Date().toISOString() 
        });
    },

    // DATASYNTHESIS (ANALYTICS LOGIC)
    datasynthesis: (req, res) => {
        const amount = req.body.amount || 1000;
        const amazon = Math.floor(Math.random() * 200) + 800;
        const flipkart = Math.floor(Math.random() * 200) + 800;
        
        res.json({
            agent: "DataSynth",
            synthetic_samples: 50,
            market_volatility: "Low",
            price_scouting: {
                amazon,
                flipkart,
                recommendation: amazon < flipkart ? "Amazon" : "Flipkart"
            },
            status: "Success"
        });
    },

    // QUANTUM (FORECASTING LOGIC)
    quantum: (req, res) => {
        const { amount } = req.body;
        const rate = 83.2; 
        const forecast = (amount || 1) * rate * (1 + (Math.random() * 0.05));
        
        res.json({ 
            agent: "Quantum-Core", 
            currency_base: "USD", 
            conversion_target: "INR", 
            spot_rate: rate,
            probabilistic_forecast: forecast.toFixed(2),
            compute_latency: "1.2ms"
        });
    }
};

// ----------------------------------------------------------------------------
// SECURITY & ROUTING MIDDLEWARE
// ----------------------------------------------------------------------------

// AUTHENTICATION GUARD (scoped access)
function checkApiKey(req, res, next) {
    const key = req.headers.authorization;
    if (!key) return res.status(401).json({ error: "API key missing" });

    const auth = apiKeys[key];
    if (!auth) return res.status(403).json({ error: "Invalid API key" });

    // AGENT-LEVEL ACCESS CONTROL
    const requestedAgent = req.params.agent; // from /api/:agent
    const agentData = agents.find(a => a.id === auth.agentId);
    
    // Extract slug from endpoint (e.g., /api/lumina -> lumina)
    const agentSlug = agentData?.endpoint.split("/").pop();

    if (agentSlug !== requestedAgent) {
        return res.status(403).json({ error: `Access to agent '${requestedAgent}' not permitted with this key. Key is scoped to '${agentSlug}'.` });
    }

    req.auth = auth;
    next();
}

// MCP DYNAMIC ROUTER DISPATCHER
/**
 * This simulates an MCP (Model Context Protocol) multi-agent routing system.
 * It dynamically maps incoming request slugs to their respective service handlers.
 */
function routeToAgent(agentSlug, req, res) {
    const handler = toolHandlers[agentSlug];
    
    if (!handler) {
        return res.status(404).json({ error: `Agent '${agentSlug}' not found in registry` });
    }

    // Dynamic dispatch to the selected agent tool
    handler(req, res);
}

// ----------------------------------------------------------------------------
// ROUTES
// ----------------------------------------------------------------------------

app.post("/login", (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });
    users.push(username);
    res.json({ message: "Logged in", username });
});

app.post("/buy", (req, res) => {
    const { username, agentId } = req.body;
    const key = `sk-${Math.random().toString(36).substring(2, 10)}`;
    apiKeys[key] = { username, agentId };
    res.json({ apiKey: key });
});

app.get("/agents", (req, res) => res.json(agents));

// MCP PROTECTED AGENT ROUTES
app.post("/api/:agent", checkApiKey, (req, res) => {
    routeToAgent(req.params.agent, req, res);
});

// ----------------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 [BACKEND] Gateway & OBSERVATORY Agents live on port ${PORT}`));