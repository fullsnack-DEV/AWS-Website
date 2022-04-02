import moment from 'moment';
import images from '../Constants/ImagePath';

const REVIEW_EXPIRY_DAYS = 5;

const GAME_HOME = {
  soccer: 'SoccerHome',
  tennis: 'TennisHome',
  tennis_double: 'TennisHome',
}

const getGameHomeScreen = (sportName) => GAME_HOME[sportName?.split(' ').join('_').toLowerCase()];

// Soccer
const soccerGameStats = {
  start: 'started',
  end: 'ended',
  resume: 'resumed',
  pause: 'paused',
  gameStart: '',
  gameEnd: '',
}

const soccerGamePlayerStatusStats = {
  yc: 'received a yellow card',
  rc: 'received a red card',
  in: 'was in',
  out: 'was out',
}

const soccerGamePlayStats = {
  goal: 'scored a goal',
  ownGoal: 'scored a own goal',
  yc: 'received a yellow card',
  rc: 'received a red card',
  in: 'was in',
  out: 'was out',
  score: 'was scored',
  setStart: 'was started',
  setEnd: 'was ended',
  gameStart: 'was started',
  gameEnd: 'was ended',
  ace: 'was ace',
  fault: 'was ace',
  let: 'was let',
  unforcedError: 'was unforced error',
  footFault: 'was foot fault',
  winner: 'was winner',
}

const soccerGamePlayStatsImage = {
  goal: images.gameGoal,
  yc: images.gameYC,
  rc: images.gameRC,
  in: images.gameIn,
  out: images.gameOut,
  score: images.gameGoal,
  setStart: images.gameGoal,
  setEnd: images.gameGoal,
  gameStart: images.gameStart,
  gameEnd: images.gameGoal,
  ace: images.gameGoal,
  fault: images.gameGoal,
  let: images.gameGoal,
  unforcedError: images.gameGoal,
  footFault: images.gameGoal,
  winner: images.gameGoal,
  assist: images.assistBy,
}

const tennisGamePlayStatsImage = {
  score: images.tennisScore,
  setStart: images.gameStart,
  setEnd: images.gameGoal,
  gameStart: images.gameStart,
  gameEnd: images.gameGoal,
  ace: images.tennisAce,
  fault: images.tennisFault,
  let: images.tennisLet,
  unforcedError: images.tennisUnForced,
  footFault: images.tennisFootFault,
  winner: images.tennisWinner,
  assist: images.assistBy,
}

// Tennis
const tennisGameStats = {
  start: 'Match started',
  end: 'Match ended',
  resume: 'Match resumed',
  pause: 'Match paused',
  setStart: 'Set started',
  setEnd: 'Set ended',
  gameStart: 'Game started',
  gameEnd: 'Game ended',
  gameResume: 'Game resumed',
  gamePause: 'Game paused',
}

const tennisGamePlayStats = {
  score: 'scored a point',
  setStart: 'was started',
  setEnd: 'was ended',
  gameStart: 'was started',
  gameEnd: 'was ended',
  ace: 'was ace',
  fault: 'was ace',
  let: 'was let',
  unforcedError: 'was unforced error',
  footFault: 'was foot fault',
  winner: 'was winner',
}
const getGameDateTimeInHMSformat = (date = new Date()) => moment(new Date(date * 1000)).format('hh:mm A')

const checkReviewExpired = (date) => {
 // const expiryDate = moment(date * 1000).add(REVIEW_EXPIRY_DAYS, 'days');

  const expiryDate = moment(date * 1000);
  if (new Date(expiryDate).getTime() > new Date().getTime()) {
    return false
  }

  return true
}

const reviewExpiredDate = (date) => {
 // const expiryDate = moment(date * 1000).add(REVIEW_EXPIRY_DAYS, 'days');
  
  const  expiryDate = moment(date * 1000);
  const thenDate = moment(expiryDate);
  const currentDate = moment(new Date());
  const diff = moment.duration(thenDate.diff(currentDate));
  return `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`;

  
}

const getDiffDays = (date) => {
  const thenDate = moment(date);
  const currentDate = moment(new Date());
  const diff = moment.duration(thenDate.diff(currentDate));
  return diff.days();
}
const getGameDateTimeInDHMformat = (date) => {
  const thenDate = moment(date * 1000);
  const currentDate = moment(new Date());
  const diff = moment.duration(thenDate.diff(currentDate));
  return `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`;
}
const getGameFromToDateDiff = (fromDate, thenDate) => {
  const tDate = moment(thenDate * 1000);
  const fDate = moment(fromDate * 1000);
  const diff = moment.duration(tDate.diff(fDate));
  let date = '';
  if (diff.days() === 0 && diff.hours() === 0) {
    date = `${diff.minutes()}m`
  } else if (diff.days() === 0 && diff.hours() !== 0 && diff.minutes() !== 0) {
    date = `${diff.hours()}h ${diff.minutes()}m`
  } else if (diff.days() === 0 && diff.hours() !== 0 && diff.minutes() === 0) {
    date = `${diff.hours()}h`
  } else if (diff.days() !== 0 && diff.hours() === 0 && diff.minutes() === 0) {
    date = `${diff.days()}d`
  } else {
    date = `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`
  }
  return date;
}

const getGameTimeAgo = (date) => moment
  .utc(new Date(date * 1000))
  .local()
  .startOf('seconds')
  .fromNow()

const getGameConvertMinsToTime = (mins = 101) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  let hrMin = `${hours}h ${minutes}m`;
  if (hours === 0) hrMin = `${minutes}m`;
  return hrMin
}

const getNumberSuffix = (num) => {
  const j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) {
    return `${num}st`;
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`;
  }
  return `${num}th`;
}
export {
  REVIEW_EXPIRY_DAYS,
  checkReviewExpired,
  reviewExpiredDate,
  getDiffDays,
  // Soccer
  soccerGameStats,
  soccerGamePlayStats,
  soccerGamePlayStatsImage,
  soccerGamePlayerStatusStats,

  // Tennis
  tennisGameStats,
  tennisGamePlayStats,
  tennisGamePlayStatsImage,

  getGameDateTimeInHMSformat,
  getGameDateTimeInDHMformat,
  getGameTimeAgo,
  getGameConvertMinsToTime,
  getNumberSuffix,
  getGameFromToDateDiff,
  getGameHomeScreen,

}
