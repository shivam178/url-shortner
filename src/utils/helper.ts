import crypto from 'crypto';
import lodashIsEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { ApiResponseType } from '../interfaces/apiResponse';

export const isEmpty = (value: any) => lodashIsEmpty(value);

export function parseJSON(str: string) {
  if (isEmpty(str)) return null;
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}

export const clone = (obj: Object) => JSON.parse(JSON.stringify(obj));

export function createResponse(
  statusCode: number,
  result: {
    list?: any[];
    count?: number;
    data?: any;
  },
  error: any,
  message?: string,
  errKey?: string,
) {
  let response: ApiResponseType = {
    error: false,
    message: 'There was some Internal Error',
    statusCode: 90,
    result: {},
  };
  response.statusCode = statusCode;
  response.error = error;
  response.result = result;
  response.message = message;
  response.errKey = errKey;
  return response;
}

export const firstLetterCapital = (str: string) => {
  if (isEmpty(str)) {
    return '';
  }
  return str
    .split(' ')
    .map((arr) => arr.charAt(0).toUpperCase() + arr.slice(1))
    .join(' ');
};

export const firstLetterCapital25 = (str: string) => {
  if (isEmpty(str)) {
    return '';
  }
  let string = str
    .split(' ')
    .map((arr) => arr.charAt(0).toUpperCase() + arr.slice(1))
    .join(' ');
  if (string.length > 25) {
    string = `${string.substring(0, 25)}...`;
  }
  return string;
};

export const formatNumberInReadable = (value: number) => {
  return `₹${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(value)}`;
};

export const formatNumberInReadableWithoutRupee = (value: number) => {
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
    value
  )}`;
};

export const formatDate = (date: Date | string, format = 'DD/MM/YYYY') => {
  try {
    return moment(date).format(format);
  } catch (error) {
    return date;
  }
};

export const formatAmountWithoutRupee = (amount = 0, appendString = '') => {
  if (!isEmpty(amount) && typeof amount === 'number') {
    amount = Math.round(amount) || 0;
    return `${amount?.toLocaleString('en-IN')} ${firstLetterCapital(
      appendString
    )}`;
  }
  return `${0} ${firstLetterCapital(appendString)}`;
};

export const formatAbsoluteAmountWithoutRupee = (
  amount = 0,
  appendString = ''
) => {
  if (!isEmpty(amount) && typeof amount === 'number') {
    amount = Math.abs(Math.round(amount) || 0);
    return `${amount?.toLocaleString('en-IN')} ${firstLetterCapital(
      appendString
    )}`;
  }
  return `${0} ${firstLetterCapital(appendString)}`;
};

export const formatBlankValue = (value: any) => {
  const result = value || 'NA';
  return result;
};

export const formatAmount = (amount = 0, appendRupee = false) => {
  if (!isEmpty(amount) && typeof amount === 'number') {
    amount = Math.round(amount);
    return amount.toLocaleString('en-IN');
  }
  return amount;
};

export const formatAmountWithRupee = (amount = 0, appendString = '') => {
  if (!isEmpty(amount) && typeof amount === 'number') {
    amount = Math.round(amount) || 0;
    return `₹ ${amount?.toLocaleString('en-IN')} ${firstLetterCapital(
      appendString
    )}`;
  }
  return `₹ ${0} ${firstLetterCapital(appendString)}`;
};

export const getRandomId = (digits = 17) => {
  const numBytes = Math.ceil(digits / 2);
  let res = crypto.randomBytes(numBytes).toString('hex');
  res = res.slice(0, digits);
  return res;
};

export function arrToMap<T extends any>(
  arr: T[],
  mapKey: string
): { [key: string]: T } {
  return arr.reduce(
    (prev: object, curr: T) => ((prev[curr[mapKey]] = curr), prev),
    {}
  );
}

export const isObject = (val: string) => {
  try {
    JSON.parse(val);
    return true;
  } catch (error) {
    return false;
  }
};

export const filterSort = <T extends Record<string, unknown>>(
  obj: T
): object => {
  if (isObject(String(obj.sort))) {
    return JSON.parse(String(obj.sort));
  }
  return {};
};
