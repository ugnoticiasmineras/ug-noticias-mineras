// pages/api/metals.js
export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://api.metalpriceapi.com/v1/latest?api_key=83129f75deee41f91c200678213cef94&base=USD&symbols=XAU,XCU'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch metals');
    }

    const data = await response.json();
    const oro = (1 / data.rates.XAU).toFixed(2); // USD por onza
    const cobre = (1 / data.rates.XCU * 2204.62).toFixed(2); // USD por libra

    res.status(200).json({ oro, cobre });
  } catch (error) {
    console.error('Metal API error:', error);
    res.status(500).json({ error: 'Failed to fetch metal prices' });
  }
}