const express = require('express');
const axios = require('axios');
const app = express();
const Queue = require('bull');

const PORT = process.env.PORT || 8888;

app.get('/fish-species', async (req, res) => {
	try {
		const API_URL = 'https://www.fishwatch.gov/api/species';
		const { data } = await axios.get(API_URL);
		let isCached = false;

		return res.status(200).json({
			fromCache: isCached,
			data,
		});
	} catch (err) {
		console.err(err);

		return res.status(404).send('Data unavailable');
	}
});

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
