export const generateTokenExpireTime = (hours = 24): Date | Error => {
  // Default: 24 hours

  //Check for max time cross or not
  const maxTimeHours = 100

  if (hours > maxTimeHours) {
     throw new Error(`Maximum token expire time is ${maxTimeHours} hours.`);
  }
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000); // Default: 24 hours
};