const twoMinutesAgo = 2 * 60;
const oneHourAgo = 60 * 60;
const oneDayAgo = 24 * 60 * 60;
const tenDaysAgo = 10 * oneDayAgo;

export function getDateDifferent(dateTime: any): string {
  if (!dateTime) {
    return "";
  }

  dateTime = new Date(dateTime);
  const to = Math.floor(+new Date() / 1000);
  const from = Math.floor(+dateTime / 1000);
  const distance = to - from;

  if (distance < twoMinutesAgo) {
    return "Just Now";
  } else if (distance > tenDaysAgo) {
    return dateTime.toDateString();
  } else {
    if (distance > twoMinutesAgo && distance <= oneHourAgo) {
      return `${Math.floor(distance / 60)} m`;
    } else if (distance > oneHourAgo && distance <= oneDayAgo) {
      return `${Math.floor(distance / oneHourAgo)} h`;
    } else {
      return `${Math.floor(distance / oneDayAgo)} d`;
    }
  }
}

export function isToday(dateTime: Date): boolean {
  return (
    dateTime.toLocaleString().split(",")[0] ==
    new Date().toLocaleString().split(",")[0]
  );
}

export function isYesterday(dateTime: Date): boolean {
  return (
    dateTime.toLocaleString().split(",")[0] ==
    new Date(new Date().setDate(new Date().getDate() - 1))
      .toLocaleString()
      .split(",")[0]
  );
}

export function getHoursAndMinutes(dateTime: Date): string {
  return dateTime.getHours() + ":" + dateTime.getMinutes();
}

export function getMessageTime(input: any): string {
  const dateTime = input instanceof Date ? input : new Date(input);
  const time = getHoursAndMinutes(dateTime);
  if (isToday(dateTime)) {
    return time;
  }
  if (isYesterday(dateTime)) {
    return `Yesterday ${time}`;
  }
  return `${dateTime.toLocaleString().split(",")[0]} ${time}`;
}
