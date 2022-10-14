const Queue = require('bull');
const { createClient } = require('redis');

(async () => {
	try {
		const basicQueue = new Queue('basic-queue');
		await basicQueue.add({
			name: 'Test',
			age: 20,
		});
		basicQueue.process((job, done) => {
			console.log(job.data);
			done();
		});

		const scheduleQueue = new Queue('schedule-queue', {
			defaultJobOptions: {
				repeat: { every: 1000 * 60 * 5 },
			},
		});
		await scheduleQueue.add({});
		scheduleQueue.process((_, done) => {
			console.log('Schedule job');
			done();
		});
	} catch (err) {
		// console.log('Redis Client Error', err);
		console.log('Bull Job Error', err);
	}
})();
