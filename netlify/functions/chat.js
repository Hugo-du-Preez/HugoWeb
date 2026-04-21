import { KNOWLEDGE_BASE } from './knowledge.js';

// Simple rate limiting: track requests per IP per minute
const rateLimitMap = new Map();
const RATE_LIMIT_PER_MINUTE = 10; // Conservative limit
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

function checkRateLimit(clientIP) {
  const now = Date.now();
  const key = clientIP || 'unknown';
  
  // Clean old entries
  for (const [mapKey, data] of rateLimitMap.entries()) {
    if (now - data.resetTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(mapKey);
    }
  }
  
  const existing = rateLimitMap.get(key);
  if (!existing || now > existing.resetTime) {
    // New window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return { allowed: true, remaining: RATE_LIMIT_PER_MINUTE - 1 };
  }
  
  if (existing.count >= RATE_LIMIT_PER_MINUTE) {
    return { 
      allowed: false, 
      remaining: 0,
      retryAfter: Math.ceil((existing.resetTime - now) / 1000)
    };
  }
  
  existing.count++;
  return { allowed: true, remaining: RATE_LIMIT_PER_MINUTE - existing.count };
}

export const handler = async (event, context) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Rate limiting
  const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || event.headers['client-ip'] || 'unknown';
  const rateCheck = checkRateLimit(clientIP);
  
  if (!rateCheck.allowed) {
    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Limit': String(RATE_LIMIT_PER_MINUTE),
        'X-RateLimit-Remaining': '0',
        'Retry-After': String(rateCheck.retryAfter)
      },
      body: JSON.stringify({ 
        error: `Rate limit exceeded. Please wait ${rateCheck.retryAfter} seconds before sending another message.` 
      })
    };
  }

  try {
    const { message, history = [] } = JSON.parse(event.body);

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    if (message.length > 500) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Message too long (max 500 characters)' })
      };
    }

    // Build system prompt with knowledge base
    const systemPrompt = `You are Hugo du Preez's AI assistant on his portfolio website. You have complete knowledge of his profile, skills, projects, education, and certifications. Answer accurately based on this data. If asked about something not in your knowledge, politely say you don't have that specific information.

PROFILE: ${KNOWLEDGE_BASE.profile}

CONTACT: ${KNOWLEDGE_BASE.contact}

SKILLS: ${KNOWLEDGE_BASE.skills}

PROJECTS:
${KNOWLEDGE_BASE.projects.map(p => `- ${p.name} [${p.type}] (${p.tech}): ${p.desc}`).join('\n')}

EDUCATION: ${KNOWLEDGE_BASE.education}

CERTIFICATIONS: ${KNOWLEDGE_BASE.certifications}

BLOG TOPICS: ${KNOWLEDGE_BASE.blogTopics}

AVAILABILITY: ${KNOWLEDGE_BASE.availability}

GUIDELINES:
- Be concise but informative (2-4 sentences typical)
- Mention specific technologies when discussing projects
- For availability, always say "August 2026"
- Provide contact info when asked about hiring/reaching out
- If asked about GitHub repos, mention github.com/Hugo-du-Preez
- Maintain a professional, friendly tone`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4), // Keep last 4 exchanges
      { role: 'user', content: message.trim() }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Limit': String(RATE_LIMIT_PER_MINUTE),
        'X-RateLimit-Remaining': String(rateCheck.remaining)
      },
      body: JSON.stringify({
        reply,
        usage: data.usage,
        rateLimit: {
          limit: RATE_LIMIT_PER_MINUTE,
          remaining: rateCheck.remaining
        }
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message || 'Internal server error. Please try again later.' })
    };
  }
};