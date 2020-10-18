import PATH from "./ImagePath";
import moment from 'moment';

export const loaderImage = [
    // {id: 0, image: PATH.allSportLoader},
    {id: 1, image: PATH.basketballLoader},
    {id: 2, image: PATH.soccerLoader},
    {id: 3, image: PATH.volleyballLoader},
    {id: 4, image: PATH.baseballLoader},
    {id: 5, image: PATH.badmintonLoader},
    {id: 6, image: PATH.footballLoader},
    {id: 7, image: PATH.football2Loader},
];

export const commentPostTimeCalculate = (commentPostTime) => {
    let minute = moment(new Date()).diff(commentPostTime, 'minute');
    let hour = moment(new Date()).diff(commentPostTime, 'hour');
    let day = moment(new Date()).diff(commentPostTime, 'day');
    let week = moment(new Date()).diff(commentPostTime, 'week');
    let month = moment(new Date()).diff(commentPostTime, 'month');
    let year = moment(new Date()).diff(commentPostTime, 'year');
    if (year >= 1) {
        return year + 'y ago';
    } else if (month >= 1 && month < 12) {
        return month + 'm ago';
    } else if (week >= 1 && week < 5) {
        return week + 'w ago';
    } else if (day >= 1 && day < 7) {
        return day + 'd ago';
    } else if (hour >= 1 && hour < 24) {
        return hour + 'h ago';
    } else if (minute < 60) {
        return minute + 'min ago';
    }
}