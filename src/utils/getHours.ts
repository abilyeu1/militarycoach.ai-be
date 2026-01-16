export const getHoursLeft = async (userCreatedAt: Date) => {
  const currentTime = new Date(); // Current time

  const timeDifferenceMs =
    currentTime.getTime() - new Date(userCreatedAt).getTime();

  // Convert milliseconds to hours
  const hoursPassed = timeDifferenceMs / (1000 * 60 * 60); // 1 hour = 3600 seconds = 3600 * 1000 milliseconds

  const roundedHours = hoursPassed.toFixed(2);

  return roundedHours;
};
