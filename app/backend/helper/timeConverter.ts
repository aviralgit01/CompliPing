import moment from "moment-timezone";
const timezone: string = process.env.TIME_ZONE ?? "Asia/Kolkata";

export function convertToLocalTime(date: any) {
    if (!date) return null;
    return moment.utc(date).tz(timezone).format("YYYY-MM-DD HH:mm:ss");
}

export function isEmailExpired(user_emailVerificationExpiresAt: any) {
  if (!user_emailVerificationExpiresAt) return true;

  const expiryTime = moment.utc(user_emailVerificationExpiresAt).tz(timezone);
  const currentTime = moment().tz(timezone);

  return currentTime.isSameOrAfter(expiryTime);
}