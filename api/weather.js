export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(455).json({ error: 'Method not allowed' });
  }

  const { city } = req.query;

  if (!city || typeof city !== 'string' || city.trim() === '') {
    return res.status(400).json({ error: 'City query parameter is required' });
  }

  const apiKey = process.env.WEATHERAPI_KEY || 'c3f6af1ef0524753a1c131335262210';
  const targetUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city.trim())}&aqi=no`;

  try {
    const upstreamRes = await fetch(targetUrl);
    const data = await upstreamRes.json();

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error while fetching weather data.' });
  }
}
