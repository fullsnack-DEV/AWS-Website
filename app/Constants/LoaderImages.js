import moment from 'moment';
import colors from './Colors';
import images from './ImagePath';

export const loaderImage = [
  { id: 1, image: images.basketballLoader },
  { id: 2, image: images.soccerLoader },
  { id: 3, image: images.volleyballLoader },
  { id: 4, image: images.baseballLoader },
  { id: 5, image: images.badmintonLoader },
  { id: 6, image: images.footballLoader },
  { id: 7, image: images.football2Loader },
];

export const eventDefaultColorsData = [
  {
    id: 0,
    color: colors.themeColor,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.yellowColor,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.greeColor,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.eventBlueColor,
    isSelected: false,
  },
];

const adjustForTimezone = (date) => {
  const timeOffsetInMS = date.getTimezoneOffset() * 60000;
  date.setTime(date.getTime() - timeOffsetInMS);
  return date
}

export const commentPostTimeCalculate = (commentPostTime) => {
  const time = adjustForTimezone(new Date(commentPostTime?.toString()));
  const minute = moment(new Date()).diff(time, 'minute');
  const hour = moment(new Date()).diff(time, 'hour');
  const day = moment(new Date()).diff(time, 'day');
  const week = moment(new Date()).diff(time, 'week');
  const month = moment(new Date()).diff(time, 'month');
  const year = moment(new Date()).diff(time, 'year');
  if (year >= 1) {
    return `${year}y ago`;
  } if (month >= 1 && month < 12) {
    return `${month} month ago`;
  } if (week >= 1 && week < 5) {
    return `${week}w ago`;
  } if (day >= 1 && day < 7) {
    return `${day}d ago`;
  } if (hour >= 1 && hour < 24) {
    return `${hour}h ago`;
  } if (minute < 60) {
    return `${minute} min ago`;
  }
  return '';
}
