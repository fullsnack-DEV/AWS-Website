import moment from 'moment';
import images from './ImagePath';

export const loaderImage = [
  // {id: 0, image: PATH.allSportLoader},
  { id: 1, image: images.basketballLoader },
  { id: 2, image: images.soccerLoader },
  { id: 3, image: images.volleyballLoader },
  { id: 4, image: images.baseballLoader },
  { id: 5, image: images.badmintonLoader },
  { id: 6, image: images.footballLoader },
  { id: 7, image: images.football2Loader },
];

export const commentPostTimeCalculate = (commentPostTime) => {
  const minute = moment(new Date()).diff(commentPostTime, 'minute');
  const hour = moment(new Date()).diff(commentPostTime, 'hour');
  const day = moment(new Date()).diff(commentPostTime, 'day');
  const week = moment(new Date()).diff(commentPostTime, 'week');
  const month = moment(new Date()).diff(commentPostTime, 'month');
  const year = moment(new Date()).diff(commentPostTime, 'year');
  if (year >= 1) {
    return `${year}y ago`;
  } if (month >= 1 && month < 12) {
    return `${month}m ago`;
  } if (week >= 1 && week < 5) {
    return `${week}w ago`;
  } if (day >= 1 && day < 7) {
    return `${day}d ago`;
  } if (hour >= 1 && hour < 24) {
    return `${hour}h ago`;
  } if (minute < 60) {
    return `${minute}min ago`;
  }
  return '';
}
