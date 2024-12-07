import Redis from "ioredis";

// Initialize Redis client
const redisClient = new Redis();

const blacklistToken = async (token: string, expiry: number): Promise<void> => {
  // Store the token with an expiry time
  await redisClient.setex(`blacklist:${token}`, expiry, "revoked");
};

const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await redisClient.get(`blacklist:${token}`);
  return result === "revoked";
};

export { blacklistToken, isTokenBlacklisted };