import moment from 'moment';

const toShortTimeFromString = (timeToconvert) => {
  const minute = moment(new Date()).diff(timeToconvert, 'minute');
  const hour = moment(new Date()).diff(timeToconvert, 'hour');
  const day = moment(new Date()).diff(timeToconvert, 'day');
  const week = moment(new Date()).diff(timeToconvert, 'week');
  const month = moment(new Date()).diff(timeToconvert, 'month');
  const year = moment(new Date()).diff(timeToconvert, 'year');
  const date = moment(timeToconvert);
  if (year >= 1) {
    return date.format('MMM D, yyyy')
  } if (month >= 1) {
    return date.format('MMM D')
  } if (week >= 1) {
    return date.format('MMM D')
  } if (day >= 1) {
    return `${day}d`;
  } if (hour >= 1) {
    return `${hour}h`;
  } if (minute >= 1) {
    return `${minute}m`;
  }
  return 'Just now';
}

export default toShortTimeFromString
