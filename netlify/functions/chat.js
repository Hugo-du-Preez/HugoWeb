import { KNOWLEDGE_BASE } from './knowledge.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

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
  console.log('=== FUNCTION STARTED ===');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers));
  console.log('Body:', event.body);

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Rejected: Not POST');
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Rate limiting
  const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(clientIP);
  console.log('Rate check:', rateCheck);
  
  if (!rateCheck.allowed) {
    return {
      statusCode: 429,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Rate limit exceeded. Wait ${rateCheck.retryAfter}s.` })
    };
  }

  try {
    console.log('Parsing body...');
    const { message, history = [] } = JSON.parse(event.body || '{}');
    console.log('Message:', message);
    console.log('History length:', history.length);

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('Rejected: Empty message');
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    if (message.length > 500) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Message too long (max 500 characters)' })
      };
    }

    console.log('Building system prompt...');
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

    console.log('Calling Groq API...');
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

    console.log('Groq response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Groq error:', errorData);
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Groq success, reply length:', data.choices[0]?.message?.content?.length);
    const reply = data.choices[0]?.message?.content || 'No response';

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply, usage: data.usage })
    };

  } catch (error) {
    console.error('=== FUNCTION ERROR ===');
    console.error(error);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};