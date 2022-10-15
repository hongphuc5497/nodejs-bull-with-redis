const { createClient } = require('redis');
const axios = require('axios');
const express = require('express');
const app = express();
const Queue = require('bull');

let redisClient;
(async () => {
	try {
		redisClient = createClient();

		await redisClient.connect();
	} catch (err) {
		console.error('Redis Client Error', err);
	}
})();

app.get('/fish-species', async (req, res) => {
	try {
		const CACHE_KEY = 'fish-species';
		let species;
		let isCached = false;

		const cachedResult = await redisClient.get(CACHE_KEY);
		if (cachedResult) {
			isCached = true;

			species = JSON.parse(cachedResult);
		} else {
			const API_URL = 'https://www.fishwatch.gov/api/species';
			const { data } = await axios.get(API_URL);

			await redisClient.set(CACHE_KEY, JSON.stringify(data), {
				EX: 180,
				NX: true,
			});

			species = data;
		}

		return res.status(200).json({
			fromCache: isCached,
			data: species,
		});
	} catch (err) {
		console.error(err);

		return res.status(404).send('Data unavailable');
	}
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
