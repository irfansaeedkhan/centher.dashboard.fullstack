import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DAY } from "../constants/common";

export const LoadingSkeleton = ({ width = 60 }) => {
  return (
    <Skeleton
      baseColor="#2a2d3c"
      highlightColor="#4f546c"
      width={width + "px"}
    />
  );
};

export const parseErrorMsg = (errMsg) => {
  var returStr = "";
  let startPos = JSON.stringify(errMsg).search("message");
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 4, errMsg.length);
    let endPos = subStr.indexOf('"');
    if (endPos >= 0) {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  } else returStr = errMsg;
  return returStr;
};

export function getUTCNow() {
  return Date.now();
}

export function getUTCTimeStamp(_date) {
  var date = new Date(_date);
  var date_utc = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return date_utc.getTime();
}

export function getDeadlineTimestamp(start_time, duration) {
  const date = new Date(parseInt(start_time));
  const date_utc = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  const start_utc = date_utc.getTime();
  if (duration > 3650) duration = 3650;
  return start_utc + duration * 24 * 3600 * 1000;
}

export function getTime(date) {
  return (date * 24 * 3600 * 1000).toString();
}

export function getUTCDate(timestamp) {
  const num_time = parseInt(timestamp) * 1000;
  const date = new Date(num_time);
  return moment.utc(date).format("MMMM Do, HH:mm UTC");
}

export function getUTCNowDate(id) {
  const date = new Date();
  return moment.utc(date).add(id, "days").format("YYYY-MM-DD");
}

export function validationStartTime(start_time) {
  const start_date = new Date(parseInt(start_time));
  const now_date = new Date();
  let difference =
    moment(start_date, "DD/MM/YYYY HH:mm:ss").diff(
      moment(now_date, "DD/MM/YYYY HH:mm:ss")
    ) / 1000;

  if (difference > -DAY) return true;
  else return false;
}
