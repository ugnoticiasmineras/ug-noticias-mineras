// pages/api/image.js

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Usa fetch nativo (disponible en Node.js 18+)
    const response = await fetch(decodeURIComponent(url));

    if (!response.ok) {
      console.error('Image fetch failed:', response.status, response.statusText);
      return res.status(response.status).end();
    }

    // Copiar headers importantes
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const contentLength = response.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 día

    // Enviar el cuerpo de la respuesta
    const buffer = await response.arrayBuffer();
    res.status(200).end(Buffer.from(buffer));
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
}