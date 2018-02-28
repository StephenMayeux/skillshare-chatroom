const redis = require('redis');
const promise = require('bluebird');

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

const redisClient = () => {
  return new Promise((resolve, reject) => {
    const connector = redis.createClient({
      url: process.env.REDIS_URI
    });

    connector.on('connect', () => {
      console.log('Successfully connected to Redis.');
      resolve(connector);
    });

    connector.on('error', () => {
      reject('Connecting to Redis has failed.')
    });
  });
};

module.exports = redisClient;
