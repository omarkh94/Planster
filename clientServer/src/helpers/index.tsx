import moment from "moment";

export function timeAgo(date: Date | string | number): string {
  return moment(date).fromNow();
}


