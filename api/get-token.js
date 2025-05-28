import cookie from 'cookie';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  const cookies = cookie.parse(req.headers.cookie || '');
  const fbCookie = req.query.cookie || cookies.fb_cookie;

  if (!fbCookie) {
    console.log(`[${timestamp}] ❌ No cookie provided`);
    return res.status(400).json({ success: false, error: 'Missing cookie' });
  }

  try {
    const apiUrl = `https://ynxappdev45.pythonanywhere.com/getToken?cookie=${encodeURIComponent(fbCookie)}`;
    const response = await fetch(apiUrl);
    const text = await response.text();

    console.log(`[${timestamp}] ✅ API called successfully`);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: 'API error', body: text });
    }

    const data = JSON.parse(text);
    console.log(`[${timestamp}] ✅ Token received`);
    res.setHeader('Set-Cookie', cookie.serialize('fb_cookie', fbCookie, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: '/',
    }));
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    console.error(`[${timestamp}] ❌ Server error:`, err);
    res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
  }
}
