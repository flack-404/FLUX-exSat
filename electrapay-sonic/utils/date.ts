// utils/date.ts
import { format, fromUnixTime } from 'date-fns';

export const formatTimestamp = (timestamp: number) => {
  return format(fromUnixTime(timestamp), 'PPP');
};

export const getNextPaymentDate = (lastPayment: number, interval: number) => {
  return formatTimestamp(lastPayment + interval);
};
