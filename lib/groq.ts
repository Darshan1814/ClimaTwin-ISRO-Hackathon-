const KEYS = [
  process.env.GROQ_API_KEY || '',
  process.env.GROQ_API_KEY_2 || '',
  process.env.GROQ_API_KEY_3 || '',
].filter(Boolean);

export async function groqChat(
  messages: { role: string; content: string }[],
  model: string = 'llama-3.3-70b-versatile',
  max_tokens: number = 2048
): Promise<string> {
  for (const key of KEYS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ model, messages, max_tokens, temperature: 0.7 }),
      });

      if (res.status === 429) continue;
      if (!res.ok) {
        const errText = await res.text();
        console.error('Groq API error:', errText);
        continue;
      }

      const data = await res.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error('Groq request failed:', err);
      continue;
    }
  }
  throw new Error('All Groq API keys exhausted or failed');
}

export function parseGroqJSON<T>(raw: string): T {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }
  // Try to find JSON object/array directly
  const objMatch = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (objMatch) {
    return JSON.parse(objMatch[1]);
  }
  return JSON.parse(raw);
}
