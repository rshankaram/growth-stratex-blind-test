export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { prompt, type, url } = req.body;

  // Homepage fetch mode
  if (type === 'fetch_homepage') {
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    try {
      let fetchUrl = url.trim();
      if (!fetchUrl.startsWith('http')) fetchUrl = 'https://' + fetchUrl;
      const pageRes = await fetch(fetchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; positioning-diagnostic/1.0)' },
        signal: AbortSignal.timeout(8000)
      });
      if (!pageRes.ok) return res.status(400).json({ error: `Could not fetch page: ${pageRes.status}` });
      const html = await pageRes.text();
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 4000);
      return res.status(200).json({ text });
    } catch (err) {
      return res.status(500).json({ error: 'Could not reach that URL. Please check it and try again.' });
    }
  }

  // AI call mode
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });
  const maxTokens = type === 'final' ? 1200 : type === 'mirror' ? 600 : type === 'prefill' ? 300 : 500;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }
    const data = await response.json();
    return res.status(200).json({ text: data.choices[0].message.content });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Request failed' });
  }
}
