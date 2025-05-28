export default async function handler(req, res) {
  const cookie = req.query.cookie;
  const timestamp = new Date().toISOString();

  if (!cookie) {
    console.log(`[${timestamp}] ❌ No cookie provided`);
    return res.status(400).json({ error: 'cookie query parameter is required' });
  }

  try {
    const fetch = (await import('node-fetch')).default;

    const apiUrl = `https://ynxappdev45.pythonanywhere.com/getToken?cookie=${encodeURIComponent(cookie)}`;
    const response = await fetch(apiUrl);
    const text = await response.text();

    console.log(`[${timestamp}] ✅ API called successfully`);

    if (!response.ok) {
      console.log(`[${timestamp}] ❌ API error - ${response.status}`);
      return res.status(response.status).json({ error: 'External API error', body: text });
    }

    const data = JSON.parse(text);
    console.log(`[${timestamp}] ✅ Tokens received`);
    res.status(200).json(data);
  } catch (err) {
    console.error(`[${timestamp}] ❌ Server error:`, err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
