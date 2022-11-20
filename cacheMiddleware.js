const redisClient = require('./redisClient');

module.exports = async (req, res, next) => {
	try {
		const CACHE_KEY = 'fish-species';

		const cachedResult = await redisClient.get(CACHE_KEY);
		if (cachedResult) {
			return res.status(200).json({
				fromCache: true,
				data: JSON.parse(cachedResult),
			});
		} else {
			next();
		}
	} catch (err) {
		return res.status(404);
	}
};
