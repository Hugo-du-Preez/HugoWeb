// netlify/functions/chat.js
const https = require('https');

// ===================== KNOWLEDGE BASE =====================
const KNOWLEDGE_BASE = {
  profile: `Hugo du Preez - Final-year IT student (Software Development) at Belgium Campus (2023-2026, Pretoria). 17 distinctions. Microsoft AZ-900 certified. Focus: data analytics, business intelligence, and business process analysis, with a background in backend development and cloud.`,

  contact: `Email: hugo777dupreez@gmail.com | Phone: +27 65 843 9361 | LinkedIn: linkedin.com/in/hugo-du-preez | GitHub: github.com/Hugo-du-Preez | Portfolio: hugodupreez.com`,

  skills: `Data & BI: Power BI, SQL Server, T-SQL, Excel, Data Quality, Data Governance | Business Analysis: BPMN process mapping, requirements analysis, gap analysis, stakeholder management, draw.io/Lucidchart | Backend: C#, .NET, Python, REST APIs, OOP | Databases: SQL Server, T-SQL, MongoDB, SQLite | Cloud & DevOps: Azure (AZ-900), Azure DevOps, CI/CD | Web: Flask, HTML, CSS, Bootstrap, JavaScript`,

  projects: [
    {
      name: "Life Insurance Data Quality & Reporting Framework",
      tech: "SQL Server, T-SQL, Power BI, BPMN",
      desc: "Automated data-quality checks, documented calculation views, and a Power BI dashboard for a life-insurance book. Also includes an As-Is/To-Be process analysis of the claims workflow (BPMN), showing where data-quality issues arise and how to prevent them at capture."
    },
    {
      name: "Portfolio Analytics Dashboard",
      tech: "Power BI, Azure Static Web Apps, T-SQL",
      desc: "BI dashboard with live Power BI reports and Excel integration."
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

  certifications: `Microsoft Azure Fundamentals (AZ-900). CCNA (Scheduled: 2026). ISC2 Cybersecurity (Scheduled: 2026).`,

  github: `
GitHub: github.com/Hugo-du-Preez
Repositories:
- Life Insurance Data Quality & Reporting Framework (SQL Server, T-SQL, Power BI)
- Portfolio Analytics Dashboard (Power BI, Azure, T-SQL)
- AFCON 2025 MongoDB Platform (Flask, MongoDB, REST API)
- Student Management System (Flask, SQLite, Bootstrap)
`,

  cv: `
Career Focus: Data analytics, business intelligence, data quality, and business process analysis
Seeking: Data analyst, BI, and business/process analyst roles (also open to software development and database roles)
Tools: Power BI, Excel, GitHub, Azure DevOps, Visual Studio, Azure Data Studio
Languages: English, Afrikaans
Driver’s License: Code B
`,

  site: `
Website Overview:
- Portfolio focused on data analytics, business intelligence, and business process analysis
- Highlights data quality, Power BI reporting, BPMN process mapping, and real-world projects
- Also shows software development and cloud experience
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

  availability: `Available.`
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
You are Hugo du Preez's friendly AI assistant on his portfolio website. You help visitors (often recruiters) get to know Hugo.

HOW TO REPLY:
- Keep answers short and high-quality. Aim for 2 to 4 short sentences, or up to 4 brief bullet points when listing things. Never write long paragraphs.
- Answer the question directly first, then stop. Do not pad, repeat, or add filler.
- Be warm and professional, like a helpful person who knows Hugo well.
- Never use em dashes. Use commas, colons, or full stops instead.
- Only use the information provided below. Do not guess or make anything up.
- If something is not covered, say so briefly and point them to Hugo: "I am not sure about that one, but Hugo would be happy to chat. You can reach him at hugo777dupreez@gmail.com."
- An occasional emoji is fine to keep things warm, but do not overdo it.

FIRST MESSAGE:
- If it's the first message, greet them warmly first (e.g. "Hi! Great to meet you 👋"), then answer. Only greet once per conversation.

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
          ? `This is the first message. Greet them warmly, then reply in a friendly, helpful way:\n${message}`
          : `Reply in a friendly, helpful way:\n${message}`
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
          temperature: 0.4,
          max_tokens: 200
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