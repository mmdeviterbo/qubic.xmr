export const getPrevious1159AMUTC = (): Date => {
  const now = new Date();
  const target = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      11,
      59,
      0,
      0,
    ),
  );

  // If current time is before 11:59 AM UTC, go to the previous day
  if (now < target) {
    target.setUTCDate(target.getUTCDate() - 1);
  }
  return target;
};

export const getPreviousEpochDateUTC = (): Date => {
  const now = new Date();
  const nowDay = now.getUTCDay(); // Sunday = 0, Monday = 1, ..., Wednesday = 3
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
  );

  // Start with today's date at 11:59 AM UTC
  let target = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      11,
      59,
      0,
      0,
    ),
  );

  let daysSinceWednesday = (nowDay + 7 - 3) % 7; // 3 is Wednesday
  if (daysSinceWednesday === 0 && nowUTC < target.getTime()) {
    daysSinceWednesday = 7;
  }
  target.setUTCDate(target.getUTCDate() - daysSinceWednesday);
  return target;
};
