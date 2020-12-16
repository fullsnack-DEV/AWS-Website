import moment from 'moment';

export const toShortTimeFromString = (timeToconvert) => {
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

export const getShortTimeDifForReservation = (sDate, eDate) => {
  let delta = Math.abs(parseFloat((sDate / 1000).toFixed(0)) - parseFloat((eDate / 1000).toFixed(0)));

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  let time = ''

  if (hours > 0) {
    if (minutes > 0) {
      time = `${hours}:${minutes}h`
    } else {
      time = `${hours}h`
    }
  } else {
    time = `${minutes}m`
  }

  return time;
};

export const getTimeDifForReservation = (sDate, eDate) => {
  let delta = Math.abs(parseFloat((sDate / 1000).toFixed(0)) - parseFloat((eDate / 1000).toFixed(0)));

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  let time = ''

  if (hours > 0) {
    if (hours === 1) {
      time = `${hours} hour `
    } else {
      time = `${hours} hours `
    }
  }

  if (minutes > 0) {
    if (minutes === 1) {
      time = `${time}${minutes} minute`
    } else {
      time = `${time}${minutes} minutes`
    }
  }

  return time;
};
