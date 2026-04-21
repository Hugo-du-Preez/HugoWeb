// netlify/functions/chat.js
const https = require('https');

// Inline knowledge base (no import needed)
const KNOWLEDGE_BASE = {
  profile: `Hugo du Preez - Software Development Graduate from Belgium Campus iTversity (2023-2026, Pretoria, South Africa). 16 academic distinctions. Microsoft AZ-900 certified. CCNA exam scheduled April 2026. ISC2 Certified in Cybersecurity exam scheduled May 2026. Available for software engineering opportunities from August 2026.`,
  
  contact: `Email: hugo777dupreez@gmail.com | Phone: +27 65 843 9361 | LinkedIn: linkedin.com/in/hugo-du-preez/ | GitHub: github.com/Hugo-du-Preez`,
  
  skills: `Backend: C#, .NET, REST APIs, OOP. Data: SQL Server, T-SQL, MongoDB, Power BI. Cloud: Azure, Static Web Apps, DevOps. Web: Flask, HTML/CSS, Bootstrap, JavaScript. Other: Git, Agile, Systems Analysis, Software Testing.`,
  
  projects: [
    {
      name: "Portfolio Analytics Dashboard",
      type: "Business Intelligence",
      tech: "Power BI, Azure Static Web Apps, T-SQL, Excel/OneDrive",
      desc: "Enterprise-grade Power BI solution with embedded analytics, Azure deployment, and real-time Excel integration from OneDrive."
    },
    {
      name: "AFCON 2025 MongoDB Platform",
      type: "Database Engineering",
      tech: "Python, MongoDB, Flask, REST API",
      desc: "High-performance Flask application managing AFCON 2025 tournament data with geospatial queries, RESTful API architecture, and custom query builder. Handles 700+ player records."
    },
    {
      name: "Student Management System",
      type: "Full-Stack Development",
      tech: "Flask, SQLite, Bootstrap 5, HTML/CSS/JS",
      desc: "Complete enterprise CRUD application migrated from legacy Tkinter to modern web architecture. Features SQLite backend, Bootstrap 5 responsive UI."
    }
  ],
  
  education: `Diploma in Information Technology (Software Development stream, NQF Level 6) at Belgium Campus iTversity (2023-2026, Pretoria). Core modules: Advanced Programming (C#, OOP, web dev), Database Architecture (SQL Server, cloud DBs, BI), Software Engineering (systems analysis, testing, architecture), Cloud & Infrastructure (Azure, networks, IoT), Project Delivery (management, enterprise integration), Professional Development (communication, IT law, innovation).`,
  
  certifications: `Microsoft Azure Fundamentals (AZ-900) - Certified and verified. Cisco Certified Network Associate (CCNA) - Exam scheduled April 2026. ISC2 Certified in Cybersecurity (CC) - Exam scheduled May 2026.`,
  
  availability: "Available for junior developer, backend developer, database engineer, and cloud infrastructure roles from August 2026."
};

// Simple HTTP request helper (no fetch needed)
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data)
        });
      });
    });
    
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW_MS = 60000;

function checkRateLimit(clientIP) {
  const now = Date.now();
  const key = clientIP || 'unknown';
  
  for (const [mapKey, data] of rateLimitMap.entries()) {
    if (now - data.resetTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(mapKey);
    }
  }
  
  const existing = rateLimitMap.get(key);
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_PER_MINUTE - 1 };
  }
  
  if (existing.count >= RATE_LIMIT_PER_MINUTE) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((existing.resetTime - now) / 1000) };
  }
  
  existing.count++;
  return { allowed: true, remaining: RATE_LIMIT_PER_MINUTE - existing.count };
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message is required' }) };
    }

    // Rate limiting
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
      return { statusCode: 429, headers, body: JSON.stringify({ error: `Rate limit exceeded. Wait ${rateCheck.retryAfter}s.` }) };
    }

    // Check API key
    if (!process.env.GROQ_API_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    // Build prompt
    const systemPrompt = `You are Hugo du Preez's AI assistant on his portfolio website.

PROFILE: ${KNOWLEDGE_BASE.profile}

CONTACT: ${KNOWLEDGE_BASE.contact}

SKILLS: ${KNOWLEDGE_BASE.skills}

PROJECTS:
${KNOWLEDGE_BASE.projects.map(p => `- ${p.name} [${p.type}] (${p.tech}): ${p.desc}`).join('\n')}

EDUCATION: ${KNOWLEDGE_BASE.education}

CERTIFICATIONS: ${KNOWLEDGE_BASE.certifications}

AVAILABILITY: ${KNOWLEDGE_BASE.availability}

Be concise, professional, and friendly. Mention specific technologies when discussing projects.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4),
      { role: 'user', content: message.trim() }
    ];

    // Call Groq API using https (no fetch)
    const response = await makeRequest('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (response.status !== 200) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply, usage: data.usage })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};