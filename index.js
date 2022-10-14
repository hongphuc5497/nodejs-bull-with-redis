const express = require('express');
const axios = require('axios');
const app = express();
const Queue = require('bull');
const { createClient } = require('redis');

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

		const isExist = await redisClient.EXISTS(CACHE_KEY);
		if (isExist) {
			isCached = true;

			const cachedData = await redisClient.LRANGE(CACHE_KEY, 0, -1);
			species = cachedData.map((item) => JSON.parse(item));
		} else {
			const API_URL = 'https://www.fishwatch.gov/api/species';
			const { data } = await axios.get(API_URL);

			await Promise.all(
				data.map((element) => {
					redisClient.RPUSH(CACHE_KEY, JSON.stringify(element));
				})
			);

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

// (async () => {
// 	try {
// 		const basicQueue = new Queue('basic-queue');
// 		await basicQueue.add({
// 			name: 'Test',
// 			age: 20,
// 		});
// 		basicQueue.process((job, done) => {
// 			console.log(job.data);
// 			done();
// 		});

// 		const scheduleQueue = new Queue('schedule-queue', {
// 			defaultJobOptions: {
// 				repeat: { every: 1000 * 60 * 5 },
// 			},
// 		});
// 		await scheduleQueue.add({});
// 		scheduleQueue.process((_, done) => {
// 			console.log('Schedule job');
// 			done();
// 		});
// 	} catch (err) {
// 		console.log('Bull Job Error', err);
// 	}
// })();
