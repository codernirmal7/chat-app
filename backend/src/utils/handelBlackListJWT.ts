import Redis from "ioredis";

// Initialize Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST, // e.g., 'your-redis-instance.redisprovider.com'
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD, // If your Redis provider requires a password
});

const blacklistToken = async (token: string, expiry: number): Promise<void> => {
  // Store the token with an expiry time
  await redisClient.setex(`blacklist:${token}`, expiry, "revoked");
};

const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await redisClient.get(`blacklist:${token}`);
  return result === "revoked";
};

export { blacklistToken, isTokenBlacklisted };