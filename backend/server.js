/**
 * ============================================================================
 * BACKEND ARCHITECTURE: AI AGENT MARKETPLACE (API GATEWAY)
 * ============================================================================
 * ROLE: Central Security Guard & Dynamic Service Router.
 * ARCHITECTURE: Node.js Gateway -> Python Microservices.
 * ============================================================================
 */

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// ----------------------------------------------------------------------------
// PERSISTENCE (In-Memory for Demo)
// ----------------------------------------------------------------------------
let apiKeys = {}; // { sk-xxxx: { username, agentId } }

// ----------------------------------------------------------------------------
// AGENT REGISTRY
// ----------------------------------------------------------------------------
const AGENTS = [
    { 
        id: 1, 
        name: "Resume Intelligence", 
        slug: "resume",
        price: 49,
        port: 5002,
        description: "Analyze resumes, extract keywords, and calculate relevance scores using NLP." 
    },
    { 
        id: 2, 
        name: "Product Intelligence", 
        slug: "product",
        price: 79,
        port: 5003,
        description: "Real-time price comparison across Amazon, Flipkart, and Croma with market reasoning." 
    },
    { 
        id: 3, 
        name: "Text Analysis Agent", 
        slug: "analyze",
        price: 29,
        port: 5004,
        description: "Generate summaries, detect tone, and extract key concepts from any text body." 
    }
];

// ----------------------------------------------------------------------------
// MIDDLEWARE: STRICT API KEY VALIDATION
// ----------------------------------------------------------------------------
function authenticate(req, res, next) {
    const key = req.headers.authorization;
    
    // 1. Check if key exists
    if (!key) {
        return res.status(401).json({ error: "Missing API Key. Include 'Authorization: sk-xxxx' in headers." });
    }

    // 2. Validate prefix and existence
    const auth = apiKeys[key];
    if (!key.startsWith("sk-") || !auth) {
        return res.status(403).json({ error: "Invalid API Key. Keys must start with 'sk-' and be active." });
    }

    // 3. Scoped Access (Does this key own this agent?)
    const requestedAgentSlug = req.params.agent;
    const agent = AGENTS.find(a => a.id === auth.agentId);
    
    if (!agent || agent.slug !== requestedAgentSlug) {
        return res.status(403).json({ 
            error: `Unauthorized. This key is scoped to '${agent?.name || 'unknown'}' only.` 
        });
    }

    req.auth = auth;
    req.agentServiceUrl = `http://127.0.0.1:${agent.port}/${agent.slug}`;
    next();
}

// ----------------------------------------------------------------------------
// ROUTES
// ----------------------------------------------------------------------------

// 1. User Login (Session Setup)
app.post("/login", (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });
    res.json({ message: "Welcome back", username });
});

// 2. Fetch Agent Marketplace
app.get("/agents", (req, res) => {
    res.json(AGENTS.map(({ id, name, slug, price, description }) => ({
        id, name, endpoint: `/api/${slug}`, price, description
    })));
});

// 3. Purchase Agent (Generate Key)
app.post("/buy", (req, res) => {
    const { username, agentId } = req.body;
    if (!username || !agentId) return res.status(400).json({ error: "Missing purchase data" });

    const key = `sk-${Math.random().toString(36).substring(2, 10)}`;
    apiKeys[key] = { username, agentId };
    
    res.json({ apiKey: key });
});

// 4. API GATEWAY: Forwarding to Python Agents
app.post("/api/:agent", authenticate, async (req, res) => {
    try {
        console.log(`Forwarding request to ${req.agentServiceUrl}...`);
        const response = await axios.post(req.agentServiceUrl, req.body, { timeout: 15000 });
        res.json(response.data);
    } catch (err) {
        console.error("Agent Service Error:", err.message);
        res.status(502).json({ 
            error: "Agent Service Unavailable", 
            details: err.response?.data || err.message 
        });
    }
});

// ----------------------------------------------------------------------------
// BOOTSTRAP
// ----------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [GATEWAY] Live on port ${PORT}`);
    console.log(`🔗 Registry: Resume (5002), Product (5003), Analyze (5004)`);
});