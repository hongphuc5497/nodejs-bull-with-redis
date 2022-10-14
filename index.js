const bull = require('bull');
const { createClient } = require('redis');

(async () => {
  try {
    const redisClient = createClient()

    await redisClient.connect();
  } catch (err) {
    console.log('Redis Client Error', err)
  }
})();
