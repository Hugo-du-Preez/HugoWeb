// netlify/functions/chat.js
const https = require('https');

// ===================== KNOWLEDGE BASE =====================
const KNOWLEDGE_BASE = {
  profile: `Hugo du Preez - Final-year IT student (Software Development) at Belgium Campus (2023-2026, Pretoria). 16 distinctions. Microsoft AZ-900 certified. Focus: backend systems, cloud engineering, data engineering.`,

  contact: `Email: hugo777dupreez@gmail.com | Phone: +27 65 843 9361 | LinkedIn: linkedin.com/in/hugo-du-preez | GitHub: github.com/Hugo-du-Preez | Portfolio: hugodupreez.com`,

  skills: `Backend: C#, .NET, REST APIs, OOP | Data: SQL Server, T-SQL, MongoDB, Power BI | Cloud: Azure, CI/CD, DevOps | Web: Flask, HTML, CSS, Bootstrap, JavaScript | Networking: TCP/IP, routing, subnetting, DHCP, ACLs`,

  projects: [
    {
      name: "Portfolio Analytics Dashboard",
      tech: "Power BI, Azure Static Web Apps, T-SQL",
      desc: "Enterprise BI dashboard with real-time analytics and automated reporting."
    },
    {
      name: "AFCON 2025 MongoDB Platform",
      tech: "Python, Flask, MongoDB, REST API",
      desc: "Tournament platform with geospatial queries and RESTful backend APIs."
    },
    {
      name: "Student Management System",
      tech: "Flask, SQLite, Bootstrap",
      desc: "Full-stack CRUD system migrated from desktop to web deployment."
    }
  ],

  education: `Diploma in Information Technology (Software Development), Belgium Campus (2023-2026). 16 academic distinctions.`,

  certifications: `Microsoft Azure Fundamentals (AZ-900). CCNA (April 2026). ISC2 Cybersecurity (May 2026).`,

  github: `
GitHub: github.com/Hugo-du-Preez
Repositories:
- Portfolio Analytics Dashboard (Power BI, Azure, T-SQL)
- AFCON 2025 MongoDB Platform (Flask, MongoDB, REST API)
- Student Management System (Flask, SQLite, Bootstrap)
`,

  cv: `
Career Focus: Cloud engineering, backend systems, Azure, CI/CD
Internship: Seeking WIL from 1 August 2026
Tools: GitHub, Visual Studio, Azure Data Studio, Cisco Packet Tracer
Languages: English, Afrikaans
Driver’s License: Code B
`,

  site: `
Website Overview:
- Production-ready portfolio showcasing backend and cloud engineering skills
- Highlights enterprise-level development and real-world projects
- Designed to demonstrate full-stack + cloud deployment capability
`,

  ai_project: `
AI Chatbot System:
- Built using Groq API (llama-3.1-8b-instant model)
- Serverless backend using Netlify Functions (Node.js)
- Integrated CV, GitHub, and website data as structured knowledge base
- Custom prompt engineering enforcing strict bullet-point responses
- Includes rate limiting and error handling

Deployment:
- Website hosted on Netlify
- Source code managed via GitHub
- CI/CD: GitHub → Netlify auto-deploy
- Fully serverless architecture
`,

  availability: `Available from 1 August 2026`
};

// ===================== HTTP REQUEST =====================
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
          json: async () => JSON.parse(data),
          text: () => Promise.resolve(data)
        });
      });
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ===================== RATE LIMIT =====================
const rateLimitMap = new Map();
const LIMIT = 10;
const WINDOW = 60000;

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';

  const data = rateLimitMap.get(key);
  if (!data || now > data.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + WINDOW });
    return { allowed: true };
  }

  if (data.count >= LIMIT) {
    return { allowed: false, retry: Math.ceil((data.reset - now) / 1000) };
  }

  data.count++;
  return { allowed: true };
}

// ===================== HANDLER =====================
exports.handler = async (event) => {
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
    const { message, history = [] } = JSON.parse(event.body || '{}');

    if (!message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message required' }) };
    }

    const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    const rate = checkRateLimit(ip);

    if (!rate.allowed) {
      return { statusCode: 429, headers, body: JSON.stringify({ error: `Wait ${rate.retry}s` }) };
    }

    if (!process.env.GROQ_API_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing API key' }) };
    }

    // Detect first message
    const isFirstMessage = history.length === 0;

    // ===================== SYSTEM PROMPT =====================
    const systemPrompt = `
You are Hugo du Preez's AI assistant.

STRICT RULES:
- ONLY use provided data
- NEVER guess or invent information
- If unknown: "Not specified in Hugo's portfolio"
- Max 5 bullet points
- Max 12 words per bullet
- No paragraphs or filler text

TONE:
- Friendly, polite, and professional
- Recruiter-friendly communication style

FIRST MESSAGE RULE:
- If first interaction, greet politely ("Hi! Nice to meet you 👋")
- Only greet ONCE per conversation

PROFILE: ${KNOWLEDGE_BASE.profile}
CONTACT: ${KNOWLEDGE_BASE.contact}
SKILLS: ${KNOWLEDGE_BASE.skills}

PROJECTS:
${KNOWLEDGE_BASE.projects.map(p => `- ${p.name} (${p.tech}): ${p.desc}`).join('\n')}

EDUCATION: ${KNOWLEDGE_BASE.education}
CERTIFICATIONS: ${KNOWLEDGE_BASE.certifications}
GITHUB: ${KNOWLEDGE_BASE.github}
CV: ${KNOWLEDGE_BASE.cv}
SITE: ${KNOWLEDGE_BASE.site}
AI SYSTEM: ${KNOWLEDGE_BASE.ai_project}
AVAILABILITY: ${KNOWLEDGE_BASE.availability}
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-3),
      {
        role: 'user',
        content: isFirstMessage
          ? `First message: greet politely, then answer in bullet points only:\n${message}`
          : `Answer in bullet points only:\n${message}`
      }
    ];

    const response = await makeRequest(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          temperature: 0.2,
          max_tokens: 300
        })
      }
    );

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error('Chat error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};