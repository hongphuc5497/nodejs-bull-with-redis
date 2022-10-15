const express = require('express');
const app = express();

const redisClient = require('./redisClient');
const cacheMiddleware = require('./cacheMiddleware');
const fetchDataCommand = require('./fetchDataCommand');

app.get('/fish-species', cacheMiddleware, fetchDataCommand);

redisClient.connect().then(() => {
	const PORT = process.env.PORT || 8888;
	app.listen(PORT, () => {
		console.log(`App listening on port ${PORT}`);
	});
});
