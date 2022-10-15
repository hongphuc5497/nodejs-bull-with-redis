const axios = require('axios');
const redisClient = require('./redisClient');

module.exports = async (req, res) => {
  try {
    const CACHE_KEY = 'fish-species';
		const API_URL = 'https://www.fishwatch.gov/api/species';
		const { data } = await axios.get(API_URL);

		await redisClient.set(CACHE_KEY, JSON.stringify(data), {
			EX: 180,
			NX: true,
		});

		return res.status(200).json({
			fromCache: false,
			data,
		});
	} catch (err) {
		console.error(err);

		return res.status(404).send('Data unavailable');
	}
};
