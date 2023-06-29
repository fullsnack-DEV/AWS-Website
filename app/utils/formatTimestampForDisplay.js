import moment from 'moment';
import {format} from 'react-string-format';
import {strings} from '../../Localization/translation';

export const formatTimestampForDisplay = (
  commentPostTime,
  offset = new Date().getTimezoneOffset(),
) => {
  const time = new Date(commentPostTime);
  // const offset = new Date().getTimezoneOffset();
  time.setMinutes(time.getMinutes() - offset);
  const minute = moment(new Date()).diff(time, 'minute');
  const hour = moment(new Date()).diff(time, 'hour');
  const day = moment(new Date()).diff(time, 'day');
  const week = moment(new Date()).diff(time, 'week');
  const month = moment(new Date()).diff(time, 'month');
  const year = moment(new Date()).diff(time, 'year');

  if (minute === 0) {
    return 'Just now';
  }
  if (minute < 60) {
    // return `${minute} min ago`;
    return format(strings.nTimeAgo, minute, 'min');
  }
  if (hour >= 1 && hour < 24) {
    // return `${hour}h ago`;
    return format(strings.nTimeAgo, hour, 'h');
  }
  if (day >= 1 && day < 7) {
    // return `${day}d ago`;
    return format(strings.nTimeAgo, day, 'd');
  }
  if (week >= 1 && week < 5) {
    // return `${week}w ago`;
    return format(strings.nTimeAgo, week, 'w');
  }
  if (month >= 1 && month < 12) {
    // return `${month} month ago`;
    return format(strings.nTimeAgo, month, 'month');
  }
  if (year >= 1) {
    // return `${year}y ago`;
    return format(strings.nTimeAgo, year, 'y');
  }
  return '';
};

export default formatTimestampForDisplay;
